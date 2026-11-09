# Guia do projeto — jogo de plataforma

Este documento descreve a versão atual do jogo para que outra pessoa ou IA possa entendê-lo e alterá-lo sem depender do histórico da conversa. Leia-o junto com `game.js`, `levels.js`, `dialogs.js`, `assets.js`, `assets_fase2.js` e `index.html`.

## Visão geral

Jogo de plataforma 2D feito com **Phaser 3.90.0** e **Arcade Physics**. A experiência acompanha um estagiário no primeiro dia em um estúdio de streaming. A Fase 1 tem clima de mistério dos anos 80, a mentora Marina, inimigos chamados Confusão, dúvidas coletáveis e uma lição ao final. A Fase 2 é uma missão de infiltração com lasers, interruptor, cofre e contagem regressiva de fuga.

A entrada atual do jogo é **`index.html`**. O projeto está dividido em arquivos JavaScript, mas pode ser aberto diretamente no navegador sem servidor:

1. `index.html` tenta carregar `phaser.min.js` da mesma pasta.
2. Se a cópia local falhar, tenta Phaser 3.90.0 por jsDelivr e depois cdnjs.
3. Carrega, em sequência: `assets.js`, `assets_fase2.js`, `levels.js`, `dialogs.js` e `game.js`.
4. `game.js` inicia o Phaser depois que as dependências foram carregadas.

A cópia local do Phaser permite abrir o jogo sem internet. Se ela não estiver disponível, o navegador precisa de conexão para usar as CDNs. `jogo-plataforma.html` e `jogo-luz-vermelha-teste.html` são protótipos anteriores; **não são a entrada desta versão**.

## Arquivos e responsabilidades

| Arquivo | Responsabilidade |
|---|---|
| `index.html` | Página de entrada, dimensões da página, ordem de carregamento e fallback do Phaser. |
| `phaser.min.js` | Biblioteca Phaser 3 local. |
| `assets.js` | Sprites e texturas da Fase 1 em data URI. Define constantes globais e `window.GAME_ASSETS`. |
| `assets_fase2.js` | Sprites e texturas exclusivos da Fase 2 em data URI, dentro de `window.ASSETS_FASE2`. |
| `levels.js` | Dados das fases: largura, plataformas, inimigos, coletáveis, lasers, checkpoints, interruptores, cofre, NPC, lição e meta. |
| `dialogs.js` | Lista de dicas (`window.DIALOGS`) e falas de NPC separadas pelo ID da fase (`window.NPC_DIALOGS`). |
| `game.js` | Física, câmera, animações, carregamento de fase, HUD, colisões, diálogos, lasers, interruptores, cofre, fuga, checkpoints e efeitos visuais. |
| `assistente-de-ia.md` | Este guia de manutenção. |

## Controles

- **Andar:** setas esquerda/direita ou `A`/`D`.
- **Pular:** `Espaço` ou seta para cima. Segurar o botão por até 240 ms pode aumentar a altura do salto.
- **Interruptor (Fase 2):** `E` quando estiver a menos de 80 px e o prompt `[E] Ativar` aparecer.
- **Diálogo da mentora (Fase 1):** `Espaço` ou `Enter` avança cada fala.
- **Diálogo da TI (Fase 2):** somente `Enter` avança cada fala.
- **Lição da fase:** `Enter` fecha a lição e avança para a próxima fase.
- **Game Over:** `Enter` reinicia a fase atual com três vidas.

Na Fase 1, o jogador começa a menos de 80 px da Marina, então a primeira conversa abre logo no início. A conversa pausa a física, o relógio e as animações; os controles de diálogo continuam ativos.

## Configurações principais (`game.js`)

Os valores ajustáveis estão no topo de `game.js`. Distâncias e velocidades estão em pixels e pixels por segundo; tempos estão em milissegundos.

| Constante | Valor atual | Uso |
|---|---:|---|
| `LARGURA_TELA`, `ALTURA_TELA` | 800 × 450 | Tamanho da área visível do jogo. |
| `ALTURA_FASE` | 1200 | Altura total dos limites físicos do mundo. |
| `ALTURA_CHAO` | 390 | Altura do topo da superfície do chão. |
| `ALTURA_TEXTURA_CHAO` | 120 | Altura da faixa decorativa do chão. |
| `VELOCIDADE_JOGADOR` | 240 | Limite horizontal do jogador. |
| `ACELERACAO_JOGADOR` | 1500 | Aceleração ao pressionar uma direção. |
| `DESACELERACAO_JOGADOR` | 1400 | Arrasto ao soltar a direção. |
| `FORCA_PULO` | 430 | Impulso vertical inicial. |
| `TEMPO_PULO_VARIAVEL` | 240 | Janela em que segurar o botão reduz a gravidade da subida. |
| `GRAVIDADE` | 1000 | Gravidade padrão do mundo Arcade. |
| `GRAVIDADE_DURANTE_PULO` | 450 | Gravidade efetiva durante a janela do pulo segurado. |
| `GRAVIDADE_EXTRA_QUEDA` | 650 | Gravidade adicional durante a descida. |
| `VELOCIDADE_MAXIMA_QUEDA` | 650 | Limite da velocidade vertical. |
| `TEMPO_COYOTE_MS` | 100 | Janela para pular logo depois de sair de uma borda. |
| `TEMPO_BUFFER_PULO_MS` | 120 | Janela para guardar um comando de pulo antes de pousar. |
| `LERP_CAMERA` | 0.1 | Suavidade do acompanhamento horizontal da câmera. |
| `VIDAS_INICIAIS` | 3 | Vidas ao iniciar e ao reiniciar após Game Over. |
| `TEMPO_FUGA` | 15000 | Tempo em ms para fugir após pegar o projeto (Fase 2). |
| `DURACAO_INVENCIBILIDADE_MS` | 1000 | Proteção depois de receber dano. |
| `INTERVALO_PISCAR_INVENCIBILIDADE_MS` | 100 | Intervalo do pisca após dano. |
| `VELOCIDADE_INIMIGO` | 60 | Velocidade horizontal das patrulhas. |
| `INTERVALO_ANIMACAO_INIMIGO` | 250 | Intervalo previsto entre quadros dos inimigos. |
| `TAMANHO_INIMIGO_TELA` | 48 | Largura e altura visual/hitbox dos inimigos. |
| `LARGURA_NPC_TELA`, `ALTURA_NPC_TELA` | 72 × 112 | Tamanho visual da mentora; altura igual à do personagem. |
| `FATOR_ESCALA_CORRIDA` | 0.98 | Pequeno ajuste de escala para quadros de corrida e poses no ar. |
| `INTERVALO_ANIMACAO_CORRIDA` | 120 | Tempo entre quadros da corrida. |
| `INTERVALO_ANIMACAO_PARADO` | 750 | Tempo entre as poses de respiração. |
| `DISTANCIA_DIALOGO_NPC` | 80 | Distância em px que abre o diálogo ao se aproximar do NPC. |

## Fases (`levels.js`)

`window.LEVELS` é uma lista ordenada. `indiceFaseAtual` em `game.js` escolhe o objeto atual. Ao tocar na meta, o jogo mostra a lição; `Enter` avança o índice e recria a cena. Ao confirmar a última lição, mostra `Fim de jogo`.

Cada objeto pode conter:

```js
{
  id: 3,
  nome: "Nome da fase",
  largura: 4000,
  corFundo: "#1a1a2e",          // cor de fundo da câmera (opcional; padrão: '#8ed6ff')
  plataformas: [{ x, y, largura, altura }],
  inimigos: [{ tipo: "confusao", x, y, alcance }],
  coletaveis: [
    { tipo: "duvida", x, y },
    { tipo: "cracha", x, y }
  ],
  checkpoints: [{ x, y }],      // opcional; apenas Fase 2 e posteriores usam
  lasers: [                     // opcional
    { id, tipo: "intermitente", x, y, largura, altura, atraso, tempoLigado, ciclo },
    { id, tipo: "movel", x, y, largura, altura, eixo: "x"|"y", alcance, velocidade },
    { id, tipo: "fixo", x, y, largura, altura }
  ],
  interruptores: [              // opcional
    { id, x, y, desliga: ["id_laser_1", "id_laser_2"], duracao }
  ],
  cofre: { x, y },             // opcional; ativa a mecânica de fuga ao ser tocado
  npc: { x, y },
  licao: { titulo: "Título", itens: ["Lição A", "Lição B"] },
  meta: { x, y }
}
```

Convenção de coordenadas:

- Plataforma: `x` e `y` são o canto superior esquerdo; `largura` e `altura` são dimensões.
- Inimigo: `x`,`y` são o centro inicial; `alcance` é a largura total da patrulha, com limites `x ± alcance/2`.
- Laser: `x`,`y` são o centro do retângulo; `largura`/`altura` são dimensões.
- Checkpoint, coletável, NPC, cofre e meta: `x`,`y` indicam o centro.
- A superfície do chão está em `y = ALTURA_CHAO` (390). O retângulo físico do chão fica abaixo dessa linha.

### Conteúdo atual

**Fase 1 — "Fase 1" / "Primeiro dia"**

- Largura de mundo: 4000 px. Cor de fundo padrão (azul claro).
- 14 plataformas alternadas entre `y=265` e `y=160`, cada uma com 190 × 18 px. Os degraus entre níveis têm 105 px; a primeira plataforma está 125 px acima do chão. A posição foi elevada para permitir atravessar por baixo no nível do chão.
- 4 inimigos `confusao`, 5 dúvidas, 6 crachás, Marina no início e meta em `x=3900`.
- Sem lasers, interruptores, cofre ou checkpoints.
- Fundo, luzes e névoa especiais são ativados quando `fase.id === 1`.
- Lição: "Primeiro dia concluído!" com 3 ensinamentos.

**Fase 2 — "O Plano"**

- Largura: 5000 px. Cor de fundo `#1a1a2e` (azul escuro). Fundo de corredor com parallax (0.3×).
- 3 salas lógicas: Sala 1 (0–1600), Sala 2 (1600–3200), Sala 3 (3200–5000).
- 8 plataformas distribuídas pelas 3 salas.
- Sem inimigos `confusao`.
- **2 checkpoints**: início da Sala 2 (`x=1616`) e Sala 3 (`x=3216`).
- **5 lasers intermitentes** na Sala 2 (onda sincronizada, ciclo de 5,2 s).
- **1 laser móvel vertical** e **1 horizontal** na Sala 2.
- **3 lasers intermitentes** no início da Sala 3.
- **1 laser móvel rápido** (velocidade 120) na Sala 3.
- **4 lasers fixos** formando um corredor bloqueado antes do cofre.
- **1 interruptor** (`x=3740`) que desliga os 4 lasers fixos por 6 s, com aviso piscante 1,5 s antes de religarem.
- NPC de TI em `x=3670`, junto ao interruptor; 3 falas instruindo a usar o interruptor.
- **Cofre** em `x=4000`; ao tocar, inicia 15 s de fuga com overlay vermelho e HUD de contagem.
- Meta em `x=4900`. Sem o projeto, a meta exibe aviso e não permite avançar.
- Respawn após dano sempre no checkpoint mais recente; fuga reinicia com 15 s a cada respawn no cofre.

## Textos (`dialogs.js` e `levels.js`)

- `window.DIALOGS` contém as dicas das dúvidas, apresentadas em ordem e em ciclo se houver mais coletas do que textos.
- `window.NPC_DIALOGS` associa listas de falas ao `id` da fase.
- `licao.titulo` e `licao.itens` ficam dentro do objeto da fase. O painel só aparece ao tocar na meta.
- O contador de dúvidas mostra `coletadas/total da fase`; crachás mostram o total coletado naquela fase.

## Física e movimento do personagem

- O jogador é uma imagem com corpo Arcade, e não um sprite animado pelo sistema de animações do Phaser. `update()` seleciona manualmente a textura correta.
- Horizontalmente, acelera enquanto uma direção está pressionada e desacelera com arrasto quando solta.
- O pulo inicia com `-FORCA_PULO`. O coyote time e o jump buffer guardam comandos por janelas curtas. Segurar o botão reduz temporariamente a gravidade na subida; a gravidade extra acelera a descida.
- A câmera segue o jogador apenas no eixo X, com interpolação `LERP_CAMERA`.
- Os quadros do personagem têm proporções diferentes. `aplicarPoseParado()`, `aplicarPoseCorrida()` e `aplicarPoseNoAr()` atualizam textura, tamanho, caixa Arcade e deslocamento da hitbox. As poses mantêm a base dos pés alinhada.
- O corpo de colisão do personagem é mais estreito do que braços e pernas da arte, para evitar que a silhueta estendida cause colisões injustas.
- Ao cair abaixo de `ALTURA_CHAO + 220`, `perderVida()` retira uma vida e, se ainda houver vidas, reposiciona o jogador no checkpoint mais recente (Fase 2) ou no início (Fase 1).

## Vidas e inimigos

### Vidas

O HUD usa até três imagens `coracao`, fixas à câmera (`scrollFactor 0`). `perderVida(cena, direcaoEmpurrao, reiniciarNoInicio)` é a função reutilizável para dano. Ela respeita a invencibilidade, atualiza os corações e, ao zerar as vidas, exibe Game Over. `Enter` reinicia a fase atual com três vidas.

### Inimigos `confusao`

- Um retângulo vermelho 32×32 é o fallback caso as texturas não estejam carregadas; com os assets atuais, a criatura aparece em 48×48 e a hitbox acompanha esse tamanho.
- A patrulha inverte a direção nos limites definidos por `x` e `alcance`, a 60 px/s.
- Ao cair sobre o inimigo com velocidade vertical positiva e vindo de cima, ele some e o jogador recebe um quique pequeno.
- Ao tocar de lado, o inimigo chama `perderVida()`, aplica empurrão e inicia um segundo de invencibilidade com o jogador piscando.
- O código alterna entre `inimigo_confusao_1` e `inimigo_confusao_2` a cada 250 ms. No momento, `_2` é um alias da mesma imagem `_1`, pois só foi fornecida uma pose.

## Lasers, interruptores e cofre (Fase 2)

### Lasers

Criados pela função `criarLasers(cena, fase.lasers)`. Tipos suportados:

- **`intermitente`**: apagado por padrão; acende conforme `atraso` e permanece por `tempoLigado` ms a cada `ciclo` ms. A hitbox é desativada quando apagado.
- **`movel`**: se move continuamente entre `posicao ± alcance/2` no eixo `x` ou `y` à `velocidade` px/s.
- **`fixo`**: sempre ligado até que um interruptor o desligue.

Cada laser pode ter emissores visuais (textura `emissor_laser`) nas duas extremidades, atualizados a cada quadro.

Antes de um laser fixo religar, ele pisca por 1,5 s como aviso.

### Interruptores

Criados por `criarInterruptores(cena, fase.interruptores)`. Ao pressionar `E` próximo a um interruptor disponível:
- Os lasers listados em `desliga` ficam desligados por `duracao` ms.
- O HUD exibe a contagem regressiva (`Lasers desligados: Xs`).
- O interruptor só pode ser reativado 1 s após os lasers voltarem.

### Cofre e fuga

- Ao tocar no cofre, uma animação dourada aparece e o projeto é coletado automaticamente após 350 ms.
- `textoHUDProjeto` muda para "Projeto: ✔".
- O timer de fuga começa (`fimFugaEm = agora + TEMPO_FUGA`). Um overlay vermelho cobre a tela e pulsa.
- Se o timer zerar, chama `perderVida()` e reinicia os 15 s.
- O último checkpoint passa a ser a posição ao lado do cofre.
- A meta só avança a fase se `projetoColetado === true`.

## Checkpoints (Fase 2)

Criados por `criarCheckpoints(cena, fase.checkpoints)`. Ao tocar:
- O índice do checkpoint é salvo (`indiceCheckpointAtual`); não pode retroceder.
- O marcador muda de amarelo para verde.
- `ultimoCheckpoint` é atualizado com a posição do checkpoint no chão.
- "Progresso salvo" aparece por 1,5 s sem pausar o jogo.

## Coletáveis, NPC e lição

### Coletáveis

- Tipos aceitos: `duvida` e `cracha`.
- As imagens embutidas têm 32×32 px; no jogo, dúvidas são exibidas em 40×40 e crachás em 40×48 para destacar melhor os itens.
- Cada item tem um halo pulsante amarelo (dúvida) ou azul (crachá). Ao coletar, o item e o halo desaparecem.
- Uma dúvida mostra a próxima dica por 3 segundos sem pausar o jogo.

### NPC

- `npc` define a posição do centro. O sprite da mentora (Fase 1) é exibido a 72×112 px e fica apoiado no chão. O NPC de TI (Fase 2) é exibido a 32×32 px.
- A conversa abre a menos de 80 px. Cada NPC só inicia sua conversa uma vez por visita à fase.
- A caixa de diálogo aparece no rodapé. Fase 1: `Espaço` ou `Enter` avança. Fase 2: somente `Enter` avança.
- Física, relógio e tweens ficam pausados até terminar.
- As chaves `npc_mentora_1` e `_2` existem. `_2` reutiliza `_1` até ser fornecida uma segunda pose; atualmente a mentora não alterna quadros.

### Lição da fase

Ao tocar a meta, `concluirFase()` congela a física e mostra um fundo escuro e um painel central com o título, itens e instrução de Enter. Enter avança para a fase seguinte. Depois da última, o texto muda para `Fim de jogo`.

## Artes, texturas e efeitos

### `assets.js` — Fase 1

As imagens são PNG em data URI; o jogo não depende de arquivos de imagem externos. `window.GAME_ASSETS` relaciona as chaves de Phaser às constantes usadas em `preload()`:

| Chave de textura | Conteúdo | Tamanho-base |
|---|---|---:|
| `fundo_fase1` | Fundo do estúdio | 800×450 |
| `tile_chao` | Textura do chão | 32×32 |
| `tile_plataforma` | Textura de plataforma | 32×32 |
| `item_duvida` | Dúvida | 32×32 |
| `item_cracha` | Crachá | 32×32 |
| `inimigo_confusao_1`, `_2` | Criatura Confusão | 32×32 cada; `_2` reutiliza `_1` |
| `npc_mentora_1`, `_2` | Marina | 32×32 cada; `_2` reutiliza `_1` |
| `porta_meta` | Porta no fim da Fase 1 | 32×64 |
| `coracao` | Ícone de vida | 16×16 |

A arte do personagem também está embutida em `assets.js`: pose parada, segunda pose parada, oito quadros de corrida, subida e queda. As imagens estão recortadas e as artes com fundo verde foram processadas para transparência. `pixelArt: true` e `antialias: false` mantêm o desenho nítido.

### `assets_fase2.js` — Fase 2

As texturas são carregadas via `window.ASSETS_FASE2` (objeto chave→dataURI). `preload()` registra automaticamente todas as entradas desse objeto:

| Chave de textura | Conteúdo |
|---|---|
| `fundo_fase2` | Fundo corredor (parallax 0.3×) |
| `planta_plano` | Decoração de planta no fundo |
| `tile_chao_f2` | Tile do chão da Fase 2 |
| `npc_ti_1` | NPC Técnica de TI |
| `interruptor_off` | Interruptor desligado |
| `interruptor_on` | Interruptor ligado |
| `emissor_laser` | Pontas visuais dos lasers |
| `item_checkpoint` | Marcador de checkpoint |
| `porta_saida` | Porta de saída da Fase 2 |

Para adicionar texturas à Fase 2, basta acrescentar novas chaves em `window.ASSETS_FASE2`; não é necessário alterar `preload()`.

### Efeitos da Fase 1

- O fundo é um `tileSprite` que usa `scrollFactor` X de 0.3 para criar parallax. Se `fundo_fase1` não estiver disponível, `game.js` gera uma textura sólida provisória por código.
- Um overlay escuro tem alpha base 0.14. Em intervalos aleatórios de 900–3600 ms, pisca por 90–240 ms; aproximadamente uma em cada cinco piscadas é mais forte.
- Uma faixa vermelha semitransparente no rodapé move-se horizontalmente em tween suave.
- Chão e plataforma são decorados com `tileSprite`; o chão físico continua sendo um retângulo Arcade estático e as plataformas continuam em um grupo estático.

## Fluxo principal em `game.js`

1. `preload()` registra as data URIs no carregador Phaser; inclui todas as chaves de `window.ASSETS_FASE2` automaticamente.
2. `create()` lê `LEVELS[indiceFaseAtual]`, limpa estados temporários e cria o cenário, corpo do jogador, plataformas, chão, fundo, meta, NPC, inimigos, coletáveis, lasers, interruptores, cofre, checkpoints e HUD.
3. `update(time, delta)` trata primeiro Game Over, painel de lição e diálogo; depois atualiza proximidade do NPC, interruptores, fuga, invencibilidade, patrulhas de inimigos, lasers móveis, colisão da meta, controles, animações do personagem e pulo.
4. Colisões de chão/plataforma usam Arcade Physics. Sobreposições detectam meta, inimigos, lasers, interruptores, cofre, checkpoints e coletáveis.
5. A meta chama `concluirFase()`. A conclusão só avança com Enter. Na Fase 2, sem o projeto, a meta exibe aviso temporário.

## Como fazer alterações comuns

### Adicionar ou mover uma plataforma

Edite `plataformas` na fase desejada em `levels.js`. `x` e `y` são o canto superior esquerdo. O corpo físico é criado automaticamente. Para permitir passagem por baixo, confira a folga até a parte inferior da plataforma, considerando que a hitbox do jogador tem cerca de 101 px de altura.

### Adicionar coletável

Adicione `{ tipo: "duvida" ou "cracha", x, y }` à lista `coletaveis`. O HUD calcula automaticamente o total de dúvidas da fase. Para dúvidas, também coloque uma nova frase em `window.DIALOGS` se quiser ampliar a sequência.

### Adicionar laser

Acrescente um objeto em `lasers` dentro da fase em `levels.js`. Cada laser precisa de um `id` único dentro da fase. Para um laser intermitente mínimo:

```js
{ id: "meu_laser", tipo: "intermitente", x: 1200, y: 348, largura: 90, altura: 12,
  atraso: 0, tempoLigado: 900, ciclo: 3000 }
```

Para conectar a um interruptor, adicione o `id` ao array `desliga` do interruptor correspondente.

### Adicionar checkpoint

Adicione `{ x, y }` ao array `checkpoints` da fase. O `y` deve apontar para o centro do marcador (geralmente `378` para ficar sobre o chão). O mecanismo de respawn usará automaticamente o checkpoint mais recente tocado.

### Adicionar falas ou lição

Use `window.NPC_DIALOGS[idDaFase]` em `dialogs.js` para falas de NPC e `licao: { titulo, itens }` em `levels.js` para a tela final.

### Adicionar uma imagem à Fase 1

1. Prepare um PNG com transparência e dimensões adequadas.
2. Codifique-o como data URI e declare a constante correspondente em `assets.js`.
3. Registre a imagem em `preload()` com uma chave estável.
4. Troque apenas a criação visual do placeholder em `game.js`; preserve posição, corpo físico, prioridade de desenho e eventos de sobreposição.

### Adicionar uma imagem à Fase 2

1. Codifique o PNG como data URI.
2. Acrescente a chave e o data URI em `window.ASSETS_FASE2` dentro de `assets_fase2.js`.
3. Use a chave normalmente em `game.js` com `cena.textures.exists("minha_chave")` para decidir entre a textura e o placeholder.
4. `preload()` registra automaticamente todas as chaves de `window.ASSETS_FASE2`; nenhuma alteração em `preload()` é necessária.

### Adicionar Fase 3

1. Acrescente um objeto com `id: 3` em `window.LEVELS` em `levels.js`.
2. Adicione falas em `window.NPC_DIALOGS[3]` em `dialogs.js` (se houver NPC).
3. Se precisar de assets exclusivos, crie `assets_fase3.js` seguindo o padrão de `assets_fase2.js` (`window.ASSETS_FASE3`) e registre-o em `preload()` (ou adapte o loop que já itera `window.ASSETS_FASE2`).
4. Carregue o novo arquivo de assets no `index.html`, **antes** de `levels.js`.

## Cuidados para manutenção

- A ordem dos scripts em `index.html` é obrigatória: `phaser.min.js`, `assets.js`, `assets_fase2.js`, `levels.js`, `dialogs.js`, `game.js`.
- Não declare de novo um `const` global já declarado em `assets.js`; scripts clássicos compartilham o escopo léxico global.
- Preserve os nomes de textura usados por `preload()` e por `setTexture()`.
- Ao mudar escala de uma arte, alinhe os pés e atualize `body.setSize()`/`body.setOffset()` quando a hitbox precisar acompanhar.
- As mensagens e painéis usam `setScrollFactor(0)` para ficarem fixos na tela enquanto a câmera anda.
- Não remova `perderVida()`: quedas, colisões de inimigos, lasers e expiração da fuga compartilham essa rotina.
- Se aparecer a tela azul sem elementos, confira primeiro erros de carregamento no navegador, a presença de todos os arquivos JS e a ordem de `<script>` em `index.html`.
- Salve arquivos de texto em UTF-8. O jogo pode ser aberto diretamente pelo `index.html`; não precisa de servidor.
