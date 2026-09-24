# Página de orientação: Trilhas de Futuro (Escola Técnica Conhecer)

**Esta página não capta lead.** Ela é a página de VSL que o atendente manda dentro da
conversa do WhatsApp, depois que o lead já entrou no CRM. O trabalho dela é um só:
fazer a pessoa assistir o vídeo, entender por que escolher a Conhecer, e conseguir
fazer a própria inscrição no site do Governo sem travar no meio.

Quem chega aqui já é conhecido. Não tem formulário, não tem "cadastre-se", não tem
apresentação: as mensagens dos botões continuam de onde o atendimento parou.

Arquivos: `index.html`, `style.css`, `script.js`. Sem build, sem dependências. Abre
direto no navegador pra testar.

## Decisões já tomadas (não precisa perguntar de novo)

- **Identidade visual**: colaboração de duas marcas.
  - **Conhecer** é a base: azul `#0A3DAE` e família, estrutura, texto, fundos.
  - **Trilhas de Futuro** é a ação: amarelo `#FCB815` nos CTAs, selos e destaques,
    com rosa, ciano e laranja como acentos pontuais. Amostrados por pixel do
    material oficial do programa.
  - O Gabriel confirmou que a Conhecer tem autorização para usar a marca do
    Trilhas de Futuro.
  - Paleta (em `style.css`, `:root`):
    | token | hex | uso |
    |---|---|---|
    | `--azul-900` | `#041C57` | gradiente do hero, seção de depoimentos |
    | `--azul-700` | `#0A3DAE` | azul de marca da Conhecer |
    | `--amarelo` | `#FCB815` | **cor de ação**: botões, selos, números dos passos |
    | `--rosa` | `#DB5C93` | acento |
    | `--ciano` | `#23B2D0` | acento |
    | `--laranja` | `#F48222` | acento |
    | `--grafite` | `#343838` | cor do wordmark do Trilhas |
  - **Assinatura no topo**: Conhecer e Trilhas de Futuro lado a lado,
    separadas por um divisor, as duas sobre o azul do hero.
  - **A Conhecer usa `logo-conhecer-escuro.png`, não a versão toda branca.**
    O símbolo original tem duas fitas: a da frente em `#1988E2` e a de trás em
    `#01335D`. Sobre o azul escuro do hero a fita navy sumia, e a versão toda
    branca virava um bloco chapado sem leitura nenhuma. Nesta versão a fita da
    frente é branca e a de trás é `#1988E2`, então a frente continua sendo a
    mais clara e as duas fitas voltam a aparecer. O wordmark fica branco e o
    "Escola Técnica" num branco suave.
    O script que gera esse arquivo separa símbolo e texto pelo vão real entre
    eles, nas colunas 120 a 165 do arquivo original.
  - Arquivos de logo. **Em uso na página**: `logo-conhecer-escuro.png` (hero) e
    `logo-trilhas-branco.png` (hero). **Mantidos de propósito, fora da página**:
    `logo-conhecer-oficial.webp` e `logo-trilhas.png` são os originais e as
    fontes de onde as versões acima foram geradas, então apagar impede
    regerar; `logo-conhecer-oficial-branco.png` é uma variante legítima para
    outros materiais; `logo-conhecer-fundo-azul.png` é o arquivo original que
    a Brota enviou e não foi gerado aqui.
  - Fontes: **Sora** (títulos) + **Instrument Sans** (corpo), ambas Google Fonts.
    Não são mais aproximação. São as fontes que o próprio site da Conhecer usa
    (`unifecaf-conhecer/tecnico/css/tema.css`).
  - Linguagem visual copiada do institucional: gradiente azul diagonal no hero com
    arcos decorativos, olho-mágico com a seção em caixa alta acima dos títulos, títulos
    de duas linhas com a segunda em azul (`.t-acento`), botões em pill, cartão branco
    sobrepondo o fim do hero, cards com raio grande e sombra suave.

- **Ordem no CSS importa, e já mordeu duas vezes.** As regras base de
  `.dica-arrasta` e de `.whatsapp-flutuante` estavam DEPOIS dos media queries
  que as sobrescreviam. Com a mesma especificidade, quem vem depois vence, então
  o override do mobile não pegava: as dicas não apareciam e o botão do WhatsApp
  ficava grudado na barra fixa. Se for mexer nesses dois blocos, mantenha a
  regra base antes do media query.
- **Faixa de parceiros: esse sim é infinito, e de propósito.** Os carrosséis
  de pilares, áreas, depoimentos e galeria são finitos, porque são conteúdo de
  decisão: a pessoa compara antes de escolher, e saber que acabou é
  informação útil. A faixa de parceiros é o contrário, é prova social: o que
  comunica é a quantidade, não cada logo lida uma a uma. Por isso ela desliza
  sozinha, sem fim.
  Também é só CSS: dois grupos idênticos lado a lado e uma animação que
  desloca o trilho em metade da largura total, que é exatamente a largura de
  um grupo. Ao terminar, o quadro é idêntico ao inicial, então a volta não tem
  emenda. **Se editar a lista de logos, edite os dois grupos.**
  Para em `prefers-reduced-motion` e ao passar o mouse.
  São 22 logos, vindas de `tecnico/img/parceiros/` do repositório da Conhecer.
  A `parceiro-19` ficou de fora: é um banner publicitário com foto, não uma
  logo, e destoava da faixa.
- **No mobile os blocos de cards viram carrossel.** Pilares, áreas, depoimentos
  e galeria deixam de empilhar e passam a deslizar para o lado, em telas de até
  760px. É só CSS com `scroll-snap`: sem JS e sem biblioteca, continua
  funcionando se o JS falhar. Os cards têm menos de 100% de largura de
  propósito, porque a fatia do próximo aparecendo na borda é o que avisa que dá
  para arrastar. Isso encurtou a página de 9.936px para 5.758px, 42% a menos.
  A dica "Arraste para ver todos" fica escondida no desktop, e a regra que a
  esconde vem ANTES do media query: em CSS, com a mesma especificidade, quem
  vem depois vence.
- **Números da faixa de provas contam quando entram na tela.** O valor final
  está escrito no HTML, então sem JS a pessoa vê o número certo, parado. Não
  anima em `prefers-reduced-motion`.
- **Os carrosséis deslizam sem parar** (`data-desliza`), a 58 px/s — a mesma
  velocidade da esteira de parceiros, medida no navegador. O conteúdo é
  duplicado e, quando a rolagem passa da metade, volta metade para trás: como as
  metades são idênticas, o laço não tem emenda. A rolagem é nativa, então a
  pessoa continua arrastando com o dedo; por isso o movimento soma ao
  `scrollLeft` a cada quadro em vez de usar animação de CSS, que brigaria com a
  rolagem pelo mesmo eixo. O `scroll-snap` fica desligado nesses três, senão
  puxaria de volta a cada quadro. **Param enquanto o dedo está em cima e voltam
  a andar quando ele sai.** A espera de 900ms antes de retomar não é enfeite: o
  navegador continua rolando por inércia depois que o dedo sai, e retomar no
  meio disso faria o script e o embalo disputarem o mesmo eixo. O pausar por
  hover só é ligado em aparelho com ponteiro de verdade (`hover: hover`), porque
  o navegador do celular emula `mouseenter` no toque e muitas vezes não manda o
  `mouseleave` depois — o que deixaria o carrossel parado para sempre.
- **Os depoimentos abrem num visor sobre a página**, não dentro do card, onde
  ficariam do tamanho de um selo. O iframe nasce ao abrir e é destruído ao
  fechar: sem isso o áudio continua tocando por trás da página fechada.
- **No desktop eles não viram esteira.** Ali os blocos são grade e não rolam;
  duplicar mostraria cada card duas vezes. O JS só monta a esteira onde há
  conteúdo além da borda.
- **Os botões fixos não têm faixa atrás.** A faixa branca cortava a página em
  duas e tapava conteúdo. Sem fundo, cada botão precisa se sustentar sozinho
  sobre o que passa atrás, que ora é branco, ora azul-escuro, ora foto: os dois
  são sólidos e carregam sombra própria, e o de ação tem contorno branco por
  causa de um trecho só, a faixa de provas, onde o amarelo se dissolveria no
  amarelo. O container não recebe clique, só os botões, senão viraria uma tira
  invisível segurando toques destinados ao conteúdo. A folga no fim da página
  cobre a barra inteira mais um respiro, porque agora o conteúdo passa por trás.
- **Um botão só, e ele abre uma triagem antes de mandar a pessoa embora.** No
  clique aparece uma pergunta única: "ficou alguma dúvida sobre a inscrição?".
  Quem não tem segue num clique, por um link de verdade que abre o site do
  Governo. Quem tem escreve ali e cai no WhatsApp com a pergunta já digitada.
  A razão é o buraco do funil: depois que a pessoa entra no site do Governo não
  temos mais nada, e esse é o último momento em que ainda falamos com ela.
  O custo é um clique a mais para quem já decidiu, e é por isso que o caminho
  "não tenho dúvida" é o botão grande e primeiro.
- **O botão pulsa, não pisca.** Um halo que cresce e some a cada 2,6s, feito em
  `::after` para não mexer no tamanho do próprio botão enquanto o dedo mira
  nele. Piscar chama atenção uma vez e irrita da segunda em diante, e piscar
  rápido é problema de acessibilidade. Respeita `prefers-reduced-motion`.
- **A folga do fim da página mora no fechamento, não no body**, para herdar o
  azul do gradiente. No body ela abria uma tira branca embaixo do rodapé.
- **A barra de ação fixa voltou**, agora como o único botão de inscrição da
  página: o de cima leva ao site do Governo, o de baixo, menor, abre o WhatsApp.
  Os CTAs espalhados pelas seções saíram. Sem `URL_INSCRICAO_OFICIAL` o botão de
  cima não fica apagado, ele troca de trabalho e vira "Quero ser avisado quando
  abrir" — barra fixa acompanhando a página inteira com botão morto é pior que
  não ter barra.
- **Os depoimentos são a exceção: não passam sozinhos.** São vídeos, e carrossel
  que anda sozinho enquanto a pessoa assiste tira ela de perto justamente do que
  ela escolheu ver. Ali quem passa é ela, arrastando. Para voltar atrás, basta
  devolver o `data-auto-passa` ao `.depo-grid` no `index.html`.
- **As fotos abrem ampliadas** ao clique, num visor que fecha no X, no fundo
  ou no Esc.
- **Sobre "bloquear download": não existe bloqueio real numa página web.**
  Qualquer pessoa tira print, abre o código-fonte ou usa o inspetor. O que
  está feito é tirar os caminhos fáceis: menu do botão direito, arrastar para
  a área de trabalho e toque longo no celular. É dissuasão, não proteção. Se
  alguma foto não puder circular de jeito nenhum, ela não pode estar numa
  página pública.
- **A barra fixa de ação saiu, e o botão flutuante do WhatsApp também.** Ele
  cobria conteúdo no rodapé e era redundante: a página já tem chamada para o
  WhatsApp nas áreas, na inscrição e no fechamento.
- **O rodapé tem só o necessário para uma página de VSL**: o aviso de que o
  Trilhas é do Governo e esta página não é o site oficial, os direitos
  reservados e o crédito da Brota Web. Sem menu, sem redes sociais, sem links
  institucionais — cada link ali é uma porta de saída a centímetros do único
  botão que importa. Fica dentro do azul do fechamento, separado por uma linha
  clara, para encerrar a página sem abrir um bloco novo de outra cor.
- **A página não tem formulário.** Ela não capta nada: o lead já nasceu na
  conversa do WhatsApp, antes daqui. Ver "O funil de comunicação" abaixo.
- **Ordem das seções**: vídeo, provas, inscrição, e só depois os argumentos.
  O porquê está em "Por que a ordem das seções é essa", abaixo.
- **A página não promete vaga por si só.** Quem garante vaga é a inscrição no
  site do Governo, feita pela própria pessoa. A página ensina a fazer e confere
  o protocolo depois. Não transformar os CTAs em "garanta sua vaga agora" como
  se o clique resolvesse: é promessa que a página não tem como cumprir.
- **Estrutura da página** (decidida com o Gabriel): sem cabeçalho de navegação e
  sem rodapé. Só as duas marcas no topo, Conhecer e Trilhas de Futuro, como uma
  colaboração.
- **Não há aviso de LGPD na página.** Ele existia no pé do formulário; sem
  formulário, a página não coleta dado nenhum digitado pela pessoa. Os avisos
  que ela manda para o CRM usam um identificador que o próprio CRM gerou, e o
  consentimento foi dado lá atrás, na conversa.
- **Depoimentos são vídeos reais** de alunos, os mesmos do site da Conhecer
  (IDs do YouTube em `script.js`, `CONFIG.DEPOIMENTOS_YOUTUBE`). A capa só vira
  player quando a pessoa clica, para não entregar cookie de terceiro sem
  interação. Nenhum depoimento escrito foi inventado, e não deve ser.
- **Os quatro pilares são só o que a Conhecer entrega ALÉM do programa**:
  UTI própria, estágio garantido (Enfermagem e Radiologia), professores mestres
  e doutores, e estrutura. Gratuidade, auxílio de R$ 20 por dia, uniforme e
  material didático são cobertos pelo próprio Trilhas de Futuro e valem para
  qualquer escola credenciada, então ficam na faixa de provas e no FAQ. Se os
  anúncios liderarem com eles, a Conhecer compete de igual para igual com todas
  as concorrentes e não ganha em nada.
- **"Estágio garantido" precisa de confirmação por escrito da Conhecer.** É
  promessa com peso jurídico e vale só para dois cursos. O escopo aparece na
  própria frase da página, e tem que continuar aparecendo.
- **Áreas em vez de cursos**: a página mostra as quatro áreas de formação, não uma
  lista de cursos. A oferta do Trilhas de Futuro é definida pelo edital de cada
  edição e não é a mesma do catálogo técnico pago da Conhecer.
- **Página pronta agora, publicação depois**: o texto já assume que o edital "abre em
  breve". A página funciona tanto no modo "lista de espera" quanto no modo "inscrições
  abertas" (o `script.js` decide sozinho com base em `CONFIG.URL_INSCRICAO_OFICIAL`
  estar preenchido ou não).
- **Dados reais vindos do site da Conhecer** (repo `henriquemendes089-blip/unifecaf-conhecer`):
  - Foto do hero: `assets/hero-alunas.webp` + `hero-alunas-mobile.webp`, recortadas
    com fundo transparente (as mesmas do carrossel deles).
  - Logo oficial colorida: `assets/logo-conhecer-oficial.webp` (símbolo azul claro
    `#1988E2` + navy `#01335D`, "Escola Técnica" em cinza `#838A8E`) e a versão
    branca gerada a partir dela. Substituem a logo achatada em azul sólido, que
    tinha perdido as duas cores do símbolo.
  - Endereços e cursos por unidade: de `tecnico/js/cursos-tecnicos-data.js`.
- **WhatsApp único** para todas as unidades (não um número por unidade).
- **Os avisos vão pro Brota Flow / CRM da Conhecer**, mas como a chave de API não
  pode ficar exposta no código da página (é público), o caminho é: página →
  webhook intermediário (ex: N8N) → N8N chama a API do Brota Flow com a chave
  guardada no servidor. Ver `CONFIG.AVISO_CRM` em `script.js`.

## Checklist antes de publicar

Tudo marcado com `[PREENCHER]` no código, mais:

- [ ] **API oficial do WhatsApp ligada ao CRM**, com o agente de IA atendendo.
      É por aí que o lead entra agora.
- [ ] **`index.html` → `window.RASTREIO`**: IDs do GA4 e do Meta Pixel.
- [ ] **`script.js` → `CONFIG.URL_INSCRICAO_OFICIAL`**: preencher só quando o edital
      abrir de verdade. Antes disso, deixar vazio: o botão fica desligado e escrito
      "As inscrições ainda não abriram", sozinho.
- [ ] **`script.js` → `CONFIG.VIDEO_YOUTUBE`**: o ID do vídeo, só o código. Sem ele
      aparece o espaço reservado e nada é acompanhado.
- [ ] **`script.js` → `CONFIG.AVISO_CRM`**: o endpoint que recebe os avisos. Sem ele
      a página funciona, mas o CRM não fica sabendo de nada.
- [ ] **CRM montando o link com `?lead=`** para o atendente não copiar ID na mão.
- [ ] **Confirmar com a Conhecer se ela está credenciada na 7ª edição** e para quais
      cursos e unidades. Sem isso a página não tem destino. Ver a seção de pesquisa.
- [x] **Auxílio financeiro**: R$ 20 por dia frequentado, para transporte e
      alimentação, condicionado à frequência. Confirmado em 24/09/2026 em
      material do próprio programa. A página não promete total mensal: os
      R$ 400 aparecem no FAQ como conta derivada ("pode chegar a"), porque
      dependem de quantos dias letivos o mês tem e de a pessoa ir a todos.
- [ ] **`index.html` → FAQ**: pré-requisitos reais (ensino médio concluído? idade
      mínima?) conforme o edital.
- [ ] **Vídeo de orientação**: gravar e colocar o ID em `CONFIG.VIDEO_YOUTUBE`.
      O player entra sozinho no lugar do espaço reservado. Conteúdo: por que a
      Conhecer, depois o passo a passo da inscrição do começo ao fim, na mesma
      ordem da lista escrita da página. Horizontal.
- [ ] **Domínio**: publicar em domínio/hospedagem da própria Conhecer (decidido
      anteriormente). A proposta comercial sugeriu `grupoconhecer.com.br/trilhas-de-
      futuro`, mas isso ainda não está confirmado/registrado.

- [ ] **QR Codes / mídias offline**: não apontam mais para cá. O destino de mídia
      offline é o WhatsApp, não esta página — quem chega aqui vem da conversa. A
      captura de `?canal=` e UTM continua no código, só para o caso de o link
      vazar para fora da conversa, mas não faz parte do funil planejado.

## O funil de comunicação

    1. Anúncio Meta (Click-to-WhatsApp)
           ↓
    2. Conversa no WhatsApp  →  lead cai no CRM pela API oficial
           ↓
    3. Atendente (ou o agente de IA) manda o link DESTA página,
       com ?lead=<id do contato> e &nome=<primeiro nome>
           ↓
    4. A pessoa assiste o vídeo  →  aos 75%, o CRM recebe o aviso
       "fulana assistiu o vídeo"
           ↓
    5. A pessoa clica em "Ir para o site oficial"  →  o CRM recebe o aviso
       e o site do Governo abre EM ABA NOVA (esta página fica aberta atrás,
       para ela consultar o passo a passo enquanto preenche)
           ↓
    6. Ela se inscreve sozinha no site do Governo
           ↓
    7. Volta pro WhatsApp e manda o protocolo (botão "Já me inscrevi,
       mandar protocolo", que já abre a conversa com o texto pronto)
           ↓
    8. A equipe confere o protocolo. Quem não voltou, o CRM cobra.

### O link que o atendente manda

    https://<dominio>/?lead=CT-8842&nome=Ana%20Clara

- `lead` é o identificador do contato no CRM. **É ele que amarra os avisos desta
  página ao contato certo.** Sem ele a página funciona igual, só que muda nada
  no CRM: nenhum aviso é enviado, porque não haveria como dizer quem fez o quê.
- `nome` é opcional e só muda o título: "Ana, seu passo a passo para garantir a
  vaga". Aceita o nome completo; a página usa só o primeiro.

O ideal é o próprio CRM montar esse link, para o atendente não ter que copiar ID
na mão. Isso é configuração do lado do CRM, não desta página.

### O que a página avisa para o CRM

Três eventos, todos com `{ lead, evento, em, pagina_url }` num POST para
`CONFIG.AVISO_CRM`:

| evento | quando |
|---|---|
| `pagina_aberta` | a pessoa abriu o link que o atendente mandou |
| `video_75` | assistiu 75% do vídeo |
| `clicou_inscricao` | clicou para ir ao site do Governo |

**Por que 75% e não o play nem o fim.** No play o atendente cobraria enquanto a
pessoa ainda está assistindo, o que irrita. No fim quase ninguém bate: muita
gente sai nos últimos segundos, depois de já ter entendido tudo, e o CRM nunca
receberia o aviso. Aos 75% a pessoa já viu o passo a passo inteiro.

**Limitação conhecida:** o envio usa `mode: 'no-cors'`, igual ao envio de lead
antigo. A resposta vem opaca, então a página **não tem como saber se o aviso
chegou**. Quem confere é o CRM. Se um dia precisar de confirmação, o endpoint
tem que devolver os cabeçalhos CORS certos e o `mode` sai daqui.

**Chave de API nunca entra aqui.** Esta página é pública: qualquer pessoa lê o
`script.js`. Por isso `CONFIG.AVISO_CRM` aponta para o `apps-script.js` deste
repositório, que roda no Google e guarda a chave nas Propriedades do Script.

    página  →  apps-script.js  →  planilha (sempre)
                              →  Brota Flow (quando configurado)

O passo a passo de instalação está no topo do próprio `apps-script.js`. Leva uns
15 minutos e **não precisa do Brota Flow pronto**: com `BROTA_FLOW_URL` vazia o
script só grava na planilha, e a planilha sozinha já mostra quem abriu, quem
assistiu e quem foi se inscrever. Dá para subir hoje e ligar o CRM depois.

**Avisos repetidos.** A página não manda o mesmo aviso duas vezes para o mesmo
lead: `pagina_aberta` só se repete depois de 6 horas, `video_75` e
`clicou_inscricao` são marcos e vão uma vez só. A memória é o `localStorage`, que
é por navegador — quem abre no celular e depois no computador gera dois avisos.
A deduplicação que vale é a do CRM; a da página só tira o grosso do ruído.

**O endpoint é público e dá para falsificar aviso.** Quem ler o `script.js` acha
a URL e consegue mandar "o lead X assistiu o vídeo". Não tem solução em página
estática: o que o navegador precisa saber para se autenticar, o visitante
também sabe. O `apps-script.js` limita o dano (só aceita os três eventos
conhecidos, só aceita lead com formato de identificador, ignora corpo grande),
e o resto é regra de negócio: **esses avisos são sinal para o atendente, não
verdade que dispare cobrança automática ou mude status de matrícula.**

### O buraco do funil, e o que a página faz com ele

Entre o passo 6 e o 7 a pessoa está no site do Governo, onde não temos controle
nenhum. Não dá para resolver com código. O que a página faz é **combinar antes**:
o passo 7 do passo a passo escrito já diz que ela volta e manda o protocolo,
e o botão ao lado do CTA principal deixa isso a um toque de distância. O resto
é operação: o CRM sabe quem clicou em "ir para o site" (evento
`clicou_inscricao`) e não voltou com protocolo — essa é a lista de cobrança.

### Por que a ordem das seções é essa

    hero (vídeo)  →  provas  →  INSCRIÇÃO  →  áreas  →  porque  →
    parceiros  →  estrutura  →  depoimentos  →  faq  →  fechamento

O vídeo é o produto da página, então ocupa o topo inteiro, sem nada ao lado
disputando atenção. A **inscrição vem logo em seguida**, antes de qualquer
argumento de venda, porque quem assistiu o vídeo já está convencido e só quer
fazer. O passo a passo escrito repete o que o vídeo explica **de propósito**:
ninguém volta no vídeo para rever qual campo preencher, mas todo mundo relê
uma lista enquanto digita.

Tudo abaixo da inscrição é para quem ainda não se convenceu: áreas (que também
serve de consulta para o passo 5), por que a Conhecer, parceiros, estrutura,
depoimentos e FAQ. O fechamento não pede nada novo — devolve a pessoa para a
conversa de onde ela veio.

### Sobre busca orgânica

Continua praticamente zero, e vai continuar sendo por meses. Mas agora isso não
importa: **o único tráfego previsto para esta página é o link mandado dentro da
conversa.** Quem chega sem `?lead=` vê a página funcionando normalmente, só não
gera aviso nenhum no CRM.

## Rastreamento

`index.html` tem um bloco `window.RASTREIO` com dois campos, `ga4` e
`metaPixel`. Preencheu, o carregador injeta o script sozinho. Deixou vazio,
aquele pixel não carrega. Não precisa descomentar nada.

Os eventos saem do `script.js`:

| evento | GA4 | Meta | quando |
|---|---|---|---|
| assistiu o vídeo | `video_assistido` | — | aos 75% |
| foi se inscrever | `clicou_inscricao` | `InitiateCheckout` | clique no CTA principal |
| voltou pro WhatsApp | `generate_lead` | `Contact` | clique em qualquer botão de WhatsApp |

`generate_lead` aqui **não significa lead novo** — o lead já existia antes desta
página. É a etapa "voltou para a conversa". Quem tem o número real de leads é o
CRM, e é com ele que estes números devem ser conferidos de tempos em tempos.

## Pesquisa sobre o edital (base de referência, NÃO publicar ainda)

Levantado em 15/09/2026 por busca web. O acesso direto a `trilhasdefuturo.mg.gov.br`
está bloqueado pela rede desta sessão, então **nada aqui foi lido do edital oficial**.
é imprensa e material da SEE/MG. Serve de base para conversar com a Conhecer, não
para escrever na página.

**Razoavelmente consistente entre fontes:**

- **Auxílio: R$ 20 por dia de aula**, para alimentação e transporte. O pagamento é
  **vinculado à comprovação de frequência** (critério definido pela SEE/MG), repassado
  depois que a instituição envia o relatório de frequência no fim de cada mês. Isso
  vale desde a 3ª edição.
- **Gratuidade total**: sem matrícula, mensalidade, uniforme ou material didático.
- O candidato escolhe **até duas opções de curso** na inscrição.
- 6ª edição (2025): inscrições de 10/09 a 01/10/2025, ~50 mil vagas.

**Contraditório entre fontes, resolver antes de escrever o FAQ:**

- **Quem pode se inscrever.** Uma fonte diz "estudantes da rede pública e egressos do
  ensino médio"; outra diz "rede pública ou privada". A diferença muda o público-alvo
  da campanha inteira. Não escrever nada no FAQ até confirmar no edital.
- **Idade mínima**: não encontrada em nenhuma fonte.

**Dois pontos de prazo que valem checagem imediata:**

1. A janela de inscrição do ano passado foi **10/09 a 01/10**. Se a 7ª edição repetir o
   calendário, a inscrição de estudante **estaria aberta agora**. Vale abrir
   `trilhasdefuturo.mg.gov.br` hoje e confirmar.
2. A lista de cursos e municípios prioritários da 7ª edição saiu em **abril/2026**, e o
   **edital de credenciamento das instituições seria reaberto no 2º semestre de 2026**.
   Ou seja: antes de a Conhecer receber aluno pelo programa, ela precisa estar
   credenciada nesta edição. **Confirmar com a Conhecer se o credenciamento dela já
   saiu e para quais cursos e unidades**. Se não saiu, não há inscrição para
   ensinar, e isso muda o prazo do projeto inteiro.

Fontes: [SEE/MG: cursos prioritários da 7ª edição](https://www.educacao.mg.gov.br/governo-de-minas-publica-lista-de-cursos-profissionalizantes-prioritarios-para-a-7a-edicao-do-trilhas-de-futuro/) ·
[SEE/MG: dúvidas frequentes](https://www.educacao.mg.gov.br/veja-respostas-as-principais-duvidas-sobre-o-programa-trilhas-de-futuro/) ·
[Agência Minas: cursos prioritários 7ª edição](https://agenciamg.com.br/2026/04/24/governo-de-minas-divulga-cursos-prioritarios-para-a-7a-edicao-do-programa-trilhas-de-futuro/) ·
[SEE/MG: inscrições ampliadas até 1º de outubro](https://www.educacao.mg.gov.br/inscricoes-do-trilhas-de-futuro-sao-ampliadas-ate-1o-de-outubro/) ·
[Site oficial do programa](https://www.trilhasdefuturo.mg.gov.br/)

## Como testar localmente

Abra `index.html` direto no navegador, ou rode um servidor simples:

```bash
cd trilhas-de-futuro-conhecer
python3 -m http.server 8000
# depois abra http://localhost:8000
```

Para testar como a pessoa vê, use a URL com os parâmetros do atendente:

    http://localhost:8000/?lead=TESTE-1&nome=Ana%20Clara

Com `CONFIG.AVISO_CRM` vazio nada é enviado, e com `CONFIG.VIDEO_YOUTUBE` vazio
aparece o espaço reservado no lugar do player. A página inteira funciona assim:
não precisa do CRM nem do vídeo prontos pra testar o resto.
