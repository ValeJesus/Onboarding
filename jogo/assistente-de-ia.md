# Guia do projeto — jogo de plataforma

Este documento descreve a versão atual do jogo para que outra pessoa ou IA possa entendê-lo e alterá-lo sem depender do histórico da conversa. Leia-o junto com `game.js`, `levels.js`, `dialogs.js`, `assets.js`, `assets_fase1_novos.js`, `assets_fase2.js`, `assets_npc_dialogo.js` e `index.html`.

## Visão geral

Jogo de plataforma 2D feito com **Phaser 3.90.0** e **Arcade Physics**. A experiência acompanha um estagiário no primeiro dia em um estúdio de streaming e segue a jornada **reconhecer → planejar → executar → entregar**. A Fase 1, **Observar**, tem inspiração narrativa em Lupin: o estagiário observa rotinas e relações do time, recebe de Marina um guia e coleta pistas sobre como o estúdio funciona. A atmosfera atual usa luz âmbar, bordô e dourado; as Distrações representam a confusão do primeiro dia. A Fase 2, **Executar**, é uma missão de infiltração com lasers, interruptor, cofre, sentinelas robóticas e contagem regressiva. O projeto no cofre pertence ao próprio time e precisa ser recuperado para a entrega no prazo. A Fase 3, **Quiz**, verifica os aprendizados das duas fases com perguntas de múltipla escolha sobre observação, comunicação, planejamento, colaboração e segurança.

A entrada atual do jogo é **`index.html`**. O projeto está dividido em arquivos JavaScript, mas pode ser aberto diretamente no navegador sem servidor:

1. `index.html` tenta carregar `phaser.min.js` da mesma pasta.
2. Se a cópia local falhar, tenta Phaser 3.90.0 por jsDelivr e depois cdnjs.
3. Carrega `efeitos-audio.js` e depois, em sequência, `assets.js`, `assets_fase1_novos.js`, `assets_fase2.js`, `assets_npc_dialogo.js`, `levels.js`, `dialogs.js` e `game.js`.
4. `game.js` exibe as telas de início e seleção de **Estagiário Bros**. Depois de clicar em `Jogar`, o jogador escolhe `Observar`, `Executar` ou `Quiz`; então o Phaser inicia na fase escolhida. A tela do Quiz é HTML sobreposta ao canvas para manter os controles de resposta acessíveis.

A cópia local do Phaser permite abrir o jogo sem internet. Se ela não estiver disponível, o navegador precisa de conexão para usar as CDNs. O canvas se ajusta à janela preservando a proporção 16:9 e a nitidez da pixel art. `jogo-plataforma.html` e `jogo-luz-vermelha-teste.html` são protótipos anteriores; **não são a entrada desta versão**.

## Arquivos e responsabilidades

| Arquivo | Responsabilidade |
|---|---|
| `index.html` | Página de entrada, dimensões da página, ordem de carregamento e fallback do Phaser. |
| `phaser.min.js` | Biblioteca Phaser 3 local. |
| `assets.js` | Sprites e texturas base em data URI. Define constantes globais e `window.GAME_ASSETS`. |
| `assets_fase1_novos.js` | Imagens enviadas para a Fase 1 em data URI, compatíveis com abertura direta pelo navegador. |
| `assets/` | Cenário sem mesas e folhas de quadros dos inimigos aprovados para a Fase 1. Prateleiras e caixas são desenhadas no jogo. |
| `assets_fase2.js` | Sprites e texturas exclusivos da Fase 2 em data URI, dentro de `window.ASSETS_FASE2`. |
| `assets_npc_dialogo.js` | Retratos grandes da mentora e do técnico de TI, com fundo verde removido e armazenados em data URI. |
| `levels.js` | Dados das fases: largura, plataformas, inimigos, coletáveis, lasers, checkpoints, interruptores, cofre, NPC, lição e meta. |
| `dialogs.js` | Lista de dicas (`window.DIALOGS`) e falas de NPC separadas pelo ID da fase (`window.NPC_DIALOGS`). |
| `efeitos-audio.js` | Efeitos sonoros originais sintetizados com Web Audio e controle de silêncio. |
| `game.js` | Física, câmera, animações, carregamento de fase, HUD, colisões, diálogos, lasers, interruptores, cofre, fuga, checkpoints e efeitos visuais. |
| `assistente-de-ia.md` | Este guia de manutenção. |

## Controles

- **Andar:** setas esquerda/direita ou `A`/`D`.
- **Pular:** `Espaço` ou seta para cima. Segurar o botão por até 240 ms pode aumentar a altura do salto.
- **Som:** `M` alterna os efeitos sonoros.
- **Menu inicial:** clique em `Jogar` e escolha `Observar`, `Executar` ou `Quiz` para selecionar a fase de início.
- **Interruptor (Fase 2):** `E` quando estiver a menos de 80 px e o prompt `[E] Ativar` aparecer.
- **Diálogo da mentora (Fase 1):** `Espaço` ou `Enter` avança cada fala.
- **Diálogo da TI (Fase 2):** somente `Enter` avança cada fala.
- **Lição da fase:** `Enter` fecha a lição e avança para a próxima fase.
- **Quiz (Fase 3):** escolha uma resposta com o mouse; depois da última pergunta, é possível refazer o quiz ou voltar ao menu.
- **Game Over:** `Enter` reinicia a fase atual com três vidas.

Na Fase 1, o jogador começa a menos de 80 px da Marina, então a primeira conversa abre logo no início. A conversa pausa a física, o relógio e as animações; os controles de diálogo continuam ativos.

O menu em pixel art é construído em `jogo/index.html` e preenchido por `prepararMenuInicio()` em `game.js`, usando os nomes definidos em `levels.js`. A escolha inicial define `indiceFaseAtual`; concluir uma fase segue para a próxima normalmente, então a Fase 2 avança ao Quiz.

## Configurações principais (`game.js`)

Os valores ajustáveis estão no topo de `game.js`. Distâncias e velocidades estão em pixels e pixels por segundo; tempos estão em milissegundos.

| Constante | Valor atual | Uso |
|---|---:|---|
| `LARGURA_TELA`, `ALTURA_TELA` | 800 × 450 | Tamanho da área visível do jogo. |
| `ALTURA_FASE` | 1200 | Limite inferior do mundo; o topo fica em `y=-1.000.000` para permitir subidas longas. |
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
| `CAMERA_ANTECIPACAO_MAXIMA` | 72 | Avanço fixo horizontal da câmera para a direita em relação ao personagem. |
| `CAMERA_LIMITE_VERTICAL` | 30 | Margem inferior das bordas da câmera; ela permanece fixa no eixo vertical. |
| `ALTURA_SPRITE_JOGADOR` | 80 | Altura-base do personagem; a câmera da Fase 1 usa zoom 0,9. |
| `VIDAS_INICIAIS` | 3 | Vidas ao iniciar e ao reiniciar após Game Over. |
| `TEMPO_FUGA` | 15000 | Tempo em ms para fugir após pegar o projeto (Fase 2). |
| `DURACAO_INVENCIBILIDADE_MS` | 1000 | Proteção depois de receber dano. |
| `INTERVALO_PISCAR_INVENCIBILIDADE_MS` | 100 | Intervalo do pisca após dano. |
| `VELOCIDADE_INIMIGO` | 60 | Velocidade horizontal das patrulhas. |
| `INTERVALO_ANIMACAO_INIMIGO` | 250 | Intervalo previsto entre quadros dos inimigos. |
| `TAMANHO_INIMIGO_TELA` | 48 | Dimensão da hitbox; a arte aparece em 58×62 px. |
| `LARGURA_NPC_TELA`, `ALTURA_NPC_TELA` | 60 × 92 | Tamanho visual da mentora na Fase 1. |
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
  corFundo: "#1a1a2e",          // cor de fundo da câmera (opcional; Fase 1 usa '#111225')
  plataformas: [{ x, y, largura, altura }],
  obstaculos: [{ x, largura, altura }], // opcional; estantes que pedem salto
  escadas: [{ x, caixasPorDegrau: [1, 2, 3, 4], larguraCaixa, alturaCaixa, gaps }],
  inimigos: [{ tipo: "confusao", x, y, alcance, arte }], // arte opcional; Fase 2 aceita "drone" ou "robo"
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

- Plataforma: `x` e `y` são o canto superior esquerdo; `largura` e `altura` são dimensões. A colisão é sólida em todos os lados. Na Fase 1, todas ficam altas o bastante para o personagem passar por baixo caminhando.
- Inimigo: `x`,`y` são o centro inicial; `alcance` é a largura total da patrulha, com limites `x ± alcance/2`.
- Laser: `x`,`y` são o centro do retângulo; `largura`/`altura` são dimensões.
- Checkpoint, coletável, NPC, cofre e meta: `x`,`y` indicam o centro.
- A superfície do chão está em `y = ALTURA_CHAO` (390). O retângulo físico do chão fica abaixo dessa linha.

### Conteúdo atual

**Fase 1 — "Observar" / reconhecimento**

- Largura de mundo: 6000 px. A progressão segue a referência estrutural de 1-1: início seguro, obstáculos simples, pares mais altos, plataformas espaçadas e escadarias antes da meta. O cenário `cenario_fase1.jpg`, sem mesas, repete-se ao longo do percurso.
- 6 plataformas sólidas em `y=250`, espaçadas nos trechos de travessia. Como o personagem tem 80 px de altura e o chão está em `y=390`, há espaço para caminhar por baixo. A primeira plataforma com Distração foi deslocada para `x=1040` para ficar mais próxima do centro do percurso.
- 4 das plataformas têm uma Distração patrulhando de ponta a ponta: `x=1125`, `2055`, `2760` e `4050`. O `alcance` de cada uma foi ajustado para manter a patrulha sobre a plataforma.
- Três escadarias de caixas fechadas formam rotas opcionais. Cada uma sobe em pilhas de 1, 2, 3 e 4 caixas, com pequenos vãos entre algumas pilhas; as caixas têm colisão e seus topos podem ser usados como degraus.
- 11 estantes de livros (`obstaculos`) destacadas do cenário, com colisão sólida e alturas variadas para saltar.
- 8 inimigos `confusao` (as Distrações), 5 pistas (coletáveis internamente como `duvida`), 7 acessos (internamente `cracha`), Marina no início e meta em `x=5900`. As pistas estão no chão, sobre estantes ou sobre uma pilha de caixas.
- Sem lasers, interruptores, cofre ou checkpoints.
- Fundo, luzes e névoa âmbar especiais são ativados quando `fase.id === 1`.
- Falas atuais de Marina (`NPC_DIALOGS[1]`):
  1. “Oi! Eu sou a Marina, sua mentora. Bem-vindo ao estúdio!”
  2. “Ninguém vira parte do time no primeiro dia. Quem observa antes de agir chega mais longe.”
  3. “Leve este guia e colete as pistas pelo prédio: elas mostram como o time trabalha. Cuidado com as Distrações!”
- Pistas atuais (`window.DIALOGS`):
  1. “Observe como as pessoas se comunicam antes de escrever a primeira mensagem.”
  2. “Cada pessoa do time sabe algo que você ainda não sabe. Descubra quem sabe o quê.”
  3. “Perguntar é uma forma de pesquisar, e quem pesquisa erra menos.”
  4. “Anote o que aprender: o que você observa hoje vira o seu plano amanhã.”
  5. “Errar no começo é esperado. Esconder o erro é o que pesa.”
- HUD: `Pistas: coletadas/total` e `Acessos: total`.
- Lição: "Reconhecimento concluído!" com 4 ensinamentos: observar antes de agir, aprender com quem já sabe, perguntar e anotar, e não esconder erros.

**Fase 2 — "Executar"**

- Largura: 5000 px. Cor de fundo `#1a1a2e` (azul escuro). O cenário original da Fase 2 é um corredor técnico corporativo noturno: painéis de vidro, armários de segurança e luzes de status em ciano e âmbar. O fundo repete horizontalmente com parallax (0.3×), e as plataformas são passarelas metálicas com faixas de segurança e suportes; a colisão continua na mesma posição.
- 3 salas lógicas: Sala 1 (0–1600), Sala 2 (1600–3200), Sala 3 (3200–5000).
- 6 plataformas sólidas em `y=250`, distribuídas pelas 3 salas. O visual de corredor e seus efeitos permanecem próprios da Fase 2.
- 4 sentinelas de segurança patrulham plataformas: dois drones de observação e dois robôs de patrulha. A colisão e a regra de saltar sobre eles continuam iguais às Distrações da Fase 1.
- **2 checkpoints**: início da Sala 2 (`x=1616`) e Sala 3 (`x=3216`).
- **4 barreiras verticais intermitentes** formam dois pares alternados: na Sala 1 (`x=800` e `x=1000`) e na Sala 2 (`x=2570` e `x=2670`). Cada feixe fica ativo por 2 s dentro de um ciclo de 6 s, com 1 s de intervalo entre as janelas de cada par.
- **5 lasers intermitentes** na Sala 2 (onda sincronizada, ciclo de 5,2 s).
- **1 laser móvel vertical** e **1 horizontal** na Sala 2.
- **3 lasers intermitentes** no início da Sala 3.
- **1 laser móvel rápido** (velocidade 120) na Sala 3.
- **4 lasers fixos** formando um corredor bloqueado antes do cofre.
- **1 interruptor** (`x=3740`) que desliga os 4 lasers fixos por 6 s, com aviso piscante 1,5 s antes de religarem.
- NPC de TI em `x=3670`, junto ao interruptor; 3 falas instruindo a usar o interruptor.
- **Cofre** em `x=4000`, sobre um pedestal técnico; ao tocar, abre visualmente e revela uma pasta do projeto. A coleta inicia 15 s de fuga com overlay vermelho e HUD de contagem.
- Durante a fuga, há dois racks técnicos que precisam ser saltados e uma escadaria de cases de equipamento em degraus, com um vão maior no meio. Esses obstáculos originais da Fase 2 ficam entre o cofre e a saída.
- Meta em `x=4900`. Sem o projeto, a meta exibe aviso e não permite avançar.
- Lição final “Execução concluída!”: observar lasers para planejar antes de agir; acionar a colega de TI para pedir ajuda e comunicar; usar checkpoint, cofre e fuga para retomar erros e entregar no prazo.
- Respawn após dano sempre no checkpoint mais recente; fuga reinicia com 15 s a cada respawn no cofre.

## Textos (`dialogs.js` e `levels.js`)

- `window.DIALOGS` contém as cinco pistas da Fase 1, apresentadas em ordem e em ciclo se houver mais coletas do que textos.
- `window.NPC_DIALOGS` associa listas de falas ao `id` da fase.
- `licao.titulo` e `licao.itens` ficam dentro do objeto da fase. O painel só aparece ao tocar na meta.
- Na Fase 1, o HUD rotula os contadores como `Pistas` (`coletadas/total da fase`) e `Acessos` (total). Nas demais fases, mantém `Dúvidas` e `Crachás`.

## Física e movimento do personagem

- O jogador é uma imagem com corpo Arcade, e não um sprite animado pelo sistema de animações do Phaser. `update()` seleciona manualmente a textura correta.
- Horizontalmente, acelera enquanto uma direção está pressionada e desacelera com arrasto quando solta.
- O pulo inicia com `-FORCA_PULO`. O coyote time e o jump buffer guardam comandos por janelas curtas. Segurar o botão reduz temporariamente a gravidade na subida; a gravidade extra acelera a descida.
- A câmera mantém um avanço fixo de 72 px para a direita, independentemente da direção ou velocidade do jogador. Ela fica travada no eixo vertical para que cenário e chão não subam nem desçam durante os pulos. Na Fase 1 usa zoom 0,9; o limite superior do mundo fica em `y=-1.000.000`, para não funcionar como teto em saltos normais.
- Os quadros do personagem têm proporções diferentes. `aplicarPoseParado()`, `aplicarPoseCorrida()` e `aplicarPoseNoAr()` atualizam textura, tamanho, caixa Arcade e deslocamento da hitbox. As poses mantêm a base dos pés alinhada.
- O corpo de colisão do personagem é mais estreito do que braços e pernas da arte, para evitar que a silhueta estendida cause colisões injustas.
- Ao cair abaixo de `ALTURA_CHAO + 220`, `perderVida()` retira uma vida e, se ainda houver vidas, reposiciona o jogador no checkpoint mais recente (Fase 2) ou no início (Fase 1).

## Vidas e inimigos

### Vidas

O HUD usa até três imagens `coracao`, fixas à câmera (`scrollFactor 0`). `perderVida(cena, direcaoEmpurrao, reiniciarNoInicio)` é a função reutilizável para dano. Ela respeita a invencibilidade, atualiza os corações e, ao zerar as vidas, exibe Game Over. `Enter` reinicia a fase atual com três vidas.

### Inimigos `confusao`

- Um retângulo vermelho 48×48 é o fallback caso as texturas não estejam carregadas; com os assets atuais, a arte aparece em 58×62 e a hitbox mede 48×48.
- A patrulha inverte a direção nos limites definidos por `x` e `alcance`, a 60 px/s; o sprite é espelhado para olhar na direção em que anda.
- Ao cair sobre o inimigo com velocidade vertical positiva e vindo de cima, ele some e o jogador recebe um quique pequeno.
- Ao tocar de lado, o inimigo chama `perderVida()`, aplica empurrão e inicia um segundo de invencibilidade com o jogador piscando.
- O código alterna quatro quadros a cada 250 ms. As Distrações alternam entre as variantes de papéis e cartões; a imagem é espelhada ao inverter o sentido da patrulha.
- Na Fase 2, as mesmas regras de movimento e colisão usam dois visuais próprios: drones de observação e robôs de patrulha. Eles também alternam quatro quadros e espelham a arte quando mudam de direção.

## Lasers, interruptores e cofre (Fase 2)

### Lasers

Criados pela função `criarLasers(cena, fase.lasers)`. Tipos suportados:

- **`intermitente`**: apagado por padrão; acende conforme `atraso` e permanece por `tempoLigado` ms a cada `ciclo` ms. A hitbox é desativada quando apagado.
- **`movel`**: se move continuamente entre `posicao ± alcance/2` no eixo `x` ou `y` à `velocidade` px/s.
- **`fixo`**: sempre ligado até que um interruptor o desligue.

Lasers intermitentes podem ser verticais ou horizontais: `largura` e `altura` determinam o sentido visual. Os dois pares de portões verticais usam atrasos diferentes para alternar as janelas e exigir que o jogador observe o ritmo antes de atravessar.

Cada laser mantém uma hitbox invisível, separada da arte e estreita (até 6 px de espessura) para acompanhar melhor o feixe visível. O feixe é fino, com halo magenta discreto e um brilho móvel que percorre a barreira. Emissores compactos de aço grafite ficam nas duas extremidades e acompanham os lasers móveis. Ao apagar ou durante o intervalo intermitente, feixe e brilho somem e a hitbox é desativada.

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
- Uma pista (`duvida`) mostra o texto associado ao item ou, se ele não tiver um texto próprio, o próximo texto de `window.DIALOGS` por 4,5 segundos sem pausar o jogo.

### NPC

- `npc` define a posição do centro. O sprite da mentora (Fase 1) é exibido a 60×92 px e fica apoiado no chão. O técnico de TI (Fase 2) é exibido a 56×76 px e tem os pés alinhados com a superfície do chão.
- A conversa abre a menos de 80 px. Cada NPC só inicia sua conversa uma vez por visita à fase.
- A caixa de diálogo aparece no rodapé à esquerda, enquanto o retrato ampliado do NPC surge parcialmente fora da borda direita. Os retratos usam `npc_mentora_dialogo` e `npc_ti_dialogo` de `assets_npc_dialogo.js`; as artes originais ficam menores no cenário. Fase 1: `Espaço` ou `Enter` avança. Fase 2: somente `Enter` avança.
- Física, relógio e tweens ficam pausados até terminar.
- As chaves `npc_mentora_1` e `_2` existem. `_2` reutiliza `_1` até ser fornecida uma segunda pose; atualmente a mentora não alterna quadros.

### Lição da fase

Ao tocar a meta, `concluirFase()` congela a física e mostra um fundo escuro e um painel central com o título, itens e instrução de Enter. Enter avança para a fase seguinte. Depois da última, o texto muda para `Fim de jogo`.

## Artes, texturas e efeitos

### Efeitos sonoros

- `efeitos-audio.js` sintetiza sons originais curtos para pulo, coleta de pista/acesso, dispersão de Distração, dano, checkpoint, interruptor, projeto e conclusão.
- Os sons usam Web Audio, sem dependência de arquivos externos; `M` alterna o silêncio.
- Os áudios do projeto FullScreenMario não são reutilizados: o repositório lista sons associados a Mario, mas a licença MIT consultada não esclarece a licença desses arquivos de áudio.

### `assets.js` — texturas base

As imagens são PNG em data URI; o jogo não depende de arquivos de imagem externos. `window.GAME_ASSETS` relaciona as chaves de Phaser às constantes usadas em `preload()`:

| Chave de textura | Conteúdo | Tamanho-base |
|---|---|---:|
| `fundo_fase1` | Fundo antigo usado como fallback | 800×450 |
| `tile_chao` | Textura do chão | 32×32 |
| `tile_plataforma` | Textura de plataforma | 32×32 |
| `item_duvida` | Dúvida | 32×32 |
| `item_cracha` | Crachá | 32×32 |
| `inimigo_confusao_1`, `_2` | Criatura Confusão | 32×32 cada; `_2` reutiliza `_1` |
| `npc_mentora_1`, `_2` | Marina | 32×32 cada; `_2` reutiliza `_1` |
| `porta_meta` | Porta no fim da Fase 1 | 32×64 |
| `coracao` | Ícone de vida | 16×16 |

A arte do personagem também está embutida em `assets.js`: pose parada, segunda pose parada, oito quadros de corrida, subida e queda. `pixelArt: true` e `antialias: false` mantêm o desenho nítido.

### `assets/` — arte aprovada da Fase 1

Os originais ficam nesta pasta; `assets_fase1_novos.js` contém cópias embutidas em data URI para o navegador carregar as imagens mesmo quando `index.html` é aberto por `file://`.

| Arquivo | Uso |
|---|---|
| `cenario_fase1.jpg` | Cenário de arquivo sem mesas, repetido em painéis de 800×450 ao longo da Fase 1; carregado na chave `fundo_fase1_biblioteca`. |
| `prateleira_plataforma.png` | Arte usada somente nas prateleiras definidas em `plataformas`; cada uma tem corpo de colisão. |
| `inimigo_distacao_0.png` a `_3.png` | Animação da Distração de papéis. |
| `inimigo_cartoes_0.png` a `_3.png` | Animação alternativa da criatura de cartões. |

As quatro Distrações alternam entre as duas variantes. As folhas foram separadas em quadros individuais e o verde uniforme foi removido; quadros mantêm tamanho visual regular durante a animação. Os fundos não usam chroma key.

### `assets_fase2.js` — Fase 2

As texturas são carregadas via `window.ASSETS_FASE2` (objeto chave→dataURI). `preload()` registra automaticamente todas as entradas desse objeto:

| Chave de textura | Conteúdo |
|---|---|
| `fundo_fase2` | Fundo corredor (parallax 0.3×) |
| `plataforma_execucao` | Passarela metálica com faixa de segurança; usada como arte sobre a colisão da plataforma |
| `rack_seguranca_f2` | Rack técnico usado nos obstáculos após a coleta do projeto |
| `case_equipamento_f2` | Case metálico usado nas escadas do trecho de fuga |
| `suporte_projeto` | Pedestal técnico sob o cofre |
| `cofre_projeto`, `cofre_projeto_aberto` | Cofre fechado e aberto |
| `projeto_recuperado` | Pasta visual do projeto do time |
| `inimigo_drone_f2_0` a `_3` | Quadros animados do drone de observação |
| `inimigo_robo_f2_0` a `_3` | Quadros animados do robô de patrulha |
| `tile_chao_f2` | Tile do chão da Fase 2 |
| `npc_ti_1` | NPC Técnica de TI |
| `interruptor_off` | Interruptor desligado |
| `interruptor_on` | Interruptor ligado |
| `emissor_laser` | Emissor compacto de aço nas pontas visuais dos lasers |
| `item_checkpoint` | Marcador de checkpoint |
| `porta_saida` | Porta de saída da Fase 2 |

O fundo, as passarelas, os emissores, o cofre, o pedestal e a pasta do projeto são SVGs originais embutidos no mesmo arquivo. Racks e cases de equipamento são desenhados em pixel art pelo `game.js`. As plataformas continuam com colisão sólida em `levels.js`; o tile genérico fica invisível apenas na Fase 2 para mostrar a passarela ilustrada.

Para adicionar texturas à Fase 2, basta acrescentar novas chaves em `window.ASSETS_FASE2`; não é necessário alterar `preload()`.

### Efeitos da Fase 1

- `cenario_fase1.jpg` é desenhado em painéis de 800×450 ao longo do percurso, com `scrollFactor` horizontal 1 e vertical 0. Se a imagem nova não carregar, `game.js` usa o fundo antigo `fundo_fase1` ou um preenchimento provisório.
- A câmera usa fundo `#111225` na Fase 1 para evitar que uma borda sem imagem apareça azul.
- Um overlay de iluminação escuro cobre o viewport todo, compensando o zoom 0,9 da câmera. Em intervalos aleatórios de 900–3600 ms, pulsa por 90–240 ms com intensidade sutil; aproximadamente uma em cada cinco pulsações é um pouco mais forte.
- Uma névoa âmbar muito sutil (`0xc8873a`) cobre a tela inteira como overlay fixo e compensa o zoom atual da câmera; sua intensidade pulsa lentamente para não formar uma faixa ou quadrado aparente.
- O chão usa uma textura repetida e um retângulo Arcade estático. As plataformas têm arte de estante e colisão Arcade sólida; as estantes de obstáculo e caixas das escadas também têm corpos sólidos.

## Fluxo principal em `game.js`

1. `preload()` registra as data URIs no carregador Phaser; inclui todas as chaves de `window.ASSETS_FASE2` automaticamente.
2. `create()` lê `LEVELS[indiceFaseAtual]`, limpa estados temporários e cria o cenário, corpo do jogador, plataformas, chão, fundo, meta, NPC, inimigos, coletáveis, lasers, interruptores, cofre, checkpoints e HUD.
3. `update(time, delta)` trata primeiro Game Over, painel de lição e diálogo; depois atualiza proximidade do NPC, interruptores, fuga, invencibilidade, patrulhas de inimigos, lasers móveis, colisão da meta, controles, animações do personagem e pulo.
4. Colisões de chão, plataformas, estantes e caixas usam Arcade Physics; plataformas são sólidas por cima e por baixo. Sobreposições detectam meta, inimigos, lasers, interruptores, cofre, checkpoints e coletáveis.
5. A meta chama `concluirFase()`. A conclusão só avança com Enter. Na Fase 2, sem o projeto, a meta exibe aviso temporário. O Quiz é um tipo de fase separado (`tipo: "quiz"`): `create()` monta a interface HTML e `update()` não processa controles de plataforma enquanto ele está ativo.

## Como fazer alterações comuns

### Adicionar ou mover uma plataforma

Edite `plataformas` na fase desejada em `levels.js`. `x` e `y` são o canto superior esquerdo. O corpo físico é criado automaticamente e é sólido em todos os lados. Nas Fases 1 e 2, `y=250` deixa espaço para o personagem caminhar por baixo; se houver um inimigo, coloque seu centro em `y=plataforma.y-16` e ajuste `alcance` para que a hitbox permaneça entre as bordas.

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

1. Prepare o PNG ou JPG em `assets/`.
2. Acrescente-o a `assets_fase1_novos.js` como data URI, para continuar funcionando com abertura direta via `file://`.
3. `preload()` carrega as entradas de `window.ASSETS_FASE1_NOVOS` automaticamente.
4. Use a textura em `game.js` e preserve a posição, o corpo físico, a prioridade de desenho e os eventos de sobreposição.

### Adicionar uma imagem à Fase 2

1. Codifique o PNG como data URI.
2. Acrescente a chave e o data URI em `window.ASSETS_FASE2` dentro de `assets_fase2.js`.
3. Use a chave normalmente em `game.js` com `cena.textures.exists("minha_chave")` para decidir entre a textura e o placeholder.
4. `preload()` registra automaticamente todas as chaves de `window.ASSETS_FASE2`; nenhuma alteração em `preload()` é necessária.

### Editar o Quiz

As perguntas da Fase 3 ficam no objeto `id: 3`, `tipo: "quiz"` de `window.LEVELS` em `levels.js`. Cada pergunta tem `pergunta`, três `opcoes`, o índice numérico `correta` (começa em zero) e um texto `retorno` mostrado depois da resposta. `mostrarQuiz()` em `game.js` monta a interface e envia o resultado final à plataforma.

## Cuidados para manutenção

- A ordem dos scripts em `index.html` é obrigatória: `phaser.min.js`, `efeitos-audio.js`, `assets.js`, `assets_fase1_novos.js`, `assets_fase2.js`, `assets_npc_dialogo.js`, `levels.js`, `dialogs.js`, `game.js`.
- Não declare de novo um `const` global já declarado em `assets.js`; scripts clássicos compartilham o escopo léxico global.
- Preserve os nomes de textura usados por `preload()` e por `setTexture()`.
- Ao mudar escala de uma arte, alinhe os pés e atualize `body.setSize()`/`body.setOffset()` quando a hitbox precisar acompanhar.
- As mensagens e painéis usam `setScrollFactor(0)` para ficarem fixos na tela enquanto a câmera anda.
- Não remova `perderVida()`: quedas, colisões de inimigos, lasers e expiração da fuga compartilham essa rotina.
- Se aparecer a tela azul sem elementos, confira primeiro erros de carregamento no navegador, a presença de todos os arquivos JS e a ordem de `<script>` em `index.html`.
- Salve arquivos de texto em UTF-8. O jogo pode ser aberto diretamente pelo `index.html`; não precisa de servidor.
