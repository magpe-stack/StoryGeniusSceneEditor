# Story Genius Scene Editor

PWA minimalista (preto e branco, com modo claro/escuro) para escrever cenas de romance guiado pelos pilares do método *Story Genius*, de Lisa Cron. Funciona offline, é instalável e não depende de servidor, conta ou internet depois do primeiro carregamento.

> Projeto independente, inspirado no método. Não é afiliado à autora nem à editora.

---

## 1. Estrutura do projeto

```
/
├── index.html      # estrutura da página
├── style.css       # design system preto e branco, claro/escuro
├── app.js          # formulário Story Genius, salvar/carregar, tema
├── sw.js           # service worker (offline)
├── manifest.json   # manifesto PWA
├── logo.svg        # logotipo
├── icon-192.png    # ícone PWA 192×192
├── icon-512.png    # ícone PWA 512×512
└── README.md
```

---

## 2. Como usar

Todos os botões são apenas ícones. Passe o mouse (ou mantenha o dedo) sobre um ícone para ver a dica.

### Barra superior

| Ícone | Função |
|-------|--------|
| Página com "+" | **Nova cena** (pede confirmação se houver alterações não salvas) |
| Pasta com seta | **Carregar** uma cena salva (`.json`) |
| Disquete | **Salvar** uma versão da cena (atalho: `Ctrl/Cmd + S`) |
| Círculo meio preenchido | **Alternar** tema claro/escuro |

### Os 6 campos da cena

1. **O Momento Gatilho (The Anchor)**: o que acontece logo no início que força o personagem a agir?
2. **O Que o Personagem Pensa/Sente (The Misbelief)**: que crença equivocada ou dor do passado guia a reação dele agora?
3. **O Objetivo Imediato (What Do They Want?)**: o que ele quer alcançar até o fim da cena?
4. **O Obstáculo/Conflito (The Trouble)**: o que o impede de conseguir?
5. **A Mudança/Revelação (The Shift)**: o que muda no final, emocional ou em entendimento? Qual o gancho para a próxima cena?
6. **Texto Livre da Cena**: a prosa em si, com barra de formatação (negrito, itálico, título, lista com marcadores, lista numerada, limpar formatação).

> Dica de fluxo: preencha de cima para baixo antes de escrever a prosa. Os campos 1 a 5 funcionam como o "motor" interno da cena.

### Salvando versões

- **Chrome, Edge e outros navegadores Chromium (computador):** ao clicar em Salvar pela primeira vez você escolhe uma pasta. Cada salvamento cria um **novo arquivo** com data e hora no nome (`titulo-da-cena_20261017-221500.json`), preservando o histórico de versões. A pasta fica lembrada durante a sessão.
- **Firefox, Safari e celulares:** o navegador não oferece acesso a pastas, então o salvamento **baixa** o arquivo JSON para a pasta de downloads.
- Além disso, um **rascunho automático** é mantido no navegador (localStorage), para você não perder o texto se fechar a aba sem querer. Ele **não substitui** o salvamento em arquivo.

### Carregando

Clique no ícone de pasta com seta e escolha um arquivo `.json` salvo antes. Apenas arquivos gerados por este app são aceitos.

---

## 3. Como instalar como PWA

O app precisa ser aberto por **HTTPS** (o GitHub Pages já oferece isso) ou por `localhost`.

**Computador (Chrome/Edge):** abra o site e clique no ícone de instalação na barra de endereços (ou menu ⋮ → *Instalar Story Genius Scene Editor*).

**Android (Chrome):** menu ⋮ → *Instalar app* / *Adicionar à tela inicial*.

**iPhone/iPad (Safari):** botão Compartilhar → *Adicionar à Tela de Início*.

Depois da primeira visita, o app funciona **offline**.

---

## 4. Publicando gratuitamente no GitHub Pages

1. Crie uma conta em <https://github.com> (se ainda não tiver).
2. Clique em **New repository**, dê um nome (ex.: `story-genius-scene-editor`), deixe **Public** e crie.
3. Envie **todos os arquivos** desta pasta para a raiz do repositório (botão *Add file → Upload files*, ou via `git`):
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

Todos os caminhos do projeto são relativos, então ele funciona normalmente dentro de um subcaminho como esse.

### Atualizando o app depois de publicar

Ao alterar qualquer arquivo, **mude o número da versão** em `sw.js` (`const CACHE = 'story-genius-v2'`, depois `v3`…). Isso faz os navegadores baixarem a versão nova em vez de usar o cache antigo.

---

## 5. Testando localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

---

## 6. Personalização

- **Cores:** variáveis CSS no topo de `style.css` (`:root` e `:root[data-theme="dark"]`).
- **Ícones:** edite `logo.svg` e gere novamente os PNGs (por exemplo com `rsvg-convert -w 192 logo.svg -o icon-192.png` e `-w 512` para o outro, ou com qualquer ferramenta que exporte SVG para PNG).
- **Campos do método:** adicione ou renomeie seções em `index.html` e inclua o novo nome em `FIELDS`/`data-field` conforme o padrão existente em `app.js`.

## Licença

Uso livre. Adapte como quiser.
