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
  /* Destinos do lead. Todos os preenchidos recebem a mesma informação.
     Vazio = não envia para aquele destino.

     planilha: URL do Google Apps Script publicado como app da web
       ("Executar como: eu" e "Quem pode acessar: qualquer pessoa").
       O código para colar está em apps-script.js, neste repositório.
       É o caminho que o próprio site da Conhecer usa hoje.

     crm: rota de entrada de lead do Brota Flow, quando o CRM passar a
       expor uma. Hoje o site da Conhecer deixa esse campo vazio com a
       nota "o CRM ainda não expõe essa rota".

     NUNCA coloque api-key aqui: o código desta página é público. */
  DESTINOS_LEAD: {
    planilha: '',               // [PREENCHER] ex: 'https://script.google.com/macros/s/AKfy.../exec'
    crm: ''                     // [PREENCHER] quando o Brota Flow expuser a rota
  },

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

/* ---------- números que contam ----------
   Conta de zero até o valor quando a faixa entra na tela, uma vez só. O texto
   final já está no HTML, então quem não tem JS vê o número certo parado. */
function montaNumerosAnimados(){
  const alvos = document.querySelectorAll('[data-numero]');
  if(!alvos.length) return;

  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(semMovimento || !('IntersectionObserver' in window)) return;

  const conta = (el) => {
    const destino = parseInt(el.dataset.numero, 10);
    const prefixo = el.dataset.prefixo || '';
    const sufixo  = el.dataset.sufixo  || '';
    const duracao = 1100;
    const inicio  = performance.now();

    const quadro = (agora) => {
      const t = Math.min((agora - inicio) / duracao, 1);
      const suave = 1 - Math.pow(1 - t, 3);          // desacelera no fim
      el.textContent = prefixo + Math.round(destino * suave) + sufixo;
      if(t < 1) requestAnimationFrame(quadro);
      else el.textContent = prefixo + destino + sufixo;
    };
    requestAnimationFrame(quadro);
  };

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(en => {
      if(!en.isIntersecting) return;
      observador.unobserve(en.target);
      conta(en.target);
    });
  }, { threshold: 0.6 });

  alvos.forEach(el => { el.textContent = (el.dataset.prefixo || '') + '0' + (el.dataset.sufixo || ''); observador.observe(el); });
}

/* ---------- carrosséis que passam sozinhos ----------
   Andam de um card por vez, no intervalo que o data-auto-passa define em
   milissegundos. Ao chegar no fim, voltam ao começo.

   Qualquer toque, clique ou arrasto PARA o carrossel de vez, e ele não volta
   a andar sozinho. É de propósito: se a pessoa interagiu, foi porque quer ler
   com calma, e um carrossel que volta a andar sozinho atrapalha. */
function montaCarrosseisAutomaticos(){
  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-auto-passa]').forEach(trilho => {
    const intervalo = parseInt(trilho.dataset.autoPassa, 10) || 6000;
    let parado = semMovimento;
    let relogio = null;

    const rolavel = () => trilho.scrollWidth > trilho.clientWidth + 4;

    const passo = () => {
      if(parado || !rolavel()) return;
      const cards = trilho.children;
      if(!cards.length) return;
      const largura = cards[0].getBoundingClientRect().width
                    + parseFloat(getComputedStyle(trilho).columnGap || 0);
      const fim = trilho.scrollLeft + trilho.clientWidth >= trilho.scrollWidth - 8;
      trilho.scrollTo({ left: fim ? 0 : trilho.scrollLeft + largura, behavior: 'smooth' });
    };

    const parar = () => {
      parado = true;
      if(relogio){ clearInterval(relogio); relogio = null; }
    };
    ['pointerdown','touchstart','wheel','keydown'].forEach(ev =>
      trilho.addEventListener(ev, parar, { passive: true }));

    if(!parado) relogio = setInterval(passo, intervalo);
    trilho.dataset.pararCarrossel = '1';
    trilho.pararCarrossel = parar;
  });
}

/* a esteira de parceiros também para quando alguém toca nela */
function paraEsteiraNoToque(){
  const janela = document.querySelector('.parceiros-janela');
  if(!janela) return;
  ['pointerdown','touchstart'].forEach(ev =>
    janela.addEventListener(ev, () => janela.classList.add('parado'), { passive: true, once: true }));
}

/* ---------- visor de foto ampliada ----------
   As fotos com data-ampliar abrem num visor sobre a página. Fecha no X, no
   fundo, no Esc ou no botão voltar do navegador. */
function montaVisorDeFotos(){
  const visor = document.getElementById('visor');
  if(!visor) return;
  const img  = visor.querySelector('img');
  const cap  = visor.querySelector('figcaption');
  const sair = visor.querySelector('.visor-fechar');
  let ultimoFoco = null;

  function abre(origem){
    img.src = origem.currentSrc || origem.src;
    img.alt = origem.alt || '';
    const legenda = origem.closest('figure') && origem.closest('figure').querySelector('figcaption');
    cap.textContent = legenda ? legenda.textContent : (origem.alt || '');
    cap.hidden = !cap.textContent;
    visor.hidden = false;
    document.body.style.overflow = 'hidden';
    ultimoFoco = document.activeElement;
    sair.focus();
  }
  function fecha(){
    visor.hidden = true;
    img.src = '';
    document.body.style.overflow = '';
    if(ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  document.addEventListener('click', (e) => {
    const foto = e.target.closest('img[data-ampliar]');
    if(foto){ e.preventDefault(); abre(foto); return; }
    if(e.target === visor || e.target === sair) fecha();
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && !visor.hidden) fecha();
  });
}

/* ---------- dissuasão de download ----------
   ATENÇÃO, e isto precisa ficar claro: NÃO EXISTE bloqueio real de download
   numa página web. Qualquer pessoa tira print, abre o código-fonte ou usa o
   inspetor do navegador e pega a imagem. O que dá para fazer é tirar os
   caminhos fáceis: o menu do botão direito, o arrastar para a área de
   trabalho e o toque longo do celular. É dissuasão, não proteção.
   Se alguma foto não puder circular de jeito nenhum, ela não pode estar
   numa página pública. */
function dissuadeDownload(){
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', e => e.preventDefault());
    img.addEventListener('dragstart',  e => e.preventDefault());
    img.setAttribute('draggable', 'false');
  });
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

/* ---------- envio do formulário ----------

   Por que 'no-cors' e 'text/plain':

   O navegador tem uma regra de segurança (CORS). Quando uma página manda
   um POST com Content-Type 'application/json' para outro domínio, ele
   primeiro dispara um pedido de permissão (preflight OPTIONS). O Google
   Apps Script não responde a OPTIONS, então o envio morre antes de chegar
   lá. Com 'text/plain' o navegador considera o pedido simples e manda
   direto, sem preflight. O corpo continua sendo JSON: o doPost do Apps
   Script lê e-postData.contents e faz JSON.parse normalmente.

   O preço disso é que 'no-cors' devolve uma resposta opaca: não dá para
   saber se o destino aceitou. Então este envio é "dispara e segue". Se o
   Apps Script estiver quebrado, a pessoa ainda vê a tela de confirmação.
   Por isso a planilha precisa ser conferida de vez em quando, e é por isso
   que existe o teste descrito no README.
*/
function destinosAtivos(){
  return Object.values(CONFIG.DESTINOS_LEAD || {}).filter(Boolean);
}

async function enviaLead(dados){
  const destinos = destinosAtivos();

  if(!destinos.length){
    console.warn('Nenhum destino configurado em CONFIG.DESTINOS_LEAD. O lead NÃO foi enviado a lugar nenhum. Preencha antes de publicar.');
    return { ok: true, semDestino: true };
  }

  const corpo = JSON.stringify(dados);
  destinos.forEach(url => {
    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: true,                                   // sobrevive se a pessoa sair da página
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: corpo
    }).catch(() => {});                                  // resposta opaca: não há o que tratar
  });

  return { ok: true };
}

/* ---------- eventos de conversão (GA4 e Meta) ---------- */
function eventoConversao(dados){
  if(typeof window.gtag === 'function'){
    window.gtag('event', 'generate_lead', {
      unidade: dados.unidade,
      curso: dados.curso || 'nao informado',
      canal: dados.canal || '',
      bloco: dados.bloco
    });
  }
  if(typeof window.fbq === 'function'){
    window.fbq('track', 'Lead', { content_name: 'Trilhas de Futuro', unidade: dados.unidade });
  }
}

/* ---------- formulários ----------
   A página tem DOIS blocos de conversão: um no hero e um no fechamento,
   depois do FAQ. Por isso nada aqui usa getElementById: IDs teriam que ser
   únicos e o segundo bloco ficaria morto. Cada bloco é encontrado por
   [data-conversao] e tratado isoladamente, com querySelector dentro dele. */

function mostraConfirmacao(bloco){
  bloco.querySelector('[data-estado="inicial"]').hidden = true;
  const confirmado = bloco.querySelector('[data-estado="confirmado"]');
  confirmado.hidden = false;
  confirmado.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const linkOficial = confirmado.querySelector('[data-link-oficial]');
  if(!linkOficial) return;

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

function configuraFormulario(bloco, origem){
  const form = bloco.querySelector('form');
  if(!form) return;

  const erroEl = bloco.querySelector('.form-erro');
  const botao  = form.querySelector('button[type="submit"]');
  const rotuloBotao = botao ? botao.textContent : 'Quero me cadastrar';
  const campo = (nome) => form.querySelector('[name="' + nome + '"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    erroEl.hidden = true;

    const nome     = campo('nome').value.trim();
    const whatsapp = limpaTelefone(campo('whatsapp').value.trim());
    const unidade  = campo('unidade').value;
    const curso    = campo('curso').value.trim();
    const consentimento = campo('consentimento').checked;

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
      // de qual dos dois blocos veio, para medir onde a página converte
      bloco: bloco.id === 'form' ? 'hero' : 'fechamento',
      ...origem,
      pagina_url: window.location.href,
      enviado_em: new Date().toISOString()
    };

    const resultado = await enviaLead(dados);

    botao.disabled = false;
    botao.textContent = rotuloBotao;

    if(resultado.ok){
      eventoConversao(dados);
      mostraConfirmacao(bloco);
    } else {
      erroEl.textContent = 'Não conseguimos enviar agora. Tenta de novo, ou chama no WhatsApp que a gente cadastra você direto.';
      erroEl.hidden = false;
    }
  });
}

function configuraFormularios(){
  const origem = capturaOrigem();
  document.querySelectorAll('[data-conversao]').forEach(bloco => configuraFormulario(bloco, origem));
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
  configuraFormularios();
  preencheBadgeStatus();
  montaDepoimentos();
  montaNumerosAnimados();
  montaCarrosseisAutomaticos();
  paraEsteiraNoToque();
  montaVisorDeFotos();
  dissuadeDownload();
});
