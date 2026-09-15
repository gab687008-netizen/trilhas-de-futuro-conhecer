# Landing Page — Trilhas de Futuro (Escola Técnica Conhecer)

Página de pré-captura de leads para a campanha do Trilhas de Futuro. Objetivo: capturar
o contato de quem quer se inscrever **antes** de mandar a pessoa para o site oficial do
Governo de Minas Gerais — porque quem trava lá no meio simplesmente some, sem deixar
rastro nenhum pra gente.

Arquivos: `index.html`, `style.css`, `script.js`. Sem build, sem dependências — abre
direto no navegador pra testar.

## Decisões já tomadas (não precisa perguntar de novo)

- **Identidade visual**: alinhada ao site da Conhecer.

  > **EM ABERTO — roxo ou azul?** A página está em ROXO, amostrado de um print do
  > site da Conhecer no ar. Mas o código-fonte do site deles
  > (`github.com/henriquemendes089-blip/unifecaf-conhecer`, pasta `tecnico/`) está em
  > AZUL `#0a3dae`, e nenhum commit do histórico tem roxo. As duas referências
  > discordam. A paleta azul já está pronta em `style.css` num bloco comentado —
  > é só descomentar. Decidir com a Conhecer antes de publicar.
  - **A marca é ROXA, a logo é AZUL.** Não é inconsistência — é assim que o
    institucional usa. Manter.
  - Paleta (em `style.css`, `:root`):
    | token | hex | uso |
    |---|---|---|
    | `--roxo-900` | `#20006D` | início do gradiente, rodapé |
    | `--roxo-800` | `#2D098D` | linha de acento dos títulos de seção |
    | `--roxo-700` | `#3601AB` | **cor de ação**: botões, links, ícones |
    | `--roxo-600` | `#4613D0` | fim do gradiente |
    | `--lilas` | `#A2B0FF` | acento de título sobre fundo escuro |
    | `--azul-marca` | `#0B3DAE` | a logo (só ela) |
  - Logos em `assets/`:
    - `logo-conhecer-horizontal.png` — lockup horizontal (símbolo + texto lado a
      lado), usado no header. Gerado a partir do lockup vertical original, porque o
      vertical é alto demais pra uma barra de topo.
    - `logo-conhecer-horizontal-branco.png` — mesma coisa em branco, pro rodapé roxo.
    - `logo-conhecer-branco.png` — lockup vertical em branco (reserva).
    - `logo-conhecer-azul-transparente.png` / `logo-conhecer-fundo-azul.png` —
      arquivos originais, mantidos.
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
- [ ] **`script.js` → `CONFIG.WHATSAPP_NUMERO`**: número único, só dígitos com DDI+DDD.
- [ ] **`script.js` → `CONFIG.URL_INSCRICAO_OFICIAL`**: preencher só quando o edital
      abrir de verdade — antes disso, deixar vazio (a página já lida com isso sozinha).
- [ ] **Decidir roxo x azul** (ver aviso acima) — muda a página inteira, 1 bloco
      comentado em `style.css`.
- [ ] **Cursos de Gestão e Tecnologia**: o arquivo de dados da Conhecer lista 11
      cursos (Contabilidade, Comércio, Condomínio, Vendas, Transações Imobiliárias,
      Logística, Desenvolvimento de Sistemas, Computação Gráfica, Informática, Jogos
      Digitais, Redes de Computadores) **sem unidade atribuída**. Por isso não estão
      na página nem no select do formulário. Confirmar quais entram no Trilhas de
      Futuro e em que unidade.
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
