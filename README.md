# Landing Page — Trilhas de Futuro (Escola Técnica Conhecer)

Página de pré-captura de leads para a campanha do Trilhas de Futuro. Objetivo: capturar
o contato de quem quer se inscrever **antes** de mandar a pessoa para o site oficial do
Governo de Minas Gerais — porque quem trava lá no meio simplesmente some, sem deixar
rastro nenhum pra gente.

Arquivos: `index.html`, `style.css`, `script.js`. Sem build, sem dependências — abre
direto no navegador pra testar.

## Decisões já tomadas (não precisa perguntar de novo)

- **Identidade visual**: azul oficial da Conhecer, o mesmo do site deles
  (`unifecaf-conhecer/tecnico/css/tema.css`, `--cor: #0a3dae`). O roxo do print
  inicial foi descartado — nenhum commit do site da Conhecer tem roxo.
  - Paleta (em `style.css`, `:root`, num bloco único):
    | token | hex | uso |
    |---|---|---|
    | `--marca-900` | `#041C57` | início do gradiente, rodapé |
    | `--marca-800` | `#072D85` | linha de acento dos títulos de seção |
    | `--marca-700` | `#0A3DAE` | **cor de ação**: botões, links, ícones |
    | `--marca-600` | `#2A63E0` | fim do gradiente |
    | `--acento` | `#9FBCFF` | acento de título sobre fundo escuro |
    | `--logo-azul` / `--logo-navy` / `--logo-cinza` | `#1988E2` / `#01335D` / `#838A8E` | cores do arquivo da logo |
  - Logos em `assets/`:
    - `logo-conhecer-oficial.webp` — lockup horizontal colorido, usado no header.
      É o arquivo do próprio site da Conhecer.
    - `logo-conhecer-oficial-branco.png` — mesma logo em branco, para o rodapé azul.
    - `logo-conhecer-azul-transparente.png` — lockup vertical, usado só como favicon.
    - `logo-conhecer-fundo-azul.png` — arquivo original que a Brota enviou. Não é
      usado na página; mantido como fonte.
  - Fontes: **Sora** (títulos) + **Instrument Sans** (corpo), ambas Google Fonts.
    Não são mais aproximação — são as fontes que o próprio site da Conhecer usa
    (`unifecaf-conhecer/tecnico/css/tema.css`).
  - Linguagem visual copiada do institucional: gradiente roxo diagonal no hero com
    arcos decorativos, olho-mágico `— SEÇÃO` em caixa alta acima dos títulos, títulos
    de duas linhas com a segunda em roxo (`.t-acento`), botões em pill, cartão branco
    sobrepondo o fim do hero, cards com raio grande e sombra suave.

- **Página pronta agora, publicação depois**: o texto já assume que o edital "abre em
  breve" — a página funciona tanto no modo "lista de espera" quanto no modo "inscrições
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
- **Lead vai pro Brota Flow / CRM da Conhecer** — mas como a chave de API não pode
  ficar exposta no código da página (é público), o caminho é: página → webhook
  intermediário (ex: N8N) → N8N chama a API do Brota Flow com a chave guardada no
  servidor. Ver `CONFIG.WEBHOOK_URL` em `script.js`.

## Checklist antes de publicar

Tudo marcado com `[PREENCHER]` no código, mais:

- [ ] **`script.js` → `CONFIG.WEBHOOK_URL`**: endpoint do N8N (ou equivalente) que
      recebe o POST do formulário e cria o contato no Brota Flow.
- [ ] **`script.js` → `CONFIG.URL_INSCRICAO_OFICIAL`**: preencher só quando o edital
      abrir de verdade — antes disso, deixar vazio (a página já lida com isso sozinha).
- [ ] **Confirmar com a Conhecer se ela está credenciada na 7ª edição** e para quais
      cursos e unidades. Sem isso a página não tem destino. Ver a seção de pesquisa.
- [ ] **`index.html` → benefício "Auxílio financeiro"**: valor e regras reais,
      conforme o edital oficial — **não publicar um valor sem confirmar no edital**.
- [ ] **`index.html` → FAQ**: pré-requisitos reais (ensino médio concluído? idade
      mínima?) conforme o edital.
- [ ] **`index.html` → vídeo do passo a passo**: gravar e substituir o placeholder
      (`.video-placeholder`) por um `<iframe>` de verdade.
- [ ] **Domínio**: publicar em domínio/hospedagem da própria Conhecer (decidido
      anteriormente) — a proposta comercial sugeriu `grupoconhecer.com.br/trilhas-de-
      futuro`, mas isso ainda não está confirmado/registrado.
- [ ] **Pixels**: descomentar e preencher os IDs do Google Analytics e do Meta Pixel
      no `<head>` do `index.html` quando existirem.
- [ ] **QR Codes / mídias offline**: gerar cada QR/link com `?canal=` diferente (ex:
      `?canal=outdoor-bh`, `?canal=panfleto-neves`) — a página já captura isso sozinha
      e manda junto com o lead. UTMs padrão (`utm_source`, `utm_medium`,
      `utm_campaign`) também são capturados automaticamente.

## Pesquisa sobre o edital (base de referência, NÃO publicar ainda)

Levantado em 15/09/2026 por busca web. O acesso direto a `trilhasdefuturo.mg.gov.br`
está bloqueado pela rede desta sessão, então **nada aqui foi lido do edital oficial** —
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

**Contraditório entre fontes — resolver antes de escrever o FAQ:**

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
   saiu e para quais cursos e unidades** — se não saiu, a página não tem para onde
   mandar o lead, e isso muda o prazo do projeto inteiro.

Fontes: [SEE/MG — cursos prioritários da 7ª edição](https://www.educacao.mg.gov.br/governo-de-minas-publica-lista-de-cursos-profissionalizantes-prioritarios-para-a-7a-edicao-do-trilhas-de-futuro/) ·
[SEE/MG — dúvidas frequentes](https://www.educacao.mg.gov.br/veja-respostas-as-principais-duvidas-sobre-o-programa-trilhas-de-futuro/) ·
[Agência Minas — cursos prioritários 7ª edição](https://agenciamg.com.br/2026/04/24/governo-de-minas-divulga-cursos-prioritarios-para-a-7a-edicao-do-programa-trilhas-de-futuro/) ·
[SEE/MG — inscrições ampliadas até 1º de outubro](https://www.educacao.mg.gov.br/inscricoes-do-trilhas-de-futuro-sao-ampliadas-ate-1o-de-outubro/) ·
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
verdade — não precisa do webhook pronto pra testar o resto da página.
