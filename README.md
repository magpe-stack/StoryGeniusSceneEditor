# Story Genius Scene Editor

PWA minimalista (preto e branco, com modo claro/escuro) para planejar e escrever um romance seguindo o método *Story Genius*, de Lisa Cron. Do dashboard às fichas de cada fase, dos cartões de cena ao editor de rascunho, tudo funciona **offline**, é **instalável** e guarda seus dados **no seu próprio dispositivo**: não há servidor, conta nem rastreamento.

> Projeto independente, inspirado no método. Não é afiliado à autora nem à editora. Para aprender o método de verdade, leia o livro.

---

## 1. O método em um parágrafo

No *Story Genius*, o enredo nasce de **dentro** do protagonista. Primeiro você descobre a **Falsa Crença** que o move (uma ideia equivocada, adquirida cedo, sobre como o mundo funciona), depois constrói um enredo **causal** em que cada acontecimento externo pressiona essa crença. A camada interna, onde o protagonista percebe, sente e muda, é o **Terceiro Trilho**. Um evento que não toca o Terceiro Trilho é **ação vazia**: movimento sem história.

---

## 2. Estrutura do projeto

```
/
├── index.html      # estrutura da página e sprite de ícones
├── style.css       # design system preto e branco, claro/escuro
├── app.js          # fases, fichas, cartões de cena, editor, exportações
├── sw.js           # service worker (offline)
├── manifest.json   # manifesto PWA
├── logo.svg        # logotipo
├── icon-192.png    # ícone PWA 192×192
├── icon-512.png    # ícone PWA 512×512
└── README.md
```

---

## 3. Como publicar gratuitamente no GitHub Pages

1. Crie uma conta em <https://github.com> (se ainda não tiver).
2. Clique em **New repository**, dê um nome (ex.: `story-genius-scene-editor`), deixe **Public** e crie.
3. Envie **todos os arquivos** para a **raiz** do repositório (*Add file → Upload files*) ou use o `git`:
   ```bash
   git init
   git add .
   git commit -m "Story Genius Scene Editor"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/story-genius-scene-editor.git
   git push -u origin main
   ```
4. No repositório, abra **Settings → Pages**.
5. Em **Build and deployment → Source**, escolha **Deploy from a branch**, branch **main**, pasta **/ (root)**, e clique em **Save**.
6. Aguarde 1 a 2 minutos. O endereço será:
   `https://SEU-USUARIO.github.io/story-genius-scene-editor/`

Todos os caminhos são relativos, então o app funciona normalmente dentro de um subcaminho como esse.

**Atualizando depois de publicar:** a cada alteração, aumente o número da versão em `sw.js` (`const CACHE = 'story-genius-v4'`, depois `v5`…). Sem isso, os navegadores continuam usando a versão antiga em cache.

**Testando no seu computador:**
```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

---

## 4. Como instalar como PWA

O app precisa ser aberto por **HTTPS** (o GitHub Pages já oferece) ou por `localhost`.

| Dispositivo | Como instalar |
|-------------|---------------|
| **Computador (Chrome / Edge)** | Abra o site e clique no ícone de instalação na barra de endereços, ou menu ⋮ → *Instalar Story Genius Scene Editor*. |
| **Android (Chrome)** | Menu ⋮ → *Instalar app* (ou *Adicionar à tela inicial*). |
| **iPhone / iPad (Safari)** | Botão Compartilhar → *Adicionar à Tela de Início*. |

Depois da primeira visita, o app abre e funciona **sem internet**.

---

## 5. Guia de uso

### 5.1 Navegação

Todos os botões do app são **apenas ícones**. Passe o mouse (ou mantenha o dedo) sobre qualquer um para ver a dica.

**Menu de fases** (coluna à esquerda no computador; barra inferior no celular):

| Ícone | Tela |
|-------|------|
| Quatro quadrados | **Dashboard**: resumo, estatísticas e atalhos |
| Faísca | **Fase 1 · Fundação** |
| Pessoa | **Fase 2 · Psique do Protagonista** |
| Caminho ramificado | **Fase 3 · Enredo Causal e Terceiro Trilho** |
| Cartão | **Fase 4 · Cartões de Cena** |
| Bandeira | **Fase 5 · Roteiro** |
| Caneta | **Editor de rascunho** |

**Cabeçalho** (ações do projeto inteiro):

| Ícone | Função |
|-------|--------|
| Página com "+" | **Novo projeto** (apaga o atual deste navegador, com confirmação) |
| Pasta com seta | **Carregar backup** do projeto (`.json`) |
| Seta para baixo | **Baixar backup completo** em JSON (atalho: `Ctrl/Cmd + S`) |
| Quadro "M" | **Exportar livro completo / dossiê** em Markdown (`.md`) |
| Página com linhas | **Exportar livro completo / dossiê** em TXT |
| Sol / lua | **Alternar** modo claro e escuro (a preferência fica salva) |

O título do projeto é editado direto no cabeçalho.

### 5.2 Dashboard

Mostra o percentual de planejamento concluído, as palavras do rascunho e das fichas, o número de cenas e de cartões completos, e os **alertas de ação vazia**. Abaixo, cada fase tem barra de progresso e as fichas preenchidas aparecem destacadas. Os atalhos criam uma cena, continuam a escrita da última cena aberta, abrem a Matriz do Terceiro Trilho e o roteiro, ou baixam o backup.

### 5.3 As cinco fases

1. **Fundação:** *A Primeira Fagulha*, *Conexão Autoral*, *Ponto Central (Mensagem Moral)* e *Premissa "E Se?"*.
2. **Psique do Protagonista:** *Estado Inicial*, *Desejo Superficial vs. Motivação Interna*, *Falsa Crença Central*, *Cena de Origem* (escrita em primeira pessoa, com contador de palavras) e as *3 Cenas de Encruzilhada*.
3. **Enredo Causal e Terceiro Trilho:**
   - *Problema Externo Principal*.
   - **Matriz do Terceiro Trilho:** liste os conflitos e eventos externos e, para cada um, responda *Afeta a Falsa Crença?* (Sim/Não) e *Como afeta*. Uma linha marcada **Não** recebe o alerta visual **AÇÃO VAZIA** (destacada em preto e branco), e um aviso no topo da matriz conta quantos conflitos estão vazios. Linhas com "Sim" mas sem explicação ficam **Pendentes**. A Falsa Crença da Fase 2 aparece no topo da tela como referência.
   - *Subtramas / Personagens de Apoio*, com nome, papel (aliado, antagonista, mentor…) e conexão com a Falsa Crença.
4. **Cartões de Cena:** cada cartão tem *Ponto Alfa*, *Causa Externa*, *Efeito Prático*, *Terceiro Trilho / Insight* e *"E Por Isso?"*. Você pode **criar, editar, reordenar (setas), excluir** e abrir o cartão no editor. Se um cartão tem conteúdo mas o Terceiro Trilho está vazio, ele mostra o alerta de **ação vazia**. O ícone de corrente ao lado de "E Por Isso?" copia esse texto para o **Ponto Alfa da próxima cena** (criando a cena, se não existir): é o encadeamento causal do método.
5. **Roteiro:** linha do tempo das cenas, com estado do cartão (completo/incompleto), palavras escritas e atalhos para o editor e para o cartão.

### 5.4 Editor de rascunho

- Escolha a cena na lista no topo. O **cartão de cena** fica num painel lateral como guia (no celular ele começa oculto, para dar espaço ao texto); o ícone de painel mostra ou oculta.
- A barra de ferramentas tem negrito, itálico, título, listas e limpar formatação.
- O rodapé mostra **palavras e caracteres em tempo real**.
- **Modo foco** (ícone de cantos): esconde tudo, exceto o texto. Saia com o mesmo ícone ou com `Esc`.
- Colar sempre insere **texto simples**, sem estilos externos.

### 5.5 Salvar e carregar por ficha

Cada ficha, cada cartão de cena, as listas (matriz, subtramas e o conjunto de cartões) e o editor têm três ícones:

| Ícone | Função |
|-------|--------|
| Página com linhas | **Salvar em TXT**: texto legível com os campos rotulados |
| Página com chaves | **Salvar em JSON**: dados estruturados |
| Pasta com seta | **Carregar documento** (`.json` ou `.txt`) e preencher a ficha |

Regras de carregamento:
- O **JSON** deve ter sido gerado pelo próprio app. Em listas, ele **substitui** todos os itens (o app pede confirmação).
- O **TXT** é lido pelos rótulos entre colchetes (`[Ponto Alfa]`). Um TXT "solto" (sem rótulos) preenche fichas de um único campo e o editor.
- Nas listas, o TXT usa blocos `### ITEM n`.
- Um backup de projeto não entra numa ficha: use o ícone de carregar do cabeçalho.

### 5.6 Onde ficam os arquivos

- **Chrome, Edge e outros Chromium (computador):** na primeira gravação você escolhe uma pasta. Cada salvamento cria um **arquivo novo** com data e hora no nome, preservando o histórico. A pasta fica lembrada durante a sessão.
- **Firefox, Safari e celulares:** o navegador não oferece acesso a pastas, então os arquivos são **baixados** para a pasta de Downloads.
- Independentemente disso, o projeto é **salvo automaticamente neste navegador**. Esse armazenamento pode ser apagado ao limpar os dados do site, então **baixe backups com frequência** (o dashboard mostra a data do último).

---

## 6. Personalização

- **Cores:** variáveis CSS no topo de `style.css` (`:root` e `:root[data-theme="dark"]`).
- **Ícones:** edite `logo.svg` e gere novamente os PNGs (por exemplo `rsvg-convert -w 192 logo.svg -o icon-192.png` e `-w 512` para o outro, ou qualquer ferramenta que exporte SVG para PNG).
- **Textos-guia das fichas:** estão nas funções `viewP1` a `viewP5` em `app.js`.

## Licença

Uso livre. Adapte como quiser.
