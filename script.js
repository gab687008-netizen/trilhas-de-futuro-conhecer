/* ============================================================
   CONFIGURAÇÃO. Preencher antes de publicar a página
   ============================================================

   O lead desta campanha NÃO nasce nesta página. Ele nasce na conversa do
   WhatsApp e vai para o CRM pela API oficial. A página é apoio: ela convence
   e empurra para a conversa. Por isso não existe formulário aqui.

   WHATSAPP_NUMERO
     Número com DDI+DDD, só dígitos. Ex: "5531999999999".

   CONVERSAS
     A mensagem que já vai escrita quando a pessoa abre o WhatsApp, uma por
     seção da página.

   URL_INSCRICAO_OFICIAL
     Link do site do Governo de Minas para a inscrição. Só existe quando o
     edital abrir. Enquanto estiver vazio, o selo do topo diz "abrem em breve".
================================================================= */
const CONFIG = {

  // Número do técnico da Conhecer, (31) 3222-9330, confirmado pelo Gabriel.
  // É fixo com WhatsApp, o mesmo que o site deles usa nos links wa.me.
  WHATSAPP_NUMERO: '553132229330',
  URL_INSCRICAO_OFICIAL: '',    // [PREENCHER] quando o edital abrir

  /* Uma mensagem por seção da página. O agente de IA do CRM usa esse texto
     para saber o contexto antes mesmo de responder a primeira vez.
     Se editar, mantenha cada uma DIFERENTE das outras: é a diferença entre
     elas que permite classificar de onde a pessoa veio. */
  CONVERSAS: {
    hero:       'Oi! Vim pela página do Trilhas de Futuro e quero me inscrever.',
    areas:      'Oi! Vim pela página do Trilhas de Futuro e queria saber quais cursos têm na minha unidade.',
    parceiros:  'Oi! Vim pela página do Trilhas de Futuro e queria saber sobre o estágio garantido.',
    passos:     'Oi! Vim pela página do Trilhas de Futuro e quero começar minha inscrição.',
    fechamento: 'Oi! Vim pela página do Trilhas de Futuro e quero garantir minha vaga.',
    flutuante:  'Oi! Vim pela página do Trilhas de Futuro e queria tirar uma dúvida.'
  },

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

/* ---------- links do WhatsApp ----------
   Cada botão leva a uma mensagem diferente, conforme a seção de onde a pessoa
   clicou (o atributo data-whatsapp). É assim que o agente de IA do CRM sabe o
   contexto antes de responder.

   Quem chega por QR code ou por link com ?canal= leva esse código discreto no
   fim da mensagem: é o que separa o panfleto de Ribeirão do anúncio. Para
   tráfego de anúncio Click-to-WhatsApp isso não é necessário, porque a própria
   Meta entrega a origem junto da conversa. */
function montaLinkWhatsapp(secao, origem){
  if(!CONFIG.WHATSAPP_NUMERO) return '#';

  let texto = CONFIG.CONVERSAS[secao] || CONFIG.CONVERSAS.flutuante;
  const marca = (origem && (origem.canal || origem.utm_source)) || '';
  if(marca) texto += ' (ref: ' + marca + ')';

  return 'https://wa.me/' + CONFIG.WHATSAPP_NUMERO + '?text=' + encodeURIComponent(texto);
}

function aplicaLinksWhatsapp(){
  const origem = capturaOrigem();

  document.querySelectorAll('[data-whatsapp]').forEach(botao => {
    const secao = botao.dataset.whatsapp;
    botao.href = montaLinkWhatsapp(secao, origem);
    botao.target = '_blank';
    botao.rel = 'noopener';
    botao.addEventListener('click', () => eventoConversao(secao, origem));
  });
}

/* ---------- eventos de conversão (GA4 e Meta) ----------
   Sem formulário, a conversão que a página consegue medir é o clique que abre
   o WhatsApp. Isso NÃO é a mesma coisa que um lead: a pessoa pode abrir e não
   mandar a mensagem. O número real de conversas está no CRM, e é com ele que
   estes números devem ser conferidos de tempos em tempos. */
function eventoConversao(secao, origem){
  if(typeof window.gtag === 'function'){
    window.gtag('event', 'generate_lead', {
      metodo: 'whatsapp',
      secao: secao,
      canal: (origem && origem.canal) || '',
      utm_source: (origem && origem.utm_source) || ''
    });
  }
  if(typeof window.fbq === 'function'){
    window.fbq('track', 'Contact', { content_name: 'Trilhas de Futuro', secao: secao });
  }
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
  preencheBadgeStatus();
  montaDepoimentos();
  montaNumerosAnimados();
  montaCarrosseisAutomaticos();
  paraEsteiraNoToque();
  montaVisorDeFotos();
  dissuadeDownload();
});
