/* ============================================================
   Google Apps Script: recebe o lead da landing page e grava numa
   planilha do Google Sheets.

   COMO INSTALAR
   1. Crie uma planilha nova no Google Sheets (ou abra a que a Conhecer
      já usa) e deixe a aba onde os leads vão cair como a aba ativa.
   2. Menu Extensões > Apps Script.
   3. Apague o conteúdo e cole este arquivo inteiro.
   4. Salve. Depois clique em "Implantar" > "Nova implantação".
   5. Tipo: "App da Web".
      - Executar como: Eu
      - Quem pode acessar: Qualquer pessoa
      (Precisa ser "qualquer pessoa": quem envia é o navegador de quem
       preencheu o formulário, que não está logado na conta da Conhecer.)
   6. Copie a URL que termina em /exec e cole em script.js, em
      CONFIG.DESTINOS_LEAD.planilha.

   COMO TESTAR DEPOIS DE PUBLICAR
   Abra a página, preencha o formulário com um nome tipo "TESTE" e envie.
   A linha tem que aparecer na planilha em poucos segundos. Se não
   aparecer, o problema está aqui, não na página: a página não consegue
   saber se o envio deu certo (ver o comentário em script.js).

   ATENÇÃO
   A URL do app da web fica visível no código da página, que é público.
   Qualquer pessoa que a descobrir pode mandar linhas para a planilha.
   Para uma captação de campanha isso é aceitável, mas se começar a
   entrar lixo, o caminho é trocar por um endpoint próprio com validação.
   ============================================================ */

function doPost(e) {
  try {
    var aba = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var d = JSON.parse(e.postData.contents);

    // Cria o cabeçalho na primeira execução, para a planilha nascer legível.
    if (aba.getLastRow() === 0) {
      aba.appendRow([
        'Data', 'Nome', 'WhatsApp', 'Unidade', 'Curso', 'Consentimento',
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'canal',
        'Página', 'Enviado em (ISO)'
      ]);
    }

    aba.appendRow([
      new Date().toLocaleString('pt-BR'),
      d.nome || '',
      d.whatsapp || '',
      d.unidade || '',
      d.curso || 'Não informado',
      d.consentimento ? 'Sim' : 'Não',
      d.utm_source || '',
      d.utm_medium || '',
      d.utm_campaign || '',
      d.utm_content || '',
      d.canal || '',
      d.pagina_url || '',
      d.enviado_em || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (erro) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: erro.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
