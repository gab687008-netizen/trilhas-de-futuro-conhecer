/* ============================================================
   CONFIGURAÇÃO. Preencher antes de publicar a página
   ============================================================

   Esta página NÃO capta lead. Ele nasceu na conversa do WhatsApp, pelo anúncio
   Click-to-WhatsApp, e já está no CRM. O atendente manda o link desta página
   dentro da conversa, com ?lead=<id do contato> na URL. Daqui a página faz três
   coisas: mostra o vídeo, ensina o passo a passo da inscrição no site do
   Governo, e avisa o CRM do que a pessoa fez. Por isso não existe formulário.

   WHATSAPP_NUMERO
     Número com DDI+DDD, só dígitos. Ex: "5531999999999".

   CONVERSAS
     A mensagem que já vai escrita quando a pessoa abre o WhatsApp, uma por
     seção da página. Como ela já está em conversa, são mensagens de retorno,
     não de apresentação.

   URL_INSCRICAO_OFICIAL
     Link do site do Governo de Minas para a inscrição. Só existe quando o
     edital abrir. Enquanto estiver vazio, o selo do topo diz "abrem em breve".
================================================================= */
const CONFIG = {

  // Número do técnico da Conhecer, (31) 3222-9330, confirmado pelo Gabriel.
  WHATSAPP_NUMERO: '553132229330',

  // [PREENCHER] ID do vídeo no YouTube, só o código. Ex: 'dQw4w9WgXcQ'.
  // Vazio = aparece o espaço reservado e nada é acompanhado.
  VIDEO_YOUTUBE: '',

  /* Destino do botão principal.

     Hoje aponta para a página do programa, que é o caminho oficial: é por ali
     que a pessoa chega em "Estudantes > Quero me inscrever". Quando o edital
     abrir e existir o endereço direto do formulário, troque aqui e o passo a
     passo continua valendo — ele já descreve essa navegação.

     Vazio faz o botão trocar de papel e virar "Quero ser avisado quando
     abrir", pelo WhatsApp. */
  URL_INSCRICAO_OFICIAL: 'https://www.trilhasdefuturo.mg.gov.br/',

  /* [PREENCHER] Endpoint do CRM que recebe os avisos desta página.
     A página manda um POST com { lead, evento, em } nestes momentos:
       pagina_aberta     a pessoa abriu o link que o atendente mandou
       video_75          assistiu 75% do vídeo
       clicou_inscricao  clicou para ir ao site do Governo

     O lead vem do ?lead= na URL. Sem ele a página funciona igual, só não
     tem como dizer QUEM fez o quê, então nada é enviado.

     NUNCA coloque chave de API aqui: esta página é pública. Se o CRM exigir
     autenticação, o endpoint precisa ser um intermediário que guarde a chave
     do lado do servidor. */
  AVISO_CRM: '',

  /* Mensagens do WhatsApp, por seção. Quem abre esta página VEIO da conversa,
     então nada aqui se apresenta de novo: as mensagens continuam de onde o
     atendimento parou. */
  CONVERSAS: {
    duvida:   'Oi! Estou na página de orientação e fiquei com uma dúvida:',
    // Usada quando as inscrições ainda não abriram: o botão de cima vira
    // pedido de aviso em vez de mandar a pessoa para um site fechado.
    avisar:   'Oi! Quero ser avisado assim que as inscrições do Trilhas abrirem.',
    // Texto de reserva, para o caso de algum botão aparecer sem mensagem própria.
    flutuante: 'Oi! Estou na página de orientação e fiquei com uma dúvida.'
  },

  // Depoimentos em vídeo de alunos, os mesmos que a Conhecer usa no site dela.
  DEPOIMENTOS_YOUTUBE: ['NqhLLb2UfaM', 'OGjDdv7uhBY', 'X39J3C-ZSAY', 'j_aSTsi5jwA']
};

/* ---------- quem está vendo ----------
   O atendente manda o link com ?lead=ID e, se quiser, &nome=Ana Clara.
   O ID é o que amarra os avisos desta página ao contato certo no CRM. */
function dadosDoLead(){
  const p = new URLSearchParams(window.location.search);
  return { lead: p.get('lead') || '', nome: (p.get('nome') || '').trim() };
}

/* ---------- avisos para o CRM ----------
   Dispara e segue, igual ao envio de lead de antes: com no-cors a resposta é
   opaca e a página não consegue saber se chegou. Quem confere é o CRM.
   Sem AVISO_CRM configurado ou sem ?lead= na URL, não envia nada. */
/* Quantas horas esperar antes de repetir o mesmo aviso para o mesmo lead.
   Sem isso, cada recarga da página vira um aviso novo e o atendente vê
   "Ana Clara abriu a página" oito vezes seguidas, o que é pior que não ver
   nada: ele para de olhar.

   pagina_aberta se repete depois de 6 horas porque voltar na página no dia
   seguinte é informação de verdade. Os outros dois são marcos: aconteceram
   uma vez e pronto.

   A memória disso é o localStorage, que é por navegador. Quem abre no celular
   e depois no computador gera dois avisos. A deduplicação que vale é a do
   CRM; esta aqui só tira o grosso do ruído. */
const JANELA_DO_AVISO = { pagina_aberta: 6, video_75: Infinity, clicou_inscricao: Infinity };

function jaAvisou(evento, lead){
  const chave = 'trilhas.aviso.' + lead + '.' + evento;
  const horas = JANELA_DO_AVISO[evento];
  try{
    const ultimo = Number(localStorage.getItem(chave) || 0);
    if(ultimo && (horas === Infinity || Date.now() - ultimo < horas * 3600000)) return true;
    localStorage.setItem(chave, String(Date.now()));
  }catch(e){
    // Navegador anônimo ou storage bloqueado: manda mesmo assim. Aviso
    // repetido incomoda; aviso que nunca chega quebra o funil.
  }
  return false;
}

function avisaCRM(evento, extra){
  const { lead } = dadosDoLead();
  if(!CONFIG.AVISO_CRM || !lead) return;
  if(jaAvisou(evento, lead)) return;

  fetch(CONFIG.AVISO_CRM, {
    method: 'POST',
    mode: 'no-cors',
    keepalive: true,
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(Object.assign({
      lead: lead,
      evento: evento,
      em: new Date().toISOString(),
      pagina_url: window.location.href
    }, extra || {}))
  }).catch(() => {});
}

/* ---------- saudação com o nome ---------- */
function montaSaudacao(){
  const { nome } = dadosDoLead();
  const alvo = document.querySelector('[data-saudacao]');
  if(!alvo || !nome) return;

  alvo.textContent = nome.split(' ')[0] + ', ';
  alvo.hidden = false;

  // "Ana, Seu passo a passo" fica errado: com a saudação na frente, o título
  // vira continuação da frase e começa em minúscula.
  const titulo = document.querySelector('[data-titulo]');
  if(titulo) titulo.textContent = titulo.textContent.charAt(0).toLowerCase() + titulo.textContent.slice(1);
}

/* ---------- o vídeo, com acompanhamento de progresso ----------
   Usa a API de iframe do YouTube para saber quanto a pessoa já assistiu. Aos
   75% o CRM é avisado.

   Por que 75% e não o play nem o fim: no play o atendente cobraria enquanto a
   pessoa ainda assiste; no fim quase ninguém bate, porque muita gente sai nos
   últimos segundos depois de já ter entendido tudo. */
function montaVideo(){
  const caixa = document.getElementById('videoCaixa');
  if(!caixa || !CONFIG.VIDEO_YOUTUBE) return;

  caixa.innerHTML = '<div id="playerVideo"></div>';

  const script = document.createElement('script');
  script.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(script);

  window.onYouTubeIframeAPIReady = function(){
    let avisou = false;
    let relogio = null;

    const player = new window.YT.Player('playerVideo', {
      videoId: CONFIG.VIDEO_YOUTUBE,
      host: 'https://www.youtube-nocookie.com',
      playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
      events: {
        onStateChange: (e) => {
          if(e.data === window.YT.PlayerState.PLAYING){
            if(relogio) return;
            relogio = setInterval(() => {
              const total = player.getDuration();
              if(!total || avisou) return;
              if(player.getCurrentTime() / total >= 0.75){
                avisou = true;
                clearInterval(relogio); relogio = null;
                avisaCRM('video_75');
                if(typeof window.gtag === 'function') window.gtag('event', 'video_assistido');
              }
            }, 1000);
          } else if(relogio){
            clearInterval(relogio); relogio = null;
          }
        }
      }
    });
  };
}

/* ---------- botão de inscrição e triagem antes de sair ----------
   O botão não leva direto ao site do Governo: abre uma pergunta só, "ficou
   alguma dúvida?". É o último momento em que ainda falamos com a pessoa, já
   que dentro do site do Governo não temos nada.

   O custo disso é um clique a mais no caminho de quem já decidiu, então o
   caminho "não tenho dúvida" é o botão grande e é um link de verdade: abre no
   próprio clique, sem risco de o navegador barrar como janela automática.

   Sem URL_INSCRICAO_OFICIAL não há para onde mandar ninguém, e o botão troca
   de papel: vira pedido de aviso pelo WhatsApp, sem triagem. */
function montaBotaoInscricao(){
  const botao = document.getElementById('botaoInscricao');
  if(!botao) return;

  if(!CONFIG.URL_INSCRICAO_OFICIAL){
    const link = document.createElement('a');
    link.className = botao.className;
    link.id = botao.id;
    link.textContent = 'Quero ser avisado quando abrir';
    link.href = montaLinkWhatsapp('avisar');
    link.target = '_blank';
    link.rel = 'noopener';
    link.addEventListener('click', () => eventoConversao('avisar'));
    botao.replaceWith(link);
    return;
  }

  botao.addEventListener('click', () => abreTriagem());
}

function montaTriagem(){
  const caixa = document.getElementById('triagem');
  if(!caixa) return;

  const sair     = caixa.querySelector('.visor-fechar');
  const pergunta = caixa.querySelector('[data-etapa="pergunta"]');
  const duvida   = caixa.querySelector('[data-etapa="duvida"]');
  const seguir   = document.getElementById('triagemSeguir');
  const enviar   = document.getElementById('triagemEnviar');
  const texto    = document.getElementById('triagemTexto');
  let ultimoFoco = null;

  seguir.href = CONFIG.URL_INSCRICAO_OFICIAL;
  seguir.addEventListener('click', () => {
    avisaCRM('clicou_inscricao');
    if(typeof window.gtag === 'function') window.gtag('event', 'clicou_inscricao');
    if(typeof window.fbq === 'function') window.fbq('track', 'InitiateCheckout');
    fecha();
  });

  // Mostra a etapa da dúvida e leva o foco para o campo, para quem está no
  // teclado não ter que procurar onde escrever.
  caixa.querySelector('[data-abre-duvida]').addEventListener('click', () => {
    pergunta.hidden = true; duvida.hidden = false;
    texto.focus();
    avisaCRM('tem_duvida');
    if(typeof window.gtag === 'function') window.gtag('event', 'declarou_duvida');
  });

  caixa.querySelector('[data-volta-pergunta]').addEventListener('click', () => {
    duvida.hidden = true; pergunta.hidden = false;
  });

  /* O link do WhatsApp é montado no momento do clique, com o que a pessoa
     acabou de escrever. Campo vazio manda só a abertura: melhor uma conversa
     sem detalhe do que nenhuma. */
  enviar.addEventListener('click', () => {
    const escrito = (texto.value || '').trim();
    const base = CONFIG.CONVERSAS.duvida;
    const msg = escrito ? base + ' ' + escrito : base;
    enviar.href = 'https://wa.me/' + CONFIG.WHATSAPP_NUMERO + '?text=' + encodeURIComponent(msg);
    enviar.target = '_blank';
    enviar.rel = 'noopener';
    eventoConversao('duvida');
    fecha();
  });

  function fecha(){
    caixa.hidden = true;
    duvida.hidden = true; pergunta.hidden = false;
    document.body.style.overflow = '';
    if(ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  caixa.addEventListener('click', (e) => {
    if(e.target === caixa || e.target === sair) fecha();
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && !caixa.hidden) fecha();
  });

  window.abreTriagem = function(){
    caixa.hidden = false;
    document.body.style.overflow = 'hidden';
    ultimoFoco = document.activeElement;
    sair.focus();
  };
}


/* ---------- depoimentos em vídeo ----------
   A capa é só a miniatura do YouTube com um botão de play. O vídeo em si
   carrega apenas quando alguém clica: até lá nenhum cookie de terceiro é
   posto, e a página não paga o peso de quatro players.

   Ao clicar, o vídeo abre num visor sobre a página, não dentro do card. Dentro
   do card ele ficaria do tamanho de um selo, e ainda por cima dentro de um
   carrossel que anda sozinho. */
function montaDepoimentos(){
  const alvo = document.getElementById('depoimentos');
  if(!alvo || !CONFIG.DEPOIMENTOS_YOUTUBE.length) return;

  alvo.innerHTML = CONFIG.DEPOIMENTOS_YOUTUBE.map((id, i) => `
    <button type="button" class="depo" data-youtube="${id}" aria-label="Assistir ao depoimento ${i + 1} de aluno da Conhecer">
      <img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy">
      <span class="play-mini" aria-hidden="true"></span>
    </button>`).join('');
}

function montaVisorDeVideo(){
  const visor = document.getElementById('visorVideo');
  if(!visor) return;
  const palco = visor.querySelector('.visor-palco-video');
  const sair  = visor.querySelector('.visor-fechar');
  let ultimoFoco = null;

  function abre(botao){
    const id = botao.dataset.youtube;
    if(!id) return;

    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0&playsinline=1';
    iframe.title = botao.getAttribute('aria-label') || 'Depoimento';
    iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    palco.replaceChildren(iframe);

    visor.hidden = false;
    document.body.style.overflow = 'hidden';
    ultimoFoco = document.activeElement;
    sair.focus();
  }

  function fecha(){
    visor.hidden = true;
    // Tira o iframe do ar: sem isso o vídeo segue tocando atrás da página.
    palco.replaceChildren();
    document.body.style.overflow = '';
    if(ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  document.addEventListener('click', (e) => {
    const botao = e.target.closest('button.depo[data-youtube]');
    if(botao){ e.preventDefault(); abre(botao); return; }
    if(e.target === visor || e.target === sair) fecha();
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && !visor.hidden) fecha();
  });
}

/* ---------- captura de UTM / origem ----------
   Fora do funil planejado: quem chega aqui veio da conversa, não de um anúncio.
   Fica de pé só para o caso de o link vazar para fora dela (alguém repassa para
   um amigo, a Conhecer cola no Instagram), para o tráfego não virar "direto". */
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
  // pela página antes de clicar em alguma coisa
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
    if(!Number.isFinite(destino)) return;
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
  }, { threshold: 0.35 });

  /* Os números NÃO são zerados aqui.

     A versão anterior zerava todos de cara e contava depois, quando o elemento
     entrasse na tela. O problema é que o valor final está escrito no HTML
     justamente para aparecer certo se o JS falhar — e zerar de cara jogava essa
     proteção fora: bastava o observador não disparar para a faixa exibir
     "0 unidades na região de BH" para sempre. Foi o que aconteceu.

     Agora quem zera é a própria contagem, no primeiro quadro, já com a certeza
     de que vai contar até o fim. Observador que não dispara deixa o número
     certo parado, que é o comportamento correto. */
  alvos.forEach(el => observador.observe(el));
}

/* ---------- carrosséis que deslizam sem parar ----------
   Vai até a última carta, inverte e volta. Sem duplicar nada: uma versão
   anterior copiava o conteúdo para fechar o laço, mas como a rolagem aqui é
   nativa, bastava arrastar até o fim para ver todos os cards repetidos.

   Para enquanto o dedo está em cima e volta a andar quando ele sai. A espera
   depois de soltar não é enfeite: o navegador continua rolando por inércia
   mais um tempo, e retomar no meio disso faria o script e o embalo disputarem
   o mesmo eixo. Então o movimento só é retomado quando a rolagem para de
   mudar sozinha.

   O movimento soma ao scrollLeft a cada quadro em vez de usar animação de CSS,
   porque animação de CSS e rolagem nativa brigam pelo mesmo eixo. */
const VELOCIDADE_CARROSSEL = 58;   // px por segundo, o mesmo ritmo da esteira de parceiros
const ESPERA_ANTES_DE_VOLTAR = 900; // ms de quietude antes de retomar

function montaCarrosseisContinuos(){
  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(semMovimento) return;

  document.querySelectorAll('[data-desliza]').forEach(trilho => {
    if(!trilho.children.length) return;

    /* No desktop estes blocos são grade, não carrossel: não rolam, e não há
       para onde deslizar. */
    if(trilho.scrollWidth <= trilho.clientWidth + 4) return;

    let parado = false;
    let dedoEmCima = false;
    let posicao = trilho.scrollLeft;
    let sentido = 1;               // 1 vai para a direita, -1 volta
    let anterior = null;
    let relogio = null;

    const para = () => {
      parado = true;
      if(relogio){ clearTimeout(relogio); relogio = null; }
    };

    /* Só volta a andar depois de ESPERA_ANTES_DE_VOLTAR sem nenhuma rolagem.
       Cada rolagem nova reinicia a contagem, então a inércia do dedo segura a
       retomada pelo tempo que durar. */
    const agendaVolta = () => {
      if(dedoEmCima) return;
      if(relogio) clearTimeout(relogio);
      relogio = setTimeout(() => {
        relogio = null;
        posicao = trilho.scrollLeft;   // retoma de onde a pessoa deixou
        anterior = null;               // não conta o tempo parado como movimento
        parado = false;
      }, ESPERA_ANTES_DE_VOLTAR);
    };

    ['pointerdown','touchstart','wheel','keydown'].forEach(ev =>
      trilho.addEventListener(ev, () => { dedoEmCima = (ev === 'pointerdown' || ev === 'touchstart'); para(); }, { passive: true }));

    ['pointerup','pointercancel','touchend','touchcancel'].forEach(ev =>
      trilho.addEventListener(ev, () => { dedoEmCima = false; agendaVolta(); }, { passive: true }));

    // roda do mouse e teclado não têm "soltar": a própria rolagem agenda a volta
    trilho.addEventListener('scroll', () => { if(parado) agendaVolta(); }, { passive: true });

    /* No computador, o ponteiro em cima segura e sair devolve o movimento.
       Só em aparelho com ponteiro de verdade: o navegador do celular emula
       mouseenter no toque e muitas vezes não manda o mouseleave depois, o que
       deixaria o carrossel parado para sempre no primeiro toque. */
    if(window.matchMedia('(hover: hover)').matches){
      trilho.addEventListener('mouseenter', () => { dedoEmCima = true; para(); });
      trilho.addEventListener('mouseleave', () => { dedoEmCima = false; agendaVolta(); });
    }

    function quadro(agora){
      if(anterior === null) anterior = agora;
      const segundos = Math.min((agora - anterior) / 1000, 0.05);  // aba em segundo plano não acumula salto
      anterior = agora;

      if(!parado){
        const limite = trilho.scrollWidth - trilho.clientWidth;
        if(limite > 0){
          posicao += VELOCIDADE_CARROSSEL * segundos * sentido;
          if(posicao >= limite){ posicao = limite; sentido = -1; }
          else if(posicao <= 0){ posicao = 0; sentido = 1; }
          trilho.scrollLeft = posicao;
        }
      }
      requestAnimationFrame(quadro);
    }

    requestAnimationFrame(quadro);
  });
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

   Todo mundo que abre esta página veio da conversa, então as mensagens não se
   apresentam: continuam de onde o atendimento parou. Quem é a pessoa, o CRM já
   sabe pelo ?lead= da URL, não pelo texto da mensagem. */
function montaLinkWhatsapp(secao){
  if(!CONFIG.WHATSAPP_NUMERO) return '#';

  const texto = CONFIG.CONVERSAS[secao] || CONFIG.CONVERSAS.flutuante;
  return 'https://wa.me/' + CONFIG.WHATSAPP_NUMERO + '?text=' + encodeURIComponent(texto);
}

function aplicaLinksWhatsapp(){
  const origem = capturaOrigem();

  document.querySelectorAll('[data-whatsapp]').forEach(botao => {
    const secao = botao.dataset.whatsapp;
    botao.href = montaLinkWhatsapp(secao);
    botao.target = '_blank';
    botao.rel = 'noopener';
    botao.addEventListener('click', () => eventoConversao(secao, origem));
  });
}

/* ---------- eventos de conversão (GA4 e Meta) ----------
   Aqui o lead já existe: ele nasceu no anúncio Click-to-WhatsApp, antes desta
   página. O que estes eventos medem é a etapa, não a entrada: voltou pro
   WhatsApp, assistiu o vídeo, clicou pra se inscrever. O número que vale é o
   do CRM, e é com ele que estes devem ser conferidos de tempos em tempos. */
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

/* Mantém o ano do rodapé atualizado sozinho. O ano está escrito no HTML, então
   sem JS a pessoa ainda vê um ano, só não o do momento. */
function atualizaAnoDoRodape(){
  const alvo = document.querySelector('[data-ano]');
  if(alvo) alvo.textContent = new Date().getFullYear();
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
  montaSaudacao();
  atualizaAnoDoRodape();
  montaVideo();
  montaTriagem();
  montaBotaoInscricao();
  aplicaLinksWhatsapp();
  avisaCRM('pagina_aberta');
  preencheBadgeStatus();
  montaDepoimentos();
  montaNumerosAnimados();
  montaCarrosseisContinuos();
  montaVisorDeFotos();
  montaVisorDeVideo();
  dissuadeDownload();
});
