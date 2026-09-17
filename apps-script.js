/* ============================================================
   Google Apps Script: recebe o lead da landing page, grava numa planilha
   e encaminha para o CRM.

   POR QUE ESTE ARQUIVO EXISTE, E NÃO UM ENVIO DIRETO PARA O CRM

   A landing page é pública: qualquer visitante abre "ver código-fonte" e lê
   tudo que estiver lá. Se a chave de API do CRM estivesse na página, essa
   pessoa teria acesso ao CRM inteiro da Conhecer.

   Por isso o caminho é:

       página  →  este Apps Script  →  planilha (cópia de segurança)
                                    →  CRM (Brota Flow)

   O Apps Script roda nos servidores do Google, não no navegador de quem
   preencheu. A chave fica guardada aqui, nas Propriedades do Script, e nunca
   chega ao navegador de ninguém.

   A planilha continua sendo gravada mesmo quando o CRM responde. É de
   propósito: se o CRM cair, o lead não se perde.

   ÚNICA EXCEÇÃO: se o Brota Flow oferecer um endpoint público de formulário,
   que não precise de chave nenhuma, aí a página pode chamar direto e este
   arquivo vira só a cópia de segurança. Vale perguntar à Brota se existe.

   ------------------------------------------------------------
   INSTALAÇÃO

   1. Crie uma planilha no Google Sheets e deixe ativa a aba dos leads.
   2. Extensões > Apps Script. Apague tudo e cole este arquivo.
   3. Configure a chave do CRM SEM colocá-la no código:
      Engrenagem (Configurações do projeto) > Propriedades do script >
      Adicionar propriedade. Crie duas:
        BROTA_FLOW_URL    a URL de entrada de leads do CRM
        BROTA_FLOW_TOKEN  a chave/token (deixe em branco se não precisar)
      Enquanto BROTA_FLOW_URL estiver vazia, o script só grava na planilha.
   4. Implantar > Nova implantação > App da Web.
        Executar como: Eu
        Quem pode acessar: Qualquer pessoa
      ("Qualquer pessoa" é obrigatório: quem envia é o navegador de quem
       preencheu o formulário, que não está logado na conta da Conhecer.)
   5. Copie a URL que termina em /exec e cole em script.js, em
      CONFIG.DESTINOS_LEAD.planilha.

   TESTE DEPOIS DE PUBLICAR
   Abra a página, preencha com o nome "TESTE" e envie. A linha tem que
   aparecer na planilha em segundos, e a coluna "Status CRM" mostra se o
   encaminhamento deu certo. A página NÃO consegue saber se o envio chegou
   (ver o comentário em script.js), então este teste é o que vale.

   ATENÇÃO
   A URL do app da web fica visível no código da página, que é público.
   Qualquer um que a descubra pode mandar linhas para a planilha. Para uma
   captação de campanha isso é aceitável. Se começar a entrar lixo, o caminho
   é trocar por um endpoint próprio com validação.
   ============================================================ */

var COLUNAS = [
  'Data', 'Nome', 'WhatsApp', 'Unidade', 'Curso', 'Consentimento',
  'Bloco',                      // "hero" ou "fechamento": de qual formulário veio
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'canal',
  'Página', 'Enviado em (ISO)', 'Status CRM'
];

function doPost(e) {
  try {
    var aba = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var d = JSON.parse(e.postData.contents);

    if (aba.getLastRow() === 0) aba.appendRow(COLUNAS);

    var resultadoCRM = enviarParaCRM(d);

    aba.appendRow([
      new Date().toLocaleString('pt-BR'),
      d.nome || '',
      d.whatsapp || '',
      d.unidade || '',
      d.curso || 'Não informado',
      d.consentimento ? 'Sim' : 'Não',
      d.bloco || '',
      d.utm_source || '',
      d.utm_medium || '',
      d.utm_campaign || '',
      d.utm_content || '',
      d.canal || '',
      d.pagina_url || '',
      d.enviado_em || '',
      resultadoCRM.resumo
    ]);

    return json({ status: 'success', crm: resultadoCRM.resumo });

  } catch (erro) {
    return json({ status: 'error', message: erro.toString() });
  }
}

/* ------------------------------------------------------------
   Encaminha o lead para o CRM.

   [AJUSTAR] O corpo abaixo usa nomes genéricos. Quando a Brota mandar a
   documentação da rota de entrada de leads, troque o objeto "corpo" pelos
   campos que o Brota Flow espera de verdade, e confirme se a autenticação é
   por "Authorization: Bearer", por outro cabeçalho, ou por um campo no corpo.

   Nunca escreva a chave aqui. Ela vem das Propriedades do Script.
   ------------------------------------------------------------ */
function enviarParaCRM(d) {
  var props = PropertiesService.getScriptProperties();
  var url = props.getProperty('BROTA_FLOW_URL');
  var token = props.getProperty('BROTA_FLOW_TOKEN');

  if (!url) return { ok: false, resumo: 'CRM não configurado' };

  var corpo = {
    nome: d.nome,
    telefone: d.whatsapp,
    origem: 'Landing Page Trilhas de Futuro',
    unidade: d.unidade,
    curso: d.curso || null,
    bloco: d.bloco || null,
    utm_source: d.utm_source || null,
    utm_medium: d.utm_medium || null,
    utm_campaign: d.utm_campaign || null,
    canal: d.canal || null,
    consentimento: !!d.consentimento
  };

  var cabecalhos = {};
  if (token) cabecalhos.Authorization = 'Bearer ' + token;

  try {
    var resp = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      headers: cabecalhos,
      payload: JSON.stringify(corpo),
      muteHttpExceptions: true          // erro do CRM não pode derrubar a gravação na planilha
    });
    var codigo = resp.getResponseCode();
    var ok = codigo >= 200 && codigo < 300;
    return {
      ok: ok,
      resumo: ok ? 'OK (' + codigo + ')' : 'FALHOU (' + codigo + '): ' + resp.getContentText().slice(0, 180)
    };
  } catch (erro) {
    return { ok: false, resumo: 'FALHOU: ' + erro.toString().slice(0, 180) };
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ------------------------------------------------------------
   Roda este daqui pelo editor do Apps Script (botão Executar) para testar o
   encaminhamento ao CRM sem precisar preencher o formulário. Veja o
   resultado em Execuções, no menu da esquerda.
   ------------------------------------------------------------ */
function testarCRM() {
  var r = enviarParaCRM({
    nome: 'TESTE Apps Script',
    whatsapp: '5531999999999',
    unidade: 'Belo Horizonte',
    curso: 'Enfermagem',
    canal: 'teste-manual',
    consentimento: true
  });
  Logger.log(r.resumo);
  return r;
}
