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
  - Logos: `logo-conhecer-oficial.webp` e `logo-trilhas.png`, mais as versões
    brancas de cada uma. No topo as duas aparecem lado a lado, separadas por um
    divisor. A logo do Trilhas é quase quadrada e a da Conhecer é larga, então
    elas têm alturas diferentes no CSS para ficarem equilibradas.
  - Fontes: **Sora** (títulos) + **Instrument Sans** (corpo), ambas Google Fonts.
    Não são mais aproximação. São as fontes que o próprio site da Conhecer usa
    (`unifecaf-conhecer/tecnico/css/tema.css`).
  - Linguagem visual copiada do institucional: gradiente azul diagonal no hero com
    arcos decorativos, olho-mágico com a seção em caixa alta acima dos títulos, títulos
    de duas linhas com a segunda em azul (`.t-acento`), botões em pill, cartão branco
    sobrepondo o fim do hero, cards com raio grande e sombra suave.

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

Página → Google Apps Script → planilha do Google. Mesmo caminho que o site da
Conhecer já usa hoje.

O N8N saiu do plano. Ele existia para guardar a chave da API do Brota Flow, mas
o próprio site da Conhecer tem `brotaFlowEndpoint` vazio com a nota "o CRM ainda
não expõe essa rota". Guardar a chave de uma porta que não existe não se paga.
Quando o Brota Flow expuser a rota, é só preencher `CONFIG.DESTINOS_LEAD.crm`:
os dois destinos recebem o mesmo envio.

**Por que `mode: 'no-cors'` e `Content-Type: text/plain`**

O navegador tem uma regra de segurança, o CORS. Um POST com
`Content-Type: application/json` para outro domínio dispara antes um pedido de
permissão, o preflight `OPTIONS`. O Apps Script não responde a `OPTIONS`, então
o envio morre antes de chegar lá. Com `text/plain` o navegador trata como pedido
simples e manda direto. O corpo continua sendo JSON, e o `doPost` faz
`JSON.parse` normalmente.

**O preço:** `no-cors` devolve resposta opaca. A página não consegue saber se o
destino aceitou, então o envio é "dispara e segue" e a confirmação aparece de
qualquer jeito. Se o Apps Script quebrar, o lead some em silêncio. **Confira a
planilha periodicamente** e refaça o teste abaixo depois de qualquer mudança.

**Teste obrigatório depois de configurar:** abra a página, preencha com o nome
"TESTE" e envie. A linha tem que aparecer na planilha em segundos.

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
