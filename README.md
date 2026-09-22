# Landing Page: Trilhas de Futuro (Escola Técnica Conhecer)

Página de pré-captura de leads para a campanha do Trilhas de Futuro. Objetivo: capturar
o contato de quem quer se inscrever **antes** de mandar a pessoa para o site oficial do
Governo de Minas Gerais, porque quem trava lá no meio simplesmente some, sem deixar
rastro nenhum pra gente.

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
- **Os carrosséis passam sozinhos** (`data-auto-passa`, em milissegundos) e
  **param de vez no primeiro toque, clique ou arrasto**. É de propósito: se a
  pessoa interagiu foi porque quer ler com calma, e voltar a andar sozinho
  atrapalharia. A esteira de parceiros segue a mesma regra.
- **As fotos abrem ampliadas** ao clique, num visor que fecha no X, no fundo
  ou no Esc.
- **Sobre "bloquear download": não existe bloqueio real numa página web.**
  Qualquer pessoa tira print, abre o código-fonte ou usa o inspetor. O que
  está feito é tirar os caminhos fáceis: menu do botão direito, arrastar para
  a área de trabalho e toque longo no celular. É dissuasão, não proteção. Se
  alguma foto não puder circular de jeito nenhum, ela não pode estar numa
  página pública.
- **A barra fixa de ação saiu.** Ficou só o botão flutuante do WhatsApp, sem
  fundo atrás.
- **A página tem DOIS blocos de conversão**, o do hero e o de fechamento,
  depois do FAQ. Por isso nenhum campo de formulário tem `id`: IDs repetidos
  fariam o JS enxergar só o primeiro e o segundo bloco ficaria morto. O
  `script.js` varre por `[data-conversao]` e trata cada bloco isoladamente.
  Cada lead carrega o campo `bloco`, com "hero" ou "fechamento", que vai para
  a planilha, para o CRM e para o evento do GA4. Dá para medir onde a página
  converte.
- **Ordem das seções, pensada como funil**: hero, áreas, por que a Conhecer,
  parceiros, estrutura, depoimentos, passo a passo, FAQ, fechamento.
  As áreas vêm cedo porque a segunda pergunta de quem vê "curso técnico
  gratuito" é "qual curso?". Depois vêm as provas em escala (parceiros,
  estrutura, depoimentos), depois a mecânica, depois as objeções, e só então
  o pedido de ação.
- **A página não promete vaga.** O cadastro não garante vaga nenhuma: ela
  depende da inscrição oficial no site do Governo. Por isso o formulário diz
  "Quero ser avisado" e a barra fixa diz "Quero me cadastrar". Não voltar para
  "garanta sua vaga": é promessa que a página não tem como cumprir, e que
  gera frustração e reclamação quando a pessoa descobre que precisa se
  inscrever em outro lugar.
- **Estrutura da página** (decidida com o Gabriel): sem cabeçalho de navegação e
  sem rodapé. Só as duas marcas no topo. A ordem é hero com vídeo e formulário,
  faixa de provas, por que a Conhecer, estrutura em fotos, áreas de formação,
  depoimentos em vídeo, passo a passo e FAQ. Em telas pequenas aparece uma barra
  fixa de ação no rodapé da tela.
- **O aviso de uso de dados saiu do rodapé** e foi para o pé do formulário, que é
  onde ele tem efeito. Não pode ser removido: é LGPD, não decoração.
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
- **Lead vai pro Brota Flow / CRM da Conhecer**, mas como a chave de API não pode
  ficar exposta no código da página (é público), o caminho é: página → webhook
  intermediário (ex: N8N) → N8N chama a API do Brota Flow com a chave guardada no
  servidor. Ver `CONFIG.WEBHOOK_URL` em `script.js`.

## Checklist antes de publicar

Tudo marcado com `[PREENCHER]` no código, mais:

- [ ] **`script.js` → `CONFIG.DESTINOS_LEAD.planilha`**: URL do Apps Script.
      Passo a passo em `apps-script.js`. **Enquanto isso estiver vazio, o lead
      some**: a pessoa vê a confirmação e nada é gravado.
- [ ] **Documentação da rota de entrada de leads do Brota Flow** (URL, formato do
      corpo, como autentica), para ligar o CRM. Perguntar também se existe
      endpoint público de formulário, sem chave.
- [ ] **Propriedades do Script** no Apps Script: `BROTA_FLOW_URL` e
      `BROTA_FLOW_TOKEN`. A chave nunca vai no código do repositório.
- [ ] **`index.html` → `window.RASTREIO`**: IDs do GA4 e do Meta Pixel.
- [ ] **`script.js` → `CONFIG.URL_INSCRICAO_OFICIAL`**: preencher só quando o edital
      abrir de verdade. Antes disso, deixar vazio (a página já lida com isso sozinha).
- [ ] **Confirmar com a Conhecer se ela está credenciada na 7ª edição** e para quais
      cursos e unidades. Sem isso a página não tem destino. Ver a seção de pesquisa.
- [ ] **`index.html` → benefício "Auxílio financeiro"**: valor e regras reais,
      conforme o edital oficial. **Não publicar um valor sem confirmar no edital**.
- [ ] **`index.html` → FAQ**: pré-requisitos reais (ensino médio concluído? idade
      mínima?) conforme o edital.
- [ ] **Vídeo de apresentação**: gravar e trocar o bloco `.video-espera` no
      `index.html` por um `<iframe>` do YouTube. A instrução exata está no
      comentário ao lado. Recomendado 60 a 90 segundos, horizontal.
- [ ] **Domínio**: publicar em domínio/hospedagem da própria Conhecer (decidido
      anteriormente). A proposta comercial sugeriu `grupoconhecer.com.br/trilhas-de-
      futuro`, mas isso ainda não está confirmado/registrado.

- [ ] **QR Codes / mídias offline**: gerar cada QR/link com `?canal=` diferente (ex:
      `?canal=outdoor-bh`, `?canal=panfleto-neves`). A página já captura isso sozinha
      e manda junto com o lead. UTMs padrão (`utm_source`, `utm_medium`,
      `utm_campaign`) também são capturados automaticamente.

## Como o lead é enviado

    página  →  Apps Script  →  planilha (cópia de segurança)
                            →  CRM Brota Flow

**A página não pode falar direto com o CRM.** Ela é pública: qualquer visitante
abre "ver código-fonte" e lê tudo. Se a chave de API do CRM estivesse ali, essa
pessoa teria acesso ao CRM inteiro da Conhecer. Por isso existe um intermediário
que guarda a chave do lado do servidor.

O intermediário é o próprio **Apps Script**, não o N8N. Ele roda nos servidores
do Google, guarda a chave nas Propriedades do Script e chama o CRM com
`UrlFetchApp`. Uma ferramenta a menos, custo zero, e é a mesma que a Conhecer já
opera no site dela.

A planilha continua sendo gravada mesmo quando o CRM aceita o lead. É de
propósito: se o CRM cair, o lead não se perde. A coluna **Status CRM** registra
se o encaminhamento deu certo, então dá para auditar lead a lead.

**Exceção:** se o Brota Flow oferecer um endpoint público de formulário, sem
chave, a página pode chamar direto e o Apps Script vira só a cópia de segurança.
Vale perguntar à Brota se existe.

**O que falta para ligar o CRM:** a documentação da rota de entrada de leads do
Brota Flow (URL, formato do corpo, como autentica). O `enviarParaCRM` em
`apps-script.js` já está escrito, com um corpo genérico marcado `[AJUSTAR]`.
A chave **nunca** vai no código: vai em Propriedades do Script, em
`BROTA_FLOW_URL` e `BROTA_FLOW_TOKEN`.

**Por que `mode: 'no-cors'` e `Content-Type: text/plain` no `script.js`**

O navegador tem uma regra de segurança, o CORS. Um POST com
`Content-Type: application/json` para outro domínio dispara antes um pedido de
permissão, o preflight `OPTIONS`. O Apps Script não responde a `OPTIONS`, então
o envio morre antes de chegar lá. Com `text/plain` o navegador trata como pedido
simples e manda direto. O corpo continua sendo JSON, e o `doPost` faz
`JSON.parse` normalmente.

**O preço:** `no-cors` devolve resposta opaca. A página não consegue saber se o
destino aceitou, então o envio é "dispara e segue" e a confirmação aparece de
qualquer jeito. Se o Apps Script quebrar, o lead some em silêncio.

**Teste obrigatório depois de configurar:** abra a página, preencha com o nome
"TESTE" e envie. A linha tem que aparecer na planilha em segundos, e a coluna
Status CRM mostra se o encaminhamento funcionou. Para testar só o CRM, sem
formulário, rode a função `testarCRM` pelo editor do Apps Script.

## Rastreamento

`index.html` tem um bloco `window.RASTREIO` com dois campos, `ga4` e
`metaPixel`. Preencheu, o carregador injeta o script sozinho. Deixou vazio,
aquele pixel não carrega. Não precisa descomentar nada.

O evento de conversão sai em `script.js`, na função `eventoConversao`:
`generate_lead` no GA4 e `Lead` no Meta, os dois com unidade, curso e canal.
Verificado em navegador: com os IDs preenchidos o `generate_lead` entra no
`dataLayer` com os campos certos.

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
   saiu e para quais cursos e unidades**. Se não saiu, a página não tem para onde
   mandar o lead, e isso muda o prazo do projeto inteiro.

Fontes: [SEE/MG: cursos prioritários da 7ª edição](https://www.educacao.mg.gov.br/governo-de-minas-publica-lista-de-cursos-profissionalizantes-prioritarios-para-a-7a-edicao-do-trilhas-de-futuro/) ·
[SEE/MG: dúvidas frequentes](https://www.educacao.mg.gov.br/veja-respostas-as-principais-duvidas-sobre-o-programa-trilhas-de-futuro/) ·
[Agência Minas: cursos prioritários 7ª edição](https://agenciamg.com.br/2026/04/24/governo-de-minas-divulga-cursos-prioritarios-para-a-7a-edicao-do-programa-trilhas-de-futuro/) ·
[SEE/MG: inscrições ampliadas até 1º de outubro](https://www.educacao.mg.gov.br/inscricoes-do-trilhas-de-futuro-sao-ampliadas-ate-1o-de-outubro/) ·
[Site oficial do programa](https://www.trilhasdefuturo.mg.gov.br/)

## Como testar localmente

Abra `index.html` direto no navegador, ou rode um servidor simples:

```bash
cd "Landing Page Trilhas do Futuro"
python3 -m http.server 8000
# depois abra http://localhost:8000
```

Com `CONFIG.WEBHOOK_URL` vazio, o envio do formulário funciona normalmente (mostra a
tela de confirmação) mas só avisa no console do navegador que nada foi enviado de
verdade. Não precisa do webhook pronto pra testar o resto da página.
