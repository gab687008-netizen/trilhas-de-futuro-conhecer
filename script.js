/* ============================================================
   CONFIGURAÇÃO. Preencher antes de publicar a página
   ============================================================

   WEBHOOK_URL
     URL de um endpoint intermediário (ex: webhook do N8N) que recebe
     o lead e cria o contato no Brota Flow do lado do servidor.
     NUNCA coloque aqui a api-key/Connection-Token do Brota Flow.
     Essas chaves são secretas e o código desta página é público
     (qualquer visitante pode abrir "ver código-fonte" e ler tudo).
     O caminho seguro é: página → webhook do N8N (URL pública, sem
     segredo nenhum) → N8N chama a API do Brota Flow com a chave
     guardada só do lado do servidor.

   WHATSAPP_NUMERO
     Número único de WhatsApp (com DDI+DDD, só dígitos) pro botão
     flutuante e pro link pós-cadastro. Ex: "5531999999999".

   URL_INSCRICAO_OFICIAL
     Link do site oficial do Governo de Minas Gerais para a
     inscrição no Trilhas de Futuro. Só existe quando o edital abrir.
================================================================= */
const CONFIG = {
  WEBHOOK_URL: '',              // [PREENCHER] ex: 'https://seu-n8n.exemplo.com/webhook/trilhas-futuro'
  // Número do técnico da Conhecer, (31) 3222-9330, confirmado pelo Gabriel.
  // É fixo com WhatsApp, o mesmo que o site deles usa nos links wa.me.
  WHATSAPP_NUMERO: '553132229330',
  URL_INSCRICAO_OFICIAL: '',    // [PREENCHER] quando o edital abrir
  MENSAGEM_WHATSAPP_PADRAO: 'Olá! Vim pela página do Trilhas de Futuro e queria ajuda com a inscrição.',

  // Depoimentos em vídeo de alunos, os mesmos que a Conhecer usa no site dela
  // (unifecaf-conhecer/tecnico/js/cursos-ui.js). São vídeos reais: nenhum
  // depoimento desta página é escrito por nós.
  DEPOIMENTOS_YOUTUBE: ['NqhLLb2UfaM', 'OGjDdv7uhBY', 'X39J3C-ZSAY', 'j_aSTsi5jwA']
};

/* ---------- depoimentos em vídeo ----------
   Só carrega a capa. O iframe do YouTube entra quando a pessoa clica, para
   não pesar o carregamento nem entregar cookie de terceiro sem interação. */
function montaDepoimentos(){
  const alvo = document.getElementById('depoimentos');
  if(!alvo || !CONFIG.DEPOIMENTOS_YOUTUBE.length) return;

  alvo.innerHTML = CONFIG.DEPOIMENTOS_YOUTUBE.map((id, i) => `
    <button type="button" class="depo" data-youtube="${id}" aria-label="Assistir ao depoimento ${i + 1} de aluno da Conhecer">
      <img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy">
      <span class="play-mini" aria-hidden="true"></span>
    </button>`).join('');

  alvo.addEventListener('click', (e) => {
    const botao = e.target.closest('button.depo[data-youtube]');
    if(!botao) return;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(botao.dataset.youtube)}?autoplay=1&rel=0`;
    iframe.title = botao.getAttribute('aria-label') || 'Depoimento';
    iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    const caixa = document.createElement('div');
    caixa.className = botao.className;
    caixa.appendChild(iframe);
    botao.replaceWith(caixa);
  });
}

/* ---------- captura de UTM / origem (QR Code, mídias offline) ---------- */
function capturaOrigem(){
  const params = new URLSearchParams(window.location.search);
  const origem = {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    canal: params.get('canal') || ''   // uso livre: "outdoor", "panfleto-bh", "influencer-x" etc.
  };
  // guarda no localStorage pra não perder a origem se a pessoa navegar
  // pela página antes de preencher o formulário
  try{
    const existente = JSON.parse(localStorage.getItem('trilhas.origem') || 'null');
    const temAlgumValor = Object.values(origem).some(v => v);
    if(temAlgumValor) localStorage.setItem('trilhas.origem', JSON.stringify(origem));
    return temAlgumValor ? origem : (existente || origem);
  }catch(e){
    return origem;
  }
}

/* ---------- link do WhatsApp ---------- */
function montaLinkWhatsapp(mensagem){
  if(!CONFIG.WHATSAPP_NUMERO) return '#';
  const texto = encodeURIComponent(mensagem || CONFIG.MENSAGEM_WHATSAPP_PADRAO);
  return `https://wa.me/${CONFIG.WHATSAPP_NUMERO}?text=${texto}`;
}

function aplicaLinksWhatsapp(){
  const botao = document.getElementById('botaoWhatsapp');
  if(botao) botao.href = montaLinkWhatsapp();
}

/* ---------- validação simples de telefone BR ---------- */
function limpaTelefone(valor){
  return valor.replace(/\D+/g, '');
}

/* ---------- envio do formulário ---------- */
async function enviaLead(dados){
  if(!CONFIG.WEBHOOK_URL){
    // sem webhook configurado ainda: não bloqueia o fluxo, só avisa no console
    console.warn('CONFIG.WEBHOOK_URL não definido. Lead não foi enviado a lugar nenhum. Preencha o script.js antes de publicar.');
    return { ok: true, semWebhook: true };
  }
  try{
    const resp = await fetch(CONFIG.WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    return { ok: resp.ok };
  }catch(e){
    return { ok: false, erro: e };
  }
}

function mostraConfirmacao(){
  document.getElementById('formEstado1').hidden = true;
  const estado2 = document.getElementById('formEstado2');
  estado2.hidden = false;
  estado2.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const linkOficial = document.getElementById('linkInscricaoOficial');
  if(CONFIG.URL_INSCRICAO_OFICIAL){
    linkOficial.href = CONFIG.URL_INSCRICAO_OFICIAL;
  } else {
    linkOficial.textContent = 'Inscrições abrem em breve. Avisamos você por WhatsApp';
    linkOficial.removeAttribute('href');
    linkOficial.setAttribute('aria-disabled', 'true');
    linkOficial.style.opacity = '.6';
    linkOficial.style.pointerEvents = 'none';
  }
}

function configuraFormulario(){
  const form = document.getElementById('formLead');
  if(!form) return;

  const origem = capturaOrigem();
  const erroEl = document.getElementById('formErro');
  const botao = document.getElementById('botaoEnviar');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    erroEl.hidden = true;

    const nome = document.getElementById('campoNome').value.trim();
    const whatsappBruto = document.getElementById('campoWhatsapp').value.trim();
    const whatsapp = limpaTelefone(whatsappBruto);
    const unidade = document.getElementById('campoUnidade').value;
    const curso = document.getElementById('campoCurso').value.trim();
    const consentimento = document.getElementById('campoConsentimento').checked;

    if(!nome || whatsapp.length < 10 || !unidade || !consentimento){
      erroEl.textContent = 'Confira: nome, WhatsApp válido, unidade e a concordância acima são obrigatórios.';
      erroEl.hidden = false;
      return;
    }

    botao.disabled = true;
    botao.textContent = 'Enviando...';

    const dados = {
      pagina: 'trilhas-de-futuro',
      nome,
      whatsapp,
      unidade,
      curso: curso || null,
      consentimento: true,
      ...origem,
      pagina_url: window.location.href,
      enviado_em: new Date().toISOString()
    };

    const resultado = await enviaLead(dados);

    botao.disabled = false;
    botao.textContent = 'Quero me cadastrar';

    if(resultado.ok){
      mostraConfirmacao();
    } else {
      erroEl.textContent = 'Não conseguimos enviar agora. Tenta de novo, ou chama no WhatsApp que a gente cadastra você direto.';
      erroEl.hidden = false;
    }
  });
}

function preencheBadgeStatus(){
  const badge = document.getElementById('badgeStatus');
  if(!badge) return;
  // texto curto de propósito: o badge do hero é um pill de uma linha.
  // O convite pra se cadastrar já está no subtítulo e nos botões.
  badge.textContent = CONFIG.URL_INSCRICAO_OFICIAL
    ? 'Inscrições abertas'
    : 'Inscrições abrem em breve';
  document.title = CONFIG.URL_INSCRICAO_OFICIAL
    ? 'Inscrições abertas | Curso técnico gratuito na Conhecer'
    : document.title;
}

document.addEventListener('DOMContentLoaded', () => {
  aplicaLinksWhatsapp();
  configuraFormulario();
  preencheBadgeStatus();
  montaDepoimentos();
});
