# Gerenciador

Interface estática (HTML + CSS + JS), sem build e sem servidor. Os dados ficam no `localStorage` do navegador.

## Arquivos
- `index.html` — estrutura das três abas e do modal
- `style.css` — estilos
- `script.js` — CRUD, gráficos e assistente
- `assets/assistente.png` — foto da assistente (você adiciona; sem ela aparece uma silhueta cinza)

## Publicar no GitHub Pages
1. Crie um repositório e envie os arquivos na raiz, mantendo a pasta `assets/`.
2. Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. Aguarde um minuto: o site abre em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

Localmente, basta dar dois cliques no `index.html`.

## Login, jogo e supervisor
- `login.html` — entrada. Contas de demonstração: `colaborador / colab123` (Lucas), `colaborador2 / colab456` (Beatriz) e `supervisor / super123` (edite em `plataforma.js`).
- `index.html` — página do colaborador; a aba **Onboarding** (e o ícone de controle na top-bar) mostra o jogo na mesma página, sem esconder a top-bar.
- `supervisor.html` — painel do supervisor com seletor de colaborador e duas abas: **Progresso no jogo** (porcentagem, fases, tentativas, vidas, tempo, atividade recente) e **Progresso na empresa** (atividades do Gerenciador, com filtros por status e prioridade). Cada colaborador tem as próprias atividades.
- `plataforma.js` — usuários, sessão e progresso. `jogo/game.js` envia o progresso por `postMessage`.
- Tudo é salvo no `localStorage`: colaborador e supervisor precisam usar o **mesmo navegador/computador**. Para uso real entre máquinas, troque `Progresso` e `Auth` por chamadas a um servidor.
- As senhas ficam visíveis no código: isto é uma demonstração, não segurança real.

## Novidades
- **Game over:** mensagem "Um passo de cada vez. Estamos juntos nessa!" com o subtítulo "Travou na missão? Acione o SOS e peça reforços!" (`jogo/game.js`).
- **SOS no assistente:** botão SOS na conversa da Kayla. Ao clicar, o supervisor vê o pedido no topo do painel (`supervisor.html`), com o botão "Marcar como atendido".
- **Blog (aba Blog):** 3 posts de estagiários fictícios, mais curtidas, comentários e publicação de posts novos. Salvo no `localStorage` e compartilhado entre os usuários do mesmo navegador.
- **Tela de login com abas:** botões "Apresentação" e "Login" no topo, com troca instantânea (igual a Análises ↔ IA). A apresentação mostra os 5 slides do `Estagiario_Bros_V_Final.pptx` (imagens em `assets/slides/`), com setas, bolinhas e teclado ← →. Link direto: `login.html#apresentacao`.
- **Tela cheia na apresentação:** botão ao lado das setas (ou tecla F); Esc para sair. Em navegadores sem a API de tela cheia (ex.: iPhone), a apresentação cobre a janela inteira.
