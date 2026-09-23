/* ============================================================
   Google Apps Script: recebe os avisos da página de orientação, grava numa
   planilha e encaminha para o CRM.

   POR QUE ESTE ARQUIVO EXISTE

   A página é pública: qualquer visitante abre "ver código-fonte" e lê tudo
   que estiver lá. Se a chave de API do Brota Flow estivesse na página, essa
   pessoa teria acesso ao CRM inteiro da Conhecer.

   Por isso o caminho é:

       página  →  este Apps Script  →  planilha (registro que sempre grava)
                                    →  Brota Flow (quando configurado)

   O script roda nos servidores do Google, não no navegador de quem abriu a
   página. A chave fica nas Propriedades do Script e nunca chega ao navegador
   de ninguém.

   A planilha grava SEMPRE, mesmo com o CRM ligado. Dois motivos: se o CRM
   cair, o aviso não se perde; e enquanto o Brota Flow não estiver ligado,
   a planilha sozinha já mostra quem abriu, quem assistiu e quem foi se
   inscrever. Ou seja: dá para colocar no ar hoje e ligar o CRM depois.

   ------------------------------------------------------------
   O QUE CHEGA AQUI

   Três eventos, mandados pela página:

     pagina_aberta     a pessoa abriu o link que o atendente mandou
     video_75          assistiu 75% do vídeo de orientação
     clicou_inscricao  clicou para ir ao site do Governo

   Cada um vem assim:

     { "lead": "CT-8842", "evento": "video_75",
       "em": "2026-09-23T18:04:11.000Z",
       "pagina_url": "https://.../?lead=CT-8842&nome=Ana" }

   ------------------------------------------------------------
   INSTALAÇÃO (uns 15 minutos)

   1. Crie uma planilha no Google Sheets. Nome sugerido:
      "Trilhas de Futuro - avisos da página".

   2. Nela: Extensões > Apps Script. Apague o que estiver lá e cole este
      arquivo inteiro. Salve.

   3. Configure o CRM SEM colocar a chave no código:
      Engrenagem (Configurações do projeto) > Propriedades do script >
      Adicionar propriedade. Crie as duas:

        BROTA_FLOW_URL     a URL de entrada do Brota Flow
        BROTA_FLOW_TOKEN   a chave/token (deixe vazia se não precisar)

      Enquanto BROTA_FLOW_URL estiver vazia o script só grava na planilha,
      sem erro nenhum. É o modo de começar.

   4. Implantar > Nova implantação > App da Web.
        Executar como: Eu
        Quem pode acessar: Qualquer pessoa

      "Qualquer pessoa" é obrigatório: quem envia é o navegador da aluna, que
      não está logada na conta da Conhecer. Leia a seção LIMITE antes de se
      assustar com isso.

   5. Copie a URL que termina em /exec e cole em script.js, em
      CONFIG.AVISO_CRM.

   6. Abra a página com ?lead=TESTE-1 no fim da URL. Em segundos deve
      aparecer uma linha "pagina_aberta" na planilha.

   ------------------------------------------------------------
   LIMITE CONHECIDO: o endpoint é público

   A URL deste script fica no código da página, que qualquer um lê. Quem a
   descobrir consegue mandar avisos falsos ("o lead X assistiu o vídeo").

   Isso não tem solução em página estática: qualquer coisa que o navegador
   precise saber para autenticar, o visitante também sabe. O que dá para
   fazer é limitar o dano, e é o que este script faz:

     - só aceita os três eventos conhecidos, nada além disso;
     - só aceita lead com cara de identificador (não aceita texto livre);
     - ignora corpo grande demais.

   E o principal: estes avisos não mudam nada no cadastro. Eles dizem
   "aconteceu isso com o lead X". O CRM deve tratá-los como sinal para o
   atendente, não como verdade que dispare cobrança automática de dinheiro
   ou mude status de matrícula.

   Se um dia começar a entrar lixo, o caminho é trocar por um endpoint
   próprio que valide o lead contra a base antes de aceitar.
   ============================================================ */

var COLUNAS = ['Data', 'Lead', 'Evento', 'Enviado pela página em', 'URL da página', 'Status CRM'];

// Os únicos eventos aceitos. Qualquer outro nome é descartado.
var EVENTOS_VALIDOS = ['pagina_aberta', 'video_75', 'clicou_inscricao'];

// Identificador de lead: letras, números, hífen, sublinhado e ponto, até 64
// caracteres. Serve para barrar texto livre e tentativa de injeção.
var FORMATO_LEAD = /^[A-Za-z0-9._-]{1,64}$/;

// Corpo maior que isso é descarte na hora, sem nem tentar interpretar.
var TAMANHO_MAXIMO = 4000;


function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return resposta({ ok: false, erro: 'corpo vazio' });
    if (e.postData.contents.length > TAMANHO_MAXIMO) return resposta({ ok: false, erro: 'corpo grande demais' });

    var dados = JSON.parse(e.postData.contents);

    var lead = String(dados.lead || '');
    var evento = String(dados.evento || '');

    if (!FORMATO_LEAD.test(lead)) return resposta({ ok: false, erro: 'lead inválido' });
    if (EVENTOS_VALIDOS.indexOf(evento) === -1) return resposta({ ok: false, erro: 'evento desconhecido' });

    // O CRM vai primeiro: assim o status dele entra na mesma linha da planilha,
    // e quem abrir a planilha vê num lugar só o que chegou e o que foi adiante.
    var status = encaminhaParaCRM(lead, evento, dados);
    gravaNaPlanilha(lead, evento, dados, status);

    return resposta({ ok: true });

  } catch (err) {
    // Registra a falha na própria planilha: sem isso, erro aqui dentro vira
    // silêncio, e silêncio é indistinguível de "ninguém abriu a página".
    try { gravaNaPlanilha('', 'ERRO', {}, String(err)); } catch (ignorado) {}
    return resposta({ ok: false, erro: String(err) });
  }
}


/* A página manda com mode:'no-cors' e nem lê esta resposta. Ela existe para
   quem testar o endpoint na mão, com curl ou pelo navegador. */
function resposta(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}


function gravaNaPlanilha(lead, evento, dados, status) {
  var aba = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  // Cria o cabeçalho na primeira vez, para a planilha nascer legível.
  if (aba.getLastRow() === 0) {
    aba.appendRow(COLUNAS);
    aba.getRange(1, 1, 1, COLUNAS.length).setFontWeight('bold');
    aba.setFrozenRows(1);
  }

  aba.appendRow([
    new Date(),                       // quando chegou aqui
    lead,
    evento,
    dados.em || '',                   // quando o navegador disparou
    dados.pagina_url || '',
    status
  ]);
}


/* Encaminha para o Brota Flow. Devolve o texto que vai para a coluna
   "Status CRM": é ele que diz se o aviso passou daqui ou parou aqui. */
function encaminhaParaCRM(lead, evento, dados) {
  var props = PropertiesService.getScriptProperties();
  var url = props.getProperty('BROTA_FLOW_URL');
  var token = props.getProperty('BROTA_FLOW_TOKEN');

  if (!url) return 'CRM não configurado';

  var cabecalhos = { 'Content-Type': 'application/json' };
  if (token) cabecalhos['Authorization'] = 'Bearer ' + token;

  try {
    var r = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      headers: cabecalhos,
      payload: JSON.stringify({
        lead: lead,
        evento: evento,
        em: dados.em || new Date().toISOString(),
        origem: 'pagina-trilhas'
      }),
      muteHttpExceptions: true   // erro do CRM não pode derrubar a gravação
    });

    var codigo = r.getResponseCode();
    return (codigo >= 200 && codigo < 300)
      ? 'OK ' + codigo
      : 'FALHOU ' + codigo + ': ' + r.getContentText().slice(0, 200);

  } catch (err) {
    return 'FALHOU: ' + String(err).slice(0, 200);
  }
}


/* Responde a quem abrir a URL no navegador, só para não parecer quebrado.
   Nenhum aviso é aceito por GET. */
function doGet() {
  return resposta({ ok: true, mensagem: 'Endpoint de avisos da página do Trilhas de Futuro. Use POST.' });
}
