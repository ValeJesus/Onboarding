
// Ajuste estas constantes para mudar a velocidade e a dificuldade da fase.
const LARGURA_TELA = 800;
const ALTURA_TELA = 450;
const ALTURA_FASE = 1200;
const TAMANHO_JOGADOR = 32;
const VIDAS_INICIAIS = 3;
const TEMPO_FUGA = 15000;
const TAMANHO_INIMIGO_TELA = 48;
const ALTURA_NPC_TELA = 112;
const LARGURA_NPC_TELA = 72;
const VELOCIDADE_INIMIGO = 60;
const INTERVALO_ANIMACAO_INIMIGO = 250;
const DISTANCIA_DIALOGO_NPC = 80;
const DURACAO_INVENCIBILIDADE_MS = 1000;
const INTERVALO_PISCAR_INVENCIBILIDADE_MS = 100;
const FORCA_QUIQUE_INIMIGO = 240;
const FORCA_EMPURRAO_INIMIGO = 150;
const VELOCIDADE_JOGADOR = 240;
const ACELERACAO_JOGADOR = 1500;
const DESACELERACAO_JOGADOR = 1400;
const TEMPO_PULO_VARIAVEL = 240;
const TEMPO_COYOTE_MS = 100;
const TEMPO_BUFFER_PULO_MS = 120;
const LERP_CAMERA = 0.1;
const GRAVIDADE_DURANTE_PULO = 450;
const FORCA_PULO = 430;
const GRAVIDADE = 1000;
const GRAVIDADE_EXTRA_QUEDA = 650;
const VELOCIDADE_MAXIMA_QUEDA = 650;
const ALTURA_CHAO = 390;
const ALTURA_TEXTURA_CHAO = 120;
const LARGURAS_ARTE_CORRIDA = [258, 191, 275, 249, 268, 270, 260, 265];
const ALTURAS_ARTE_CORRIDA = [423, 418, 415, 418, 413, 415, 399, 412];
const INTERVALO_ANIMACAO_CORRIDA = 120;
const FATOR_ESCALA_CORRIDA = 0.98;
const LARGURA_ARTE_SUBIDA = 615;
const ALTURA_ARTE_SUBIDA = 890;
const LARGURA_ARTE_QUEDA = 600;
const ALTURA_ARTE_QUEDA = 900;
const ALTURA_SPRITE_JOGADOR = 112;
const LARGURA_ARTE_JOGADOR = 369;
const ALTURA_ARTE_JOGADOR = 961;
const LARGURA_ARTE_PARADO_2 = 248;
const ALTURA_ARTE_PARADO_2 = 612;
const INTERVALO_ANIMACAO_PARADO = 750;
const FASES = window.LEVELS;

const config = {
  type: Phaser.AUTO,
  width: LARGURA_TELA,
  height: ALTURA_TELA,
  pixelArt: true,
  antialias: false,
  backgroundColor: '#8ed6ff',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: GRAVIDADE }, debug: false }
  },
  scene: { preload, create, update }
};

let jogoIniciado = false;

function iniciarJogo() {
  if (jogoIniciado) return;
  if (!window.Phaser) {
    document.getElementById("aviso").textContent = "Phaser não carregou. Verifique sua conexão com a internet.";
    return;
  }
  jogoIniciado = true;
  document.getElementById("aviso").remove();
  new Phaser.Game(config);
}

let jogador;
let teclas;
let plataformas;
let textoConclusao;
let iconesVidas = [];
let textoHUDItens;
let textoGameOver;
let caixaDica;
let caixaDialogoNPC;
let textoDialogoNPC;
let caixaPainelLicao;
let fundoPainelLicao;
let textoTituloLicao;
let textoItensLicao;
let metaFase;
let npcSprite;
let faseAtual;
let checkpoints = [];
let ultimoCheckpoint = null;
let indiceCheckpointAtual = -1;
let textoProgressoCheckpoint = null;
let idNotificacaoCheckpoint = 0;
let inimigos = [];
let lasers = [];
let interruptores = [];
let textoDicaInterruptor = null;
let textoHUDLasers = null;
let textoHUDProjeto = null;
let textoHUDFuga = null;
let textoAvisoProjeto = null;
let avisoProjetoNaSaida = false;
let idAvisoProjeto = 0;
let projetoColetado = false;
let fugaAtiva = false;
let fimFugaEm = 0;
let overlayAlarme = null;
let cofreAberto = false;
let coletaveis = [];
let falasNPC = [];
let indiceFalaNPC = 0;
let dialogoNPCAtivo = false;
let npcJaFalou = false;
let painelLicaoAtivo = false;
let indiceFaseAtual = 0;
let concluiu = false;
let gameOver = false;
let vidasRestantes = VIDAS_INICIAIS;
let tempoInvencibilidade = 0;
let tempoPiscarInvencibilidade = 0;
let jogadorVisivelDuranteDano = true;
let duvidasColetadas = 0;
let crachasColetados = 0;
let totalDuvidasFase = 0;
let indiceDicaAtual = 0;
let idDicaAtual = 0;
let tempoPuloSegurado = 0;
let tempoCoyoteRestante = 0;
let tempoBufferPuloRestante = 0;
let tempoAnimacaoParado = 0;
let quadroParadoDois = false;
let poseCorridaAtiva = false;
let tempoAnimacaoCorrida = 0;
let quadroCorridaAtual = 0;
let poseNoArAtual = "";

function preload() {
  // A arte do jogo fica embutida nos arquivos JavaScript de assets.
  this.load.image("spriteJogador", SPRITE_JOGADOR);
  this.load.image("spriteJogadorParado2", SPRITE_JOGADOR_PARADO_2);
  this.load.image("tile_chao", TEXTURA_TILE_CHAO);
  this.load.image("tile_plataforma", TEXTURA_TILE_PLATAFORMA);
  this.load.image("coracao", SPRITE_CORACAO);
  this.load.image("porta_meta", SPRITE_PORTA_META);
  this.load.image("npc_mentora_1", SPRITE_NPC_MENTORA_1);
  this.load.image("npc_mentora_2", SPRITE_NPC_MENTORA_2);
  SPRITES_CORRIDA.forEach((imagem, indice) => this.load.image("spriteCorrida" + indice, imagem));
  this.load.image("spriteSubida", SPRITE_SUBIDA);
  this.load.image("spriteQueda", SPRITE_QUEDA);
  // As imagens dos inimigos são opcionais até que os sprites sejam adicionados.
  if (typeof SPRITE_INIMIGO_CONFUSAO_1 !== "undefined") {
    this.load.image("inimigo_confusao_1", SPRITE_INIMIGO_CONFUSAO_1);
  }
  if (typeof SPRITE_INIMIGO_CONFUSAO_2 !== "undefined") {
    this.load.image("inimigo_confusao_2", SPRITE_INIMIGO_CONFUSAO_2);
  }
  // As texturas dos itens são opcionais; sem elas, usamos formas coloridas.
  if (typeof SPRITE_ITEM_DUVIDA !== "undefined") {
    this.load.image("item_duvida", SPRITE_ITEM_DUVIDA);
  }
  if (typeof SPRITE_ITEM_CRACHA !== "undefined") {
    this.load.image("item_cracha", SPRITE_ITEM_CRACHA);
  }
  if (typeof TEXTURA_FUNDO_FASE1 !== "undefined") {
    this.load.image("fundo_fase1", TEXTURA_FUNDO_FASE1);
  }
  // Registra as texturas opcionais da Fase 2 sem alterar as imagens da Fase 1.
  if (window.ASSETS_FASE2) {
    for (const [chave, dataUri] of Object.entries(window.ASSETS_FASE2)) {
      this.load.image(chave, dataUri);
    }
  }
}
function aplicarPoseParado(segundoQuadro) {
  const larguraArte = segundoQuadro ? LARGURA_ARTE_PARADO_2 : LARGURA_ARTE_JOGADOR;
  const alturaArte = segundoQuadro ? ALTURA_ARTE_PARADO_2 : ALTURA_ARTE_JOGADOR;
  const textura = segundoQuadro ? "spriteJogadorParado2" : "spriteJogador";
  const larguraNaTela = ALTURA_SPRITE_JOGADOR * LARGURA_ARTE_JOGADOR / ALTURA_ARTE_JOGADOR;
  // Mantém os pés no mesmo lugar ao trocar o tamanho da pose.
  const peNaTela = jogador.y + jogador.displayHeight / 2;
  const fatorTamanho = segundoQuadro ? 1.015 : 1;
  jogador.setTexture(textura).setDisplaySize(larguraNaTela * fatorTamanho, ALTURA_SPRITE_JOGADOR * fatorTamanho);
  jogador.y = peNaTela - jogador.displayHeight / 2;
  // Mantém a mesma caixa de colisão e o alinhamento dos pés nas duas poses.
  jogador.body.setSize(larguraArte * 0.70, alturaArte * 0.90, false);
  jogador.body.setOffset(larguraArte * 0.15, alturaArte * 0.10);
}
function aplicarPoseCorrida(indice) {
  const larguraArte = LARGURAS_ARTE_CORRIDA[indice];
  const alturaArte = ALTURAS_ARTE_CORRIDA[indice];
  const escala = ALTURA_SPRITE_JOGADOR * FATOR_ESCALA_CORRIDA / alturaArte;
  const larguraNaTela = larguraArte * escala;
  const peNaTela = jogador.y + jogador.displayHeight / 2;
  jogador.setTexture("spriteCorrida" + indice).setDisplaySize(larguraNaTela, ALTURA_SPRITE_JOGADOR * FATOR_ESCALA_CORRIDA);
  jogador.y = peNaTela - jogador.displayHeight / 2;
  const larguraCorpo = 30 / escala;
  const alturaCorpo = 100 / escala;
  jogador.body.setSize(larguraCorpo, alturaCorpo, false);
  jogador.body.setOffset((larguraArte - larguraCorpo) / 2, alturaArte - alturaCorpo);
}
function aplicarPoseNoAr(tipo) {
  const subindo = tipo === "subida";
  const larguraArte = subindo ? LARGURA_ARTE_SUBIDA : LARGURA_ARTE_QUEDA;
  const alturaArte = subindo ? ALTURA_ARTE_SUBIDA : ALTURA_ARTE_QUEDA;
  const textura = subindo ? "spriteSubida" : "spriteQueda";
  const escala = ALTURA_SPRITE_JOGADOR * FATOR_ESCALA_CORRIDA / alturaArte;
  const larguraNaTela = larguraArte * escala;
  const peNaTela = jogador.y + jogador.displayHeight / 2;
  jogador.setTexture(textura).setDisplaySize(larguraNaTela, ALTURA_SPRITE_JOGADOR);
  jogador.y = peNaTela - jogador.displayHeight / 2;
  const larguraCorpo = 30 / escala;
  const alturaCorpo = 100 / escala;
  jogador.body.setSize(larguraCorpo, alturaCorpo, false);
  jogador.body.setOffset((larguraArte - larguraCorpo) / 2, alturaArte - alturaCorpo);
}
function create() {
  const cena = this;
  const fase = FASES[indiceFaseAtual];
  if (!fase) throw new Error("A fase solicitada não existe em levels.js");
  faseAtual = fase;

  // Cada fase começa com estados e animações limpos, sem alterar a física.
  concluiu = false;
  gameOver = false;
  tempoPuloSegurado = 0;
  tempoCoyoteRestante = 0;
  tempoBufferPuloRestante = 0;
  tempoInvencibilidade = 0;
  tempoPiscarInvencibilidade = 0;
  jogadorVisivelDuranteDano = true;
  npcSprite = null;
  falasNPC = [];
  indiceFalaNPC = 0;
  dialogoNPCAtivo = false;
  npcJaFalou = false;
  painelLicaoAtivo = false;
  inimigos = [];
  lasers = [];
  interruptores = [];
  textoDicaInterruptor = null;
  textoHUDLasers = null;
  textoHUDProjeto = null;
  textoHUDFuga = null;
  textoAvisoProjeto = null;
  avisoProjetoNaSaida = false;
  idAvisoProjeto++;
  projetoColetado = false;
  fugaAtiva = false;
  fimFugaEm = 0;
  overlayAlarme = null;
  cofreAberto = false;
  coletaveis = [];
  duvidasColetadas = 0;
  crachasColetados = 0;
  totalDuvidasFase = (fase.coletaveis || [])
    .filter((item) => item.tipo === "duvida").length;
  caixaDica = null;
  idDicaAtual++;
  checkpoints = [];
  ultimoCheckpoint = {
    x: 70,
    y: ALTURA_CHAO - ALTURA_SPRITE_JOGADOR / 2
  };
  indiceCheckpointAtual = -1;
  textoProgressoCheckpoint = null;
  idNotificacaoCheckpoint++;
  tempoAnimacaoParado = 0;
  quadroParadoDois = false;
  poseCorridaAtiva = false;
  tempoAnimacaoCorrida = 0;
  quadroCorridaAtual = 0;
  poseNoArAtual = "";

  cena.physics.world.setBounds(0, 0, fase.largura, ALTURA_FASE);
  cena.cameras.main.setBounds(0, 0, fase.largura, ALTURA_TELA);
  // Cada fase define seu próprio fundo; sem cor definida, usa o azul da Fase 1.
  cena.cameras.main.setBackgroundColor(fase.corFundo || '#8ed6ff');

  // O fundo e a atmosfera especial são aplicados apenas à primeira fase.
  if (fase.id === 1) criarEfeitosFase1(cena, fase);
  if (fase.id === 2) {
    // A textura do corredor se repete no eixo horizontal para cobrir a fase.
    if (cena.textures.exists("fundo_fase2")) {
      cena.add.tileSprite(fase.largura / 2, ALTURA_TELA / 2,
        fase.largura, ALTURA_TELA, "fundo_fase2")
        .setScrollFactor(0.3, 0).setDepth(-100);
    }
    // Planta decorativa ao fundo, longe das hitboxes de plataformas e lasers.
    if (cena.textures.exists("planta_plano")) {
      cena.add.image(900, 205, "planta_plano")
        .setDisplaySize(320, 180).setScrollFactor(0.3, 0).setDepth(-90).setAlpha(0.82);
    }
  }

  // Chão contínuo: um retângulo estático que cobre toda a largura da fase.
  const chao = cena.add.rectangle(
    fase.largura / 2, ALTURA_CHAO + 80,
    fase.largura, 160, 0x805438
  );
  cena.physics.add.existing(chao, true);

  // Repete a textura de chão própria de cada fase por todo o percurso.
  const texturaChao = fase.id === 2 && cena.textures.exists("tile_chao_f2")
    ? "tile_chao_f2" : "tile_chao";
  cena.add.tileSprite(fase.largura / 2, ALTURA_CHAO, fase.largura, ALTURA_TEXTURA_CHAO, texturaChao)
    .setOrigin(0.5, 0);

  // A imagem enviada substitui o quadrado; a colisão acompanha o corpo e os pés.
  const larguraSprite = ALTURA_SPRITE_JOGADOR * LARGURA_ARTE_JOGADOR / ALTURA_ARTE_JOGADOR;
  jogador = cena.add.image(70, ALTURA_CHAO - ALTURA_SPRITE_JOGADOR / 2, "spriteJogador");
  jogador.setDisplaySize(larguraSprite, ALTURA_SPRITE_JOGADOR);
  cena.physics.add.existing(jogador);
  jogador.body.setSize(LARGURA_ARTE_JOGADOR * 0.70, ALTURA_ARTE_JOGADOR * 0.90, false);
  jogador.body.setOffset(LARGURA_ARTE_JOGADOR * 0.15, ALTURA_ARTE_JOGADOR * 0.10);
  jogador.body.setCollideWorldBounds(true);
  jogador.body.setMaxVelocity(VELOCIDADE_JOGADOR, VELOCIDADE_MAXIMA_QUEDA);

  // Objetos estáticos tornam as plataformas imóveis e compatíveis com colisões Arcade.
  plataformas = cena.physics.add.staticGroup();
  for (const p of fase.plataformas) {
    const bloco = cena.add.tileSprite(
      p.x + p.largura / 2, p.y + p.altura / 2,
      p.largura, p.altura, "tile_plataforma"
    );
    plataformas.add(bloco);
  }

  cena.physics.add.collider(jogador, chao);
  cena.physics.add.collider(jogador, plataformas);

  // A câmera acompanha o jogador apenas no eixo horizontal.
  cena.cameras.main.startFollow(jogador, true, LERP_CAMERA, 0);

  // A Fase 2 usa sua porta própria; a Fase 1 conserva a porta original.
  if (fase.id === 2) {
    metaFase = cena.textures.exists("porta_saida")
      ? cena.add.image(fase.meta.x, fase.meta.y, "porta_saida").setDisplaySize(32, 64)
      : cena.add.rectangle(fase.meta.x, fase.meta.y, 32, 64, 0x35d06f);
  } else {
    metaFase = cena.add.image(fase.meta.x, fase.meta.y, "porta_meta")
      .setDisplaySize(48, 96);
  }
  cena.physics.add.existing(metaFase, true);

  // Cria os marcadores e guarda o último ponto de respawn alcançado.
  criarCheckpoints(cena, fase.checkpoints || []);
  // Os perigos são configurados nos dados de cada fase; a Fase 1 não tem lasers.
  criarLasers(cena, fase.lasers || []);
  criarInterruptores(cena, fase.interruptores || []);
  if (fase.cofre) criarCofre(cena, fase.cofre);

  // Instancia os inimigos cadastrados para esta fase.
  criarInimigos(cena, fase.inimigos || []);
  // Instancia itens cadastrados e prepara seus contadores no HUD.
  criarColetaveis(cena, fase.coletaveis || []);
  // A TI usa a imagem enviada (32x32); a Fase 1 mantém o retrato da Marina.
  if (fase.npc) {
    if (fase.id === 2) {
      npcSprite = cena.textures.exists("npc_ti_1")
        ? cena.add.image(fase.npc.x, fase.npc.y, "npc_ti_1").setDisplaySize(32, 32).setDepth(5)
        : cena.add.rectangle(fase.npc.x, fase.npc.y, 32, 32, 0x3183d4).setDepth(5);
    } else {
      npcSprite = cena.add.image(fase.npc.x, fase.npc.y, "npc_mentora_1")
        .setDisplaySize(LARGURA_NPC_TELA, ALTURA_NPC_TELA)
        // Mantém os pés no chão e a altura igual à do personagem principal.
        .setPosition(fase.npc.x, fase.npc.y - (ALTURA_NPC_TELA - 32) / 2)
        .setDepth(5);
    }
  }

  // HUD preso à tela para continuar visível enquanto a câmera percorre a fase.
  iconesVidas = [];
  for (let i = 0; i < VIDAS_INICIAIS; i++) {
    const icone = cena.add.image(24 + i * 22, 26, "coracao")
      .setDisplaySize(16, 16).setScrollFactor(0).setDepth(1000);
    iconesVidas.push(icone);
  }
  atualizarHUDVidas();

  textoHUDItens = cena.add.text(20, 54, '', {
    fontFamily: 'sans-serif', fontSize: '18px', color: '#ffffff',
    stroke: '#172033', strokeThickness: 3
  }).setScrollFactor(0).setDepth(1000);
  atualizarHUDColetaveis();

  // Estes avisos só aparecem quando há um interruptor correspondente na fase.
  textoDicaInterruptor = cena.add.text(LARGURA_TELA / 2, ALTURA_TELA - 48, '[E] Ativar', {
    fontFamily: 'sans-serif', fontSize: '22px', color: '#ffffff',
    backgroundColor: '#172033', padding: { x: 14, y: 8 }
  }).setOrigin(0.5).setScrollFactor(0).setDepth(1100).setVisible(false);
  textoHUDLasers = cena.add.text(LARGURA_TELA / 2, 92, '', {
    fontFamily: 'sans-serif', fontSize: '20px', color: '#ffffff',
    backgroundColor: '#172033', padding: { x: 12, y: 6 }
  }).setOrigin(0.5).setScrollFactor(0).setDepth(1100).setVisible(false);
  if (fase.cofre) {
    textoHUDProjeto = cena.add.text(20, 82, 'Projeto: —', {
      fontFamily: 'sans-serif', fontSize: '18px', color: '#ffffff',
      stroke: '#172033', strokeThickness: 3
    }).setScrollFactor(0).setDepth(1000);
    textoHUDFuga = cena.add.text(LARGURA_TELA - 20, 24, '', {
      fontFamily: 'sans-serif', fontSize: '22px', color: '#ffffff',
      backgroundColor: '#172033', padding: { x: 12, y: 6 }
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(1000).setVisible(false);
  }

  // Mantemos as teclas de movimento e pulo disponíveis durante a fase.
  teclas = cena.input.keyboard.addKeys({
    esquerda: Phaser.Input.Keyboard.KeyCodes.LEFT,
    direita: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    cima: Phaser.Input.Keyboard.KeyCodes.UP,
    a: Phaser.Input.Keyboard.KeyCodes.A,
    d: Phaser.Input.Keyboard.KeyCodes.D,
    espaco: Phaser.Input.Keyboard.KeyCodes.SPACE,
    enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
    e: Phaser.Input.Keyboard.KeyCodes.E
  });
}

function update(time, delta) {
  // No Game Over, Enter reinicia esta fase com as três vidas iniciais.
  if (gameOver) {
    if (Phaser.Input.Keyboard.JustDown(teclas.enter)) {
      vidasRestantes = VIDAS_INICIAIS;
      tempoInvencibilidade = 0;
      tempoPiscarInvencibilidade = 0;
      this.scene.restart();
    }
    return;
  }
  if (painelLicaoAtivo) {
    if (Phaser.Input.Keyboard.JustDown(teclas.enter)) {
      if (indiceFaseAtual + 1 < FASES.length) {
        indiceFaseAtual++;
        this.physics.world.resume();
        this.time.paused = false;
        this.tweens.resumeAll();
        this.scene.restart();
      } else {
        painelLicaoAtivo = false;
        textoConclusao.setText('Fim de jogo');
      }
    }
    return;
  }
  if (dialogoNPCAtivo) {
    // O NPC de TI avança somente com Enter; a conversa da Marina aceita os dois.
    const avancar = faseAtual.id === 2
      ? Phaser.Input.Keyboard.JustDown(teclas.enter)
      : Phaser.Input.Keyboard.JustDown(teclas.espaco) ||
        Phaser.Input.Keyboard.JustDown(teclas.enter);
    if (avancar) avancarDialogoNPC(this);
    return;
  }
  if (concluiu) return;

  // A conversa abre uma única vez quando o jogador se aproxima do NPC.
  if (npcSprite && !npcJaFalou &&
      Phaser.Math.Distance.Between(jogador.x, jogador.y, npcSprite.x, npcSprite.y) < DISTANCIA_DIALOGO_NPC) {
    iniciarDialogoNPC(this);
    return;
  }

  // Atualiza a proximidade, o prompt e a ativação dos interruptores com E.
  atualizarInterruptores(this, this.time.now);
  // A fuga perde uma vida ao zerar; o respawn reinicia seu prazo no cofre.
  if (atualizarFuga(this, this.time.now)) return;

  // Controla o pisca e a duração da invencibilidade após receber dano.
  if (tempoInvencibilidade > 0) {
    tempoInvencibilidade = Math.max(0, tempoInvencibilidade - delta);
    tempoPiscarInvencibilidade += delta;
    if (tempoPiscarInvencibilidade >= INTERVALO_PISCAR_INVENCIBILIDADE_MS) {
      tempoPiscarInvencibilidade = 0;
      jogadorVisivelDuranteDano = !jogadorVisivelDuranteDano;
      jogador.setAlpha(jogadorVisivelDuranteDano ? 1 : 0.3);
    }
    if (tempoInvencibilidade === 0) jogador.setAlpha(1);
  }

  // Move cada inimigo entre as duas pontas de sua área de patrulha.
  for (const inimigo of inimigos) {
    if (!inimigo.ativo) continue;
    const centroX = inimigo.sprite.body.center.x;
    if (centroX <= inimigo.minX && inimigo.direcao < 0) inimigo.direcao = 1;
    else if (centroX >= inimigo.maxX && inimigo.direcao > 0) inimigo.direcao = -1;
    inimigo.sprite.body.setVelocityX(inimigo.direcao * VELOCIDADE_INIMIGO);

    // Quando as duas texturas forem adicionadas, alterna entre elas a cada 250 ms.
    if (inimigo.temTexturas) {
      inimigo.tempoAnimacao += delta;
      if (inimigo.tempoAnimacao >= INTERVALO_ANIMACAO_INIMIGO) {
        inimigo.tempoAnimacao -= INTERVALO_ANIMACAO_INIMIGO;
        inimigo.quadro = 1 - inimigo.quadro;
        inimigo.sprite.setTexture(inimigo.quadro === 0
          ? "inimigo_confusao_1" : "inimigo_confusao_2");
      }
    }
  }

  // Inverte o sentido dos lasers móveis ao chegarem ao fim do alcance definido.
  atualizarLasers(this.time.now);

  // Guarda o comando por um curto período para aceitá-lo ao aterrissar.
  const querPular = Phaser.Input.Keyboard.JustDown(teclas.espaco) ||
                    Phaser.Input.Keyboard.JustDown(teclas.cima);
  if (querPular) tempoBufferPuloRestante = TEMPO_BUFFER_PULO_MS;
  else tempoBufferPuloRestante = Math.max(0, tempoBufferPuloRestante - delta);

  // Renova a janela de pulo no chão e a mantém por 100 ms ao sair de uma borda.
  const noChao = jogador.body.blocked.down || jogador.body.touching.down;
  if (noChao) tempoCoyoteRestante = TEMPO_COYOTE_MS;
  else tempoCoyoteRestante = Math.max(0, tempoCoyoteRestante - delta);

  // Confere a chegada pela interseção dos corpos, sem depender só do callback
  // de overlap. Isso mantém a meta confiável mesmo com as hitboxes ajustadas
  // para cada sprite da animação.
  const corpoJogador = jogador.body;
  const corpoMeta = metaFase.body;
  const tocouMeta = corpoJogador.right > corpoMeta.left &&
                    corpoJogador.left < corpoMeta.right &&
                    corpoJogador.bottom > corpoMeta.top &&
                    corpoJogador.top < corpoMeta.bottom;
  if (tocouMeta) {
    if (faseAtual.cofre && !projetoColetado) {
      if (!avisoProjetoNaSaida) mostrarAvisoProjeto(this);
      return;
    }
    concluirFase(this);
    return;
  }
  avisoProjetoNaSaida = false;

  // Acelerar ao andar e aplicar atrito ao soltar dá uma parada mais gradual.
  const esquerda = teclas.esquerda.isDown || teclas.a.isDown;
  const direita = teclas.direita.isDown || teclas.d.isDown;
  const direcao = esquerda === direita ? 0 : (esquerda ? -1 : 1);
  // A arte aponta para a direita por padrão; espelhamos ao andar para a esquerda.
  if (direcao < 0) jogador.setFlipX(true);
  else if (direcao > 0) jogador.setFlipX(false);
  jogador.body.setAccelerationX(direcao * ACELERACAO_JOGADOR);
  jogador.body.setDragX(direcao === 0 ? DESACELERACAO_JOGADOR : 0);
  if (!noChao) {
    // Seleciona a arte pelo sentido vertical: braço levantado na subida, pose relaxada na queda.
    tempoAnimacaoParado = 0;
    quadroParadoDois = false;
    poseCorridaAtiva = false;
    const poseVertical = jogador.body.velocity.y < 0 ? "subida" : "queda";
    if (poseNoArAtual !== poseVertical) {
      poseNoArAtual = poseVertical;
      aplicarPoseNoAr(poseVertical);
    }
  } else {
    if (poseNoArAtual !== "") {
      poseNoArAtual = "";
      aplicarPoseParado(false);
    }

    // A pose de corrida aparece apenas enquanto anda apoiado no chão.
    const estaCorrendo = direcao !== 0;
    if (estaCorrendo) {
      tempoAnimacaoParado = 0;
      quadroParadoDois = false;
      if (!poseCorridaAtiva) {
        poseCorridaAtiva = true;
        tempoAnimacaoCorrida = 0;
        quadroCorridaAtual = 0;
        aplicarPoseCorrida(quadroCorridaAtual);
      } else {
        tempoAnimacaoCorrida += delta;
        if (tempoAnimacaoCorrida >= INTERVALO_ANIMACAO_CORRIDA) {
          tempoAnimacaoCorrida = 0;
          quadroCorridaAtual = (quadroCorridaAtual + 1) % SPRITES_CORRIDA.length;
          aplicarPoseCorrida(quadroCorridaAtual);
        }
      }
    } else {
      if (poseCorridaAtiva) {
        poseCorridaAtiva = false;
        tempoAnimacaoCorrida = 0;
        quadroCorridaAtual = 0;
        aplicarPoseParado(false);
      }

      // Alterna as poses de respiração somente quando está parado e apoiado.
      const estaParado = Math.abs(jogador.body.velocity.x) < 6;
      if (estaParado) {
        tempoAnimacaoParado += delta;
        if (tempoAnimacaoParado >= INTERVALO_ANIMACAO_PARADO) {
          tempoAnimacaoParado = 0;
          quadroParadoDois = !quadroParadoDois;
          aplicarPoseParado(quadroParadoDois);
        }
      } else {
        tempoAnimacaoParado = 0;
        if (quadroParadoDois) {
          quadroParadoDois = false;
          aplicarPoseParado(false);
        }
      }
    }
  }

  // O pulo usa o buffer de entrada e também permite saltar logo após sair da borda.
  if (tempoBufferPuloRestante > 0 && tempoCoyoteRestante > 0) {
    jogador.body.setVelocityY(-FORCA_PULO);
    tempoPuloSegurado = 0;
    tempoBufferPuloRestante = 0;
    tempoCoyoteRestante = 0;
  }

  // Segurar o botão reduz a gravidade por um curto período, aumentando a altura do salto.
  const segurandoPulo = teclas.espaco.isDown || teclas.cima.isDown;
  if (segurandoPulo && jogador.body.velocity.y < 0 && tempoPuloSegurado < TEMPO_PULO_VARIAVEL) {
    jogador.body.setGravityY(GRAVIDADE_DURANTE_PULO - GRAVIDADE);
    tempoPuloSegurado += delta;
  } else if (jogador.body.velocity.y > 0) {
    // Na descida, a gravidade extra acelera a queda sem ultrapassar o limite de velocidade.
    jogador.body.setGravityY(GRAVIDADE_EXTRA_QUEDA);
  } else {
    jogador.body.setGravityY(0);
  }

  // Ao cair abaixo da tela, reposicionamos o jogador no início da fase.
  if (jogador.y > ALTURA_CHAO + 220) {
    perderVida(this, 0, true);
  }
}

// Cria placeholders vermelhos e deixa preparado o uso das duas texturas futuras.
function criarInimigos(cena, definicoes) {
  for (const definicao of definicoes) {
    if (definicao.tipo !== "confusao") continue;

    const temTexturas = cena.textures.exists("inimigo_confusao_1") &&
                        cena.textures.exists("inimigo_confusao_2");
    const yVisual = definicao.y - (TAMANHO_INIMIGO_TELA - 32) / 2;
    const sprite = temTexturas
      ? cena.add.image(definicao.x, yVisual, "inimigo_confusao_1")
      : cena.add.rectangle(definicao.x, yVisual,
        TAMANHO_INIMIGO_TELA, TAMANHO_INIMIGO_TELA, 0xe53935);
    if (temTexturas) {
      sprite.setDisplaySize(TAMANHO_INIMIGO_TELA, TAMANHO_INIMIGO_TELA);
    }
    cena.physics.add.existing(sprite);
    // Faz a hitbox acompanhar o novo tamanho visual do inimigo.
    sprite.body.setSize(
      TAMANHO_INIMIGO_TELA / Math.max(0.001, Math.abs(sprite.scaleX)),
      TAMANHO_INIMIGO_TELA / Math.max(0.001, Math.abs(sprite.scaleY))
    );
    sprite.body.setAllowGravity(false);
    sprite.body.setImmovable(true);

    const metadeAlcance = Math.max(0, definicao.alcance) / 2;
    const inimigo = {
      sprite,
      minX: definicao.x - metadeAlcance,
      maxX: definicao.x + metadeAlcance,
      direcao: 1,
      temTexturas,
      tempoAnimacao: 0,
      quadro: 0,
      ativo: true
    };
    inimigos.push(inimigo);

    // Sobreposição deixa o personagem atravessar o inimigo ao pisoteá-lo.
    cena.physics.add.overlap(jogador, sprite, () => {
      if (!inimigo.ativo || tempoInvencibilidade > 0 || gameOver || concluiu) return;

      const caiuSobre = jogador.body.velocity.y > 0 &&
        jogador.body.prev.y + jogador.body.height <= sprite.body.top + 12;
      if (caiuSobre) {
        inimigo.ativo = false;
        sprite.destroy();
        jogador.body.setVelocityY(-FORCA_QUIQUE_INIMIGO);
        // Impede que segurar pulo transforme o pequeno quique em um salto alto.
        tempoPuloSegurado = TEMPO_PULO_VARIAVEL;
        tempoCoyoteRestante = 0;
        tempoBufferPuloRestante = 0;
      } else {
        let direcaoEmpurrao = Math.sign(jogador.x - sprite.x);
        if (direcaoEmpurrao === 0) direcaoEmpurrao = -inimigo.direcao;
        perderVida(cena, direcaoEmpurrao, false);
      }
    });
  }
}

// Gera um fundo provisório por código, adiciona parallax, luzes e névoa vermelha.
function criarEfeitosFase1(cena, fase) {
  const chavePlaceholder = "fundo_fase1_placeholder";
  if (!cena.textures.exists("fundo_fase1")) {
    if (!cena.textures.exists(chavePlaceholder)) {
      const grafico = cena.make.graphics({ x: 0, y: 0, add: false });
      grafico.fillStyle(0x18233a, 1);
      grafico.fillRect(0, 0, 512, ALTURA_TELA);
      grafico.generateTexture(chavePlaceholder, 512, ALTURA_TELA);
      grafico.destroy();
    }
  }

  const chaveFundo = cena.textures.exists("fundo_fase1")
    ? "fundo_fase1" : chavePlaceholder;
  cena.add.tileSprite(fase.largura / 2, ALTURA_TELA / 2,
    fase.largura, ALTURA_TELA, chaveFundo)
    .setScrollFactor(0.3, 0).setDepth(-100);

  // Oscila o alpha em intervalos aleatórios; algumas piscadas ficam mais fortes.
  const overlayEscuro = cena.add.rectangle(LARGURA_TELA / 2, ALTURA_TELA / 2,
    LARGURA_TELA, ALTURA_TELA, 0x05070d, 0.14)
    .setScrollFactor(0).setDepth(50);
  const agendarPisca = () => {
    if (!overlayEscuro.active) return;
    cena.time.delayedCall(Phaser.Math.Between(900, 3600), () => {
      if (!overlayEscuro.active) return;
      const piscadaForte = Math.random() < 0.2;
      overlayEscuro.setFillStyle(0x05070d, piscadaForte
        ? Phaser.Math.FloatBetween(0.48, 0.66)
        : Phaser.Math.FloatBetween(0.22, 0.38));
      cena.time.delayedCall(Phaser.Math.Between(90, 240), () => {
        if (!overlayEscuro.active) return;
        overlayEscuro.setFillStyle(0x05070d, 0.14);
        agendarPisca();
      });
    });
  };
  agendarPisca();

  // A faixa é mais larga que a tela para se mover sem revelar as bordas.
  const nevoaVermelha = cena.add.rectangle(LARGURA_TELA / 2, ALTURA_TELA - 42,
    LARGURA_TELA + 100, 110, 0xb92e42, 0.22)
    .setScrollFactor(0).setDepth(60);
  cena.tweens.add({
    targets: nevoaVermelha,
    x: LARGURA_TELA / 2 + 34,
    duration: 4200,
    ease: 'Sine.easeInOut',
    yoyo: true,
    repeat: -1
  });
}

// Cria checkpoints amarelos; tocar neles salva o respawn e os deixa verdes.
function criarCheckpoints(cena, definicoes) {
  definicoes.forEach((definicao, indice) => {
    const marcador = cena.textures.exists("item_checkpoint")
      ? cena.add.image(definicao.x, definicao.y, "item_checkpoint")
        .setDisplaySize(32, 32).setDepth(4)
      : cena.add.rectangle(definicao.x, definicao.y, 24, 24, 0xffd43b).setDepth(4);
    cena.physics.add.existing(marcador, true);
    checkpoints.push({ sprite: marcador, definicao, indice });

    cena.physics.add.overlap(jogador, marcador, () => {
      // Não permite voltar para um ponto anterior nem salvar o mesmo duas vezes.
      if (indice <= indiceCheckpointAtual) return;

      indiceCheckpointAtual = indice;
      if (marcador.setTint) marcador.setTint(0x9aff9a);
      else marcador.setFillStyle(0x35d06f);
      ultimoCheckpoint = {
        x: definicao.x,
        y: ALTURA_CHAO - ALTURA_SPRITE_JOGADOR / 2
      };
      mostrarProgressoSalvo(cena);
    });
  });
}

// Cria lasers pulsantes ou móveis, cada um com uma hitbox do tamanho do desenho.
function criarLasers(cena, definicoes) {
  for (const definicao of definicoes) {
    if (!definicao.id || !["intermitente", "movel", "fixo"].includes(definicao.tipo)) continue;

    const laser = cena.add.rectangle(
      definicao.x,
      definicao.y,
      definicao.largura,
      definicao.altura,
      definicao.tipo === "intermitente" ? 0x5e2332 : 0xff3b55
    ).setDepth(8);
    cena.physics.add.existing(laser);
    laser.body.setAllowGravity(false);
    laser.body.setImmovable(true);
    laser.body.setSize(definicao.largura, definicao.altura);

    const estado = {
      id: definicao.id,
      sprite: laser,
      definicao,
      ligado: definicao.tipo !== "intermitente",
      direcao: 1,
      limiteMinimo: 0,
      limiteMaximo: 0,
      desligadoAte: 0,
      inicioAviso: 0,
      emissores: []
    };
    // Cada barreira tem um emissor visual em cada extremidade, sem colisão.
    if (cena.textures.exists("emissor_laser")) {
      const horizontal = definicao.largura >= definicao.altura;
      const pontos = horizontal
        ? [
          { x: definicao.x - definicao.largura / 2, y: definicao.y },
          { x: definicao.x + definicao.largura / 2, y: definicao.y }
        ]
        : [
          { x: definicao.x, y: definicao.y - definicao.altura / 2 },
          { x: definicao.x, y: definicao.y + definicao.altura / 2 }
        ];
      estado.emissores = pontos.map((ponto) =>
        cena.add.image(ponto.x, ponto.y, "emissor_laser").setDisplaySize(16, 16).setDepth(9)
      );
    }
    lasers.push(estado);

    if (definicao.tipo === "movel") {
      const metadeAlcance = Math.max(0, definicao.alcance || 0) / 2;
      const centro = definicao.eixo === "y" ? definicao.y : definicao.x;
      estado.limiteMinimo = centro - metadeAlcance;
      estado.limiteMaximo = centro + metadeAlcance;
      atualizarVelocidadeLaser(estado);
    } else if (definicao.tipo === "intermitente") {
      // O laser começa apagado; atraso e ciclo vêm dos dados em levels.js.
      atualizarVisualLaser(estado, cena.time.now);
      agendarCicloLaser(cena, estado);
    } else {
      // Um laser fixo fica ligado até que um interruptor o desligue.
      atualizarVisualLaser(estado, cena.time.now);
    }

    cena.physics.add.overlap(jogador, laser, () => {
      if (!laser.body.enable || gameOver || concluiu || tempoInvencibilidade > 0) return;
      const empurrao = Math.sign(jogador.x - laser.x);
      perderVida(cena, empurrao, false);
    });
  }
}

// Mantém cada onda sincronizada: atraso inicial, tempo ligado e pausa até o próximo ciclo.
function agendarCicloLaser(cena, estado) {
  const definicao = estado.definicao;
  const tempoLigado = Math.max(1, definicao.tempoLigado || 800);
  const ciclo = Math.max(tempoLigado, definicao.ciclo || 3000);
  const iniciarPulso = () => {
    if (!estado.sprite.active) return;
    estado.ligado = true;
    atualizarVisualLaser(estado, cena.time.now);

    cena.time.delayedCall(tempoLigado, () => {
      if (!estado.sprite.active) return;
      estado.ligado = false;
      atualizarVisualLaser(estado, cena.time.now);
      cena.time.delayedCall(ciclo - tempoLigado, iniciarPulso);
    });
  };

  cena.time.delayedCall(Math.max(0, definicao.atraso || 0), iniciarPulso);
}

// Atualiza os limites e a velocidade dos lasers móveis em cada quadro do jogo.
function atualizarLasers(agora) {
  for (const estado of lasers) {
    const definicao = estado.definicao;
    if (!estado.sprite.active) continue;
    if (definicao.tipo === "movel") {
      const eixo = definicao.eixo === "y" ? "y" : "x";
      const posicao = eixo === "y"
        ? estado.sprite.body.center.y
        : estado.sprite.body.center.x;
      if (posicao <= estado.limiteMinimo && estado.direcao < 0) estado.direcao = 1;
      else if (posicao >= estado.limiteMaximo && estado.direcao > 0) estado.direcao = -1;
      atualizarVelocidadeLaser(estado);
    }
    // Mantém os emissores alinhados mesmo quando a barreira patrulha.
    if (estado.emissores.length) {
      const horizontal = definicao.largura >= definicao.altura;
      if (horizontal) {
        estado.emissores[0].setPosition(estado.sprite.x - definicao.largura / 2, estado.sprite.y);
        estado.emissores[1].setPosition(estado.sprite.x + definicao.largura / 2, estado.sprite.y);
      } else {
        estado.emissores[0].setPosition(estado.sprite.x, estado.sprite.y - definicao.altura / 2);
        estado.emissores[1].setPosition(estado.sprite.x, estado.sprite.y + definicao.altura / 2);
      }
    }
  }

  // Também atualiza a colisão durante o aviso piscante do interruptor.
  for (const estado of lasers) atualizarVisualLaser(estado, agora);
}

// Aplica a velocidade configurada somente no eixo em que o laser patrulha.
function atualizarVelocidadeLaser(estado) {
  const definicao = estado.definicao;
  const velocidade = Math.max(0, definicao.velocidade || 0) * estado.direcao;
  if (definicao.eixo === "y") estado.sprite.body.setVelocity(0, velocidade);
  else estado.sprite.body.setVelocity(velocidade, 0);
}

// Acende/apaga o desenho e a hitbox, incluindo a piscada de aviso antes de religar.
function atualizarVisualLaser(estado, agora) {
  let ligado = estado.ligado;
  if (agora < estado.desligadoAte) {
    if (agora < estado.inicioAviso) ligado = false;
    else ligado = Math.floor((agora - estado.inicioAviso) / 120) % 2 === 0;
  }

  estado.sprite.body.enable = ligado;
  estado.sprite.setFillStyle(ligado ? 0xff3b55 : 0x5e2332);
  estado.sprite.setAlpha(ligado ? 1 : 0.75);
}

// Cria o interruptor ilustrado; se a textura faltar, conserva o placeholder.
function criarInterruptores(cena, definicoes) {
  for (const definicao of definicoes) {
    const comTextura = cena.textures.exists("interruptor_off") &&
      cena.textures.exists("interruptor_on");
    const desligado = comTextura
      ? cena.add.image(definicao.x, definicao.y, "interruptor_off").setDisplaySize(32, 32).setDepth(9)
      : null;
    const ligado = comTextura
      ? cena.add.image(definicao.x, definicao.y, "interruptor_on").setDisplaySize(32, 32).setDepth(9).setVisible(false)
      : null;
    const base = comTextura ? null : cena.add.rectangle(definicao.x, definicao.y, 24, 32, 0x858b96).setDepth(9);
    const topo = comTextura ? null : cena.add.rectangle(definicao.x, definicao.y - 11, 18, 8, 0xe53935).setDepth(10);
    interruptores.push({
      definicao,
      base,
      topo,
      desligado,
      ligado,
      desligaAte: 0,
      reativarApos: 0
    });
  }
}

// Alterna entre as imagens fornecidas ou atualiza o topo colorido do placeholder.
function atualizarVisualInterruptor(interruptor, ativo) {
  if (interruptor.desligado && interruptor.ligado) {
    interruptor.desligado.setVisible(!ativo);
    interruptor.ligado.setVisible(ativo);
  } else if (interruptor.topo) {
    interruptor.topo.setFillStyle(ativo ? 0x35d06f : 0xe53935);
  }
}

// Ativa um interruptor próximo, inicia o cronômetro e marca os lasers pelo id.
function ativarInterruptor(interruptor, agora) {
  const definicao = interruptor.definicao;
  const duracao = Math.max(0, definicao.duracao || 0);
  interruptor.desligaAte = agora + duracao;
  interruptor.reativarApos = interruptor.desligaAte + 1000;
  atualizarVisualInterruptor(interruptor, true);

  const idsDesligados = new Set(definicao.desliga || []);
  for (const laser of lasers) {
    if (!idsDesligados.has(laser.id)) continue;
    laser.desligadoAte = interruptor.desligaAte;
    laser.inicioAviso = interruptor.desligaAte - 1500;
  }
}

// Mostra a dica no alcance do interruptor e atualiza a contagem do tempo restante.
function atualizarInterruptores(cena, agora) {
  let interruptorProximo = null;
  let distanciaMaisCurta = Infinity;

  for (const interruptor of interruptores) {
    if (agora >= interruptor.desligaAte && interruptor.desligaAte > 0) {
      interruptor.desligaAte = 0;
      atualizarVisualInterruptor(interruptor, false);
    }

    const distancia = Phaser.Math.Distance.Between(
      jogador.x, jogador.y,
      interruptor.definicao.x, interruptor.definicao.y
    );
    if (distancia < 80 && distancia < distanciaMaisCurta) {
      distanciaMaisCurta = distancia;
      interruptorProximo = interruptor;
    }
  }

  const disponivel = interruptorProximo &&
    interruptorProximo.desligaAte === 0 && agora >= interruptorProximo.reativarApos;
  textoDicaInterruptor.setVisible(Boolean(disponivel));
  if (disponivel && Phaser.Input.Keyboard.JustDown(teclas.e)) {
    ativarInterruptor(interruptorProximo, agora);
    textoDicaInterruptor.setVisible(false);
  }

  const interruptorAtivo = interruptores.find((item) => item.desligaAte > agora);
  if (!interruptorAtivo) {
    textoHUDLasers.setVisible(false);
    return;
  }

  const segundos = Math.ceil((interruptorAtivo.desligaAte - agora) / 1000);
  textoHUDLasers.setText(`Lasers desligados: ${segundos}s`).setVisible(true);
}

// Cria o cofre fechado e abre sua hitbox ao toque para iniciar a coleta automática.
function criarCofre(cena, definicao) {
  const cofre = cena.add.rectangle(
    definicao.x, definicao.y, 64, 64, 0x343943
  ).setDepth(7);
  cena.physics.add.existing(cofre, true);

  cena.physics.add.overlap(jogador, cofre, () => {
    if (cofreAberto) return;
    cofreAberto = true;
    cofre.setFillStyle(0x858b96);
    mostrarProjeto(cena, definicao);
  });
}

// Exibe o projeto dourado com brilho por um instante e então o coleta sozinho.
function mostrarProjeto(cena, cofre) {
  const x = cofre.x;
  const y = cofre.y - 54;
  const brilho = cena.add.ellipse(x, y, 46, 48, 0xffc928, 0.32).setDepth(10);
  const projeto = cena.add.rectangle(x, y, 24, 28, 0xffc928).setDepth(11);
  cena.tweens.add({
    targets: brilho,
    alpha: 0.55,
    scaleX: 1.2,
    scaleY: 1.2,
    duration: 180,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut'
  });

  cena.time.delayedCall(350, () => {
    if (projetoColetado) return;
    projeto.destroy();
    brilho.destroy();
    coletarProjeto(cena, cofre);
  });
}

// Marca o objetivo, transfere o checkpoint para o cofre e dispara a fuga de 15 s.
function coletarProjeto(cena, cofre) {
  if (projetoColetado) return;
  projetoColetado = true;
  textoHUDProjeto.setText('Projeto: ✔').setColor('#a9ff9f');
  ultimoCheckpoint = {
    // Reaparece junto ao cofre, sem ficar preso dentro do retângulo.
    x: cofre.x - 52,
    y: ALTURA_CHAO - ALTURA_SPRITE_JOGADOR / 2
  };

  fugaAtiva = true;
  fimFugaEm = cena.time.now + TEMPO_FUGA;
  textoHUDFuga.setText(`Fuga: ${Math.ceil(TEMPO_FUGA / 1000)}s`).setVisible(true);

  // O alarme cobre o cenário, mas permanece atrás do HUD e dos painéis.
  overlayAlarme = cena.add.rectangle(
    LARGURA_TELA / 2, ALTURA_TELA / 2,
    LARGURA_TELA, ALTURA_TELA, 0xff1d2e, 0.15
  ).setScrollFactor(0).setDepth(950);
  cena.tweens.add({
    targets: overlayAlarme,
    alpha: { from: 0.15, to: 0.35 },
    duration: 220,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut'
  });
}

// Atualiza o cronômetro da fuga; ao expirar, a perda de vida restaura o tempo.
function atualizarFuga(cena, agora) {
  if (!fugaAtiva) return false;

  const restante = Math.max(0, fimFugaEm - agora);
  textoHUDFuga.setText(`Fuga: ${Math.ceil(restante / 1000)}s`).setVisible(true);
  if (restante > 0) return false;

  // Um retorno verdadeiro interrompe o restante deste quadro após o respawn.
  return perderVida(cena, 0, false);
}

// A meta não conclui a fase sem o item; a mensagem dura 2 s sem pausar o jogo.
function mostrarAvisoProjeto(cena) {
  avisoProjetoNaSaida = true;
  idAvisoProjeto++;
  const idAtual = idAvisoProjeto;
  if (textoAvisoProjeto) textoAvisoProjeto.destroy();
  textoAvisoProjeto = cena.add.text(
    LARGURA_TELA / 2, 150, 'Pegue o Projeto primeiro',
    { fontFamily: 'sans-serif', fontSize: '24px', color: '#ffffff',
      backgroundColor: '#172033', padding: { x: 18, y: 12 } }
  ).setOrigin(0.5).setScrollFactor(0).setDepth(1150);

  cena.time.delayedCall(2000, () => {
    if (idAvisoProjeto === idAtual && textoAvisoProjeto) {
      textoAvisoProjeto.destroy();
      textoAvisoProjeto = null;
    }
  });
}

// Mostra por 1,5 s a confirmação do checkpoint sem pausar a fase.
function mostrarProgressoSalvo(cena) {
  idNotificacaoCheckpoint++;
  const idAtual = idNotificacaoCheckpoint;
  if (textoProgressoCheckpoint) textoProgressoCheckpoint.destroy();
  textoProgressoCheckpoint = cena.add.text(
    LARGURA_TELA / 2, 100, 'Progresso salvo',
    { fontFamily: 'sans-serif', fontSize: '24px', color: '#ffffff',
      backgroundColor: '#172033', padding: { x: 16, y: 10 } }
  ).setOrigin(0.5).setScrollFactor(0).setDepth(1050);

  cena.time.delayedCall(1500, () => {
    // Um temporizador antigo não deve apagar uma notificação mais recente.
    if (idNotificacaoCheckpoint === idAtual && textoProgressoCheckpoint) {
      textoProgressoCheckpoint.destroy();
      textoProgressoCheckpoint = null;
    }
  });
}

// Cria os itens com formas temporárias e detecta a coleta usando Arcade Physics.
function criarColetaveis(cena, definicoes) {
  for (const definicao of definicoes) {
    if (definicao.tipo !== "duvida" && definicao.tipo !== "cracha") continue;

    const eDuvida = definicao.tipo === "duvida";
    const chaveTextura = eDuvida ? "item_duvida" : "item_cracha";
    const largura = eDuvida ? 40 : 40;
    const altura = eDuvida ? 40 : 48;
    const alturaOriginal = eDuvida ? 24 : 28;
    // Preserva a base de cada item na altura onde foi definido na fase.
    const yVisual = definicao.y - (altura - alturaOriginal) / 2;
    const temTextura = cena.textures.exists(chaveTextura);
    let sprite;
    const brilho = cena.add.ellipse(
      definicao.x, yVisual, largura + 24, altura + 24,
      eDuvida ? 0xffd43b : 0x4b91ff, 0.30
    ).setDepth(6);

    // O halo pulsa devagar para destacar o item sem encobrir a arte.
    cena.tweens.add({
      targets: brilho,
      alpha: 0.42,
      scaleX: 1.16,
      scaleY: 1.16,
      duration: 850,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    if (temTextura) {
      sprite = cena.add.image(definicao.x, yVisual, chaveTextura)
        .setDisplaySize(largura, altura).setDepth(7);
    } else if (eDuvida) {
      sprite = cena.add.circle(definicao.x, yVisual, largura / 2, 0xffd43b)
        .setDepth(7);
    } else {
      sprite = cena.add.rectangle(definicao.x, yVisual, largura, altura, 0x3488ff)
        .setDepth(7);
    }

    cena.physics.add.existing(sprite);
    sprite.body.setSize(
      largura / Math.max(0.001, Math.abs(sprite.scaleX)),
      altura / Math.max(0.001, Math.abs(sprite.scaleY))
    );
    sprite.body.setAllowGravity(false);
    sprite.body.setImmovable(true);

    const item = { tipo: definicao.tipo, sprite, brilho, ativo: true };
    coletaveis.push(item);
    cena.physics.add.overlap(jogador, sprite, () => {
      if (!item.ativo) return;
      item.ativo = false;
      sprite.destroy();
      brilho.destroy();

      if (item.tipo === "duvida") {
        duvidasColetadas++;
        mostrarDica(cena);
      } else {
        crachasColetados++;
      }
      atualizarHUDColetaveis();
    });
  }
}

// Exibe uma dica por três segundos sem pausar a cena ou a física.
function mostrarDica(cena) {
  const dicas = window.DIALOGS || [];
  const dica = dicas.length > 0
    ? dicas[indiceDicaAtual % dicas.length]
    : "Dica";
  indiceDicaAtual++;
  idDicaAtual++;
  const idAtual = idDicaAtual;

  if (caixaDica) caixaDica.destroy();
  caixaDica = cena.add.text(LARGURA_TELA / 2, 105, dica, {
    fontFamily: 'sans-serif', fontSize: '22px', color: '#172033',
    backgroundColor: '#fff2b2', padding: { x: 18, y: 12 },
    align: 'center', wordWrap: { width: LARGURA_TELA - 80 }
  }).setOrigin(0.5).setScrollFactor(0).setDepth(1050);

  cena.time.delayedCall(3000, () => {
    // Um timer antigo não deve remover uma dica que acabou de aparecer.
    if (idDicaAtual === idAtual && caixaDica) {
      caixaDica.destroy();
      caixaDica = null;
    }
  });
}

// Atualiza os dois contadores de itens, mantendo o texto preso à tela.
function atualizarHUDColetaveis() {
  textoHUDItens.setText(
    `Dúvidas: ${duvidasColetadas}/${totalDuvidasFase}   Crachás: ${crachasColetados}`
  );
}

// Atualiza o contador de corações no HUD após qualquer perda de vida.
function atualizarHUDVidas() {
  iconesVidas.forEach((icone, indice) => icone.setVisible(indice < vidasRestantes));
}

// Reduz uma vida e reinicia no começo da fase; ao zerar, aguarda Enter.
function perderVida(cena, direcaoEmpurrao = 0, reiniciarNoInicio = false) {
  if (gameOver || concluiu || tempoInvencibilidade > 0) return false;

  vidasRestantes = Math.max(0, vidasRestantes - 1);
  atualizarHUDVidas();
  tempoInvencibilidade = DURACAO_INVENCIBILIDADE_MS;
  tempoPiscarInvencibilidade = 0;
  jogadorVisivelDuranteDano = true;
  jogador.setAlpha(1);
  tempoPuloSegurado = 0;
  tempoCoyoteRestante = 0;
  tempoBufferPuloRestante = 0;

  if (vidasRestantes === 0) {
    gameOver = true;
    jogador.body.enable = false;
    textoGameOver = cena.add.text(
      LARGURA_TELA / 2,
      ALTURA_TELA / 2,
      'Game Over\nPressione Enter para tentar de novo',
      { fontFamily: 'sans-serif', fontSize: '30px', color: '#ffffff',
        align: 'center', lineSpacing: 12,
        backgroundColor: '#172033', padding: { x: 22, y: 16 } }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(1100);
    jogador.setAlpha(1);
    return true;
  }

  // Na Fase 2 toda perda de vida usa o último checkpoint; a Fase 1 mantém o início.
  const usarCheckpoint = faseAtual && faseAtual.id === 2 && ultimoCheckpoint;
  if (reiniciarNoInicio || usarCheckpoint) {
    const pontoRespawn = usarCheckpoint
      ? ultimoCheckpoint
      : { x: 70, y: ALTURA_CHAO - ALTURA_SPRITE_JOGADOR / 2 };
    jogador.setPosition(pontoRespawn.x, pontoRespawn.y);
    jogador.body.setVelocity(0, 0);
  } else {
    jogador.body.setVelocityX(direcaoEmpurrao * FORCA_EMPURRAO_INIMIGO);
  }
  if (fugaAtiva) {
    // A fuga recomeça com o prazo completo sempre que o jogador reaparece no cofre.
    fimFugaEm = cena.time.now + TEMPO_FUGA;
  }
  jogador.body.setAcceleration(0, 0);
  jogador.body.setGravityY(0);
  jogador.body.setMaxVelocity(VELOCIDADE_JOGADOR, VELOCIDADE_MAXIMA_QUEDA);
  poseNoArAtual = '';
  poseCorridaAtiva = false;
  quadroParadoDois = false;
  tempoAnimacaoParado = 0;
  if (reiniciarNoInicio || usarCheckpoint) aplicarPoseParado(false);
  return true;
}

// Abre o painel de lição ao chegar à meta e aguarda Enter.
function concluirFase(cena) {
  if (concluiu) return;
  concluiu = true;
  painelLicaoAtivo = true;
  jogador.body.setVelocity(0, 0);
  jogador.body.setAcceleration(0, 0);
  jogador.body.setGravityY(0);
  tempoPuloSegurado = 0;

  const licao = faseAtual.licao || { titulo: 'Lição da fase', itens: [] };
  const itens = (licao.itens || []).map((item) => `• ${item}`).join('\n');
  fundoPainelLicao = cena.add.rectangle(LARGURA_TELA / 2, ALTURA_TELA / 2,
    LARGURA_TELA, ALTURA_TELA, 0x000000, 0.65)
    .setScrollFactor(0).setDepth(1200);
  caixaPainelLicao = cena.add.rectangle(LARGURA_TELA / 2, ALTURA_TELA / 2,
    700, 330, 0x172033, 0.96).setScrollFactor(0).setDepth(1201);
  textoTituloLicao = cena.add.text(LARGURA_TELA / 2, 115, licao.titulo,
    { fontFamily: 'sans-serif', fontSize: '28px', color: '#ffe08a',
      align: 'center', wordWrap: { width: 620 } })
    .setOrigin(0.5).setScrollFactor(0).setDepth(1202);
  textoItensLicao = cena.add.text(110, 165,
    itens || '• Continue aprendendo a cada fase.',
    { fontFamily: 'sans-serif', fontSize: '20px', color: '#ffffff',
      lineSpacing: 12, wordWrap: { width: 580 } })
    .setScrollFactor(0).setDepth(1202);
  textoConclusao = cena.add.text(LARGURA_TELA / 2, 345,
    'Pressione Enter para continuar',
    { fontFamily: 'sans-serif', fontSize: '18px', color: '#b9d8ff', align: 'center' })
    .setOrigin(0.5).setScrollFactor(0).setDepth(1202);
  cena.physics.world.pause();
  cena.time.paused = true;
  cena.tweens.pauseAll();
}

// Prepara a conversa do NPC e pausa a física até o jogador avançar as falas.
function iniciarDialogoNPC(cena) {
  npcJaFalou = true;
  falasNPC = (window.NPC_DIALOGS && window.NPC_DIALOGS[faseAtual.id]) || [];
  indiceFalaNPC = 0;
  if (falasNPC.length === 0) return;

  dialogoNPCAtivo = true;
  jogador.body.setVelocity(0, 0);
  jogador.body.setAcceleration(0, 0);
  caixaDialogoNPC = cena.add.rectangle(LARGURA_TELA / 2, ALTURA_TELA - 66,
    LARGURA_TELA - 56, 112, 0x111827, 0.94)
    .setScrollFactor(0).setDepth(1100);
  textoDialogoNPC = cena.add.text(48, ALTURA_TELA - 112,
    `${falasNPC[indiceFalaNPC]}\n\nEspaço ou Enter para avançar`,
    { fontFamily: 'sans-serif', fontSize: '20px', color: '#ffffff',
      lineSpacing: 4, wordWrap: { width: LARGURA_TELA - 96 } })
    .setScrollFactor(0).setDepth(1101);
  cena.physics.world.pause();
  cena.time.paused = true;
  cena.tweens.pauseAll();
}

// Avança uma fala e retoma a fase depois da última.
function avancarDialogoNPC(cena) {
  indiceFalaNPC++;
  if (indiceFalaNPC >= falasNPC.length) {
    dialogoNPCAtivo = false;
    caixaDialogoNPC.destroy();
    textoDialogoNPC.destroy();
    caixaDialogoNPC = null;
    textoDialogoNPC = null;
    cena.physics.world.resume();
    cena.time.paused = false;
    cena.tweens.resumeAll();
    return;
  }

  textoDialogoNPC.setText(
    `${falasNPC[indiceFalaNPC]}\n\nEspaço ou Enter para avançar`
  );
}
// O index.html carrega Phaser e assets.js antes de iniciar o jogo.
iniciarJogo();

