// Cada objeto descreve uma fase. Para adicionar outra, inclua um novo objeto
// nesta lista; o game.js avança pela ordem dos itens.
window.LEVELS = [
  {
    id: 1,
    nome: "Fase 1",
    largura: 4000,
    plataformas: [
      // Os degraus alternam entre dois níveis separados por cerca de 105 px.
      { x: 280, y: 265, largura: 190, altura: 18 },
      { x: 530, y: 160, largura: 190, altura: 18 },
      { x: 780, y: 265, largura: 190, altura: 18 },
      { x: 1030, y: 160, largura: 190, altura: 18 },
      { x: 1280, y: 265, largura: 190, altura: 18 },
      { x: 1530, y: 160, largura: 190, altura: 18 },
      { x: 1780, y: 265, largura: 190, altura: 18 },
      { x: 2030, y: 160, largura: 190, altura: 18 },
      { x: 2280, y: 265, largura: 190, altura: 18 },
      { x: 2530, y: 160, largura: 190, altura: 18 },
      { x: 2780, y: 265, largura: 190, altura: 18 },
      { x: 3030, y: 160, largura: 190, altura: 18 },
      { x: 3280, y: 265, largura: 190, altura: 18 },
      { x: 3530, y: 160, largura: 190, altura: 18 }
    ],
    // x é o centro da patrulha; alcance é a largura total do percurso.
    inimigos: [
      { tipo: "confusao", x: 700, y: 374, alcance: 160 },
      { tipo: "confusao", x: 1500, y: 374, alcance: 180 },
      { tipo: "confusao", x: 2400, y: 374, alcance: 160 },
      { tipo: "confusao", x: 3300, y: 374, alcance: 180 }
    ],
    coletaveis: [
      { tipo: "duvida", x: 330, y: 253 },
      { tipo: "duvida", x: 580, y: 148 },
      { tipo: "duvida", x: 1330, y: 253 },
      { tipo: "duvida", x: 2580, y: 148 },
      { tipo: "duvida", x: 3330, y: 253 },
      { tipo: "cracha", x: 500, y: 376 },
      { tipo: "cracha", x: 1080, y: 376 },
      { tipo: "cracha", x: 1900, y: 376 },
      { tipo: "cracha", x: 2540, y: 376 },
      { tipo: "cracha", x: 3200, y: 376 },
      { tipo: "cracha", x: 3700, y: 376 }
    ],
    npc: { x: 130, y: 374 },
    licao: {
      titulo: "Primeiro dia concluído!",
      itens: [
        "Perguntar acelera o aprendizado",
        "Anotar e compartilhar o que você aprendeu",
        "Errar faz parte; esconder o erro, não"
      ]
    },
    // A meta fica no fim do percurso.
    meta: { x: 3900, y: 345 }
  },
  {
    id: 2,
    nome: "O Plano",
    largura: 5000,
    corFundo: "#1a1a2e",
    // Divisões lógicas da fase; o chão permanece contínuo entre as salas.
    salas: [
      { nome: "Sala 1", inicio: 0, fim: 1600 },
      { nome: "Sala 2", inicio: 1600, fim: 3200 },
      { nome: "Sala 3", inicio: 3200, fim: 5000 }
    ],
    plataformas: [
      // Sete plataformas opcionais, todas dentro da altura de salto atual.
      { x: 380, y: 300, largura: 180, altura: 18 },
      { x: 950, y: 270, largura: 180, altura: 18 },
      { x: 1530, y: 315, largura: 180, altura: 18 },
      { x: 2150, y: 280, largura: 180, altura: 18 },
      { x: 2780, y: 305, largura: 180, altura: 18 },
      { x: 3430, y: 270, largura: 180, altura: 18 },
      { x: 4140, y: 310, largura: 180, altura: 18 },
      { x: 4340, y: 280, largura: 160, altura: 18 }
    ],
    inimigos: [],
    coletaveis: [],
    // Checkpoints no começo das salas 2 e 3; y é o centro do marcador.
    checkpoints: [
      { x: 1616, y: 378 },
      { x: 3216, y: 378 }
    ],
    // A TI fica perto do interruptor na Sala 3; o diálogo usa NPC_DIALOGS[2].
    npc: { x: 3670, y: 374 },
    // As cinco barras compartilham o mesmo ciclo; atraso as acende em sequência.
    lasers: [
      { id: "onda_sala2_1", tipo: "intermitente", x: 1700, y: 348, largura: 90, altura: 12,
        atraso: 0, tempoLigado: 900, ciclo: 5200 },
      { id: "onda_sala2_2", tipo: "intermitente", x: 1840, y: 348, largura: 90, altura: 12,
        atraso: 400, tempoLigado: 900, ciclo: 5200 },
      { id: "onda_sala2_3", tipo: "intermitente", x: 1980, y: 348, largura: 90, altura: 12,
        atraso: 800, tempoLigado: 900, ciclo: 5200 },
      { id: "onda_sala2_4", tipo: "intermitente", x: 2120, y: 348, largura: 90, altura: 12,
        atraso: 1200, tempoLigado: 900, ciclo: 5200 },
      { id: "onda_sala2_5", tipo: "intermitente", x: 2260, y: 348, largura: 90, altura: 12,
        atraso: 1600, tempoLigado: 900, ciclo: 5200 },
      // Este laser sobe e desce ao lado da seção elevada da Sala 2.
      { id: "movel_vertical_sala2", tipo: "movel", x: 2500, y: 300, largura: 18, altura: 100,
        eixo: "y", alcance: 80, velocidade: 55 },
      // Este laser patrulha horizontalmente sobre a plataforma da Sala 2.
      { id: "movel_horizontal_sala2", tipo: "movel", x: 2860, y: 245, largura: 100, altura: 14,
        eixo: "x", alcance: 200, velocidade: 70 },
      // A onda final da Sala 3 mantém um intervalo seguro entre ciclos.
      { id: "onda_sala3_1", tipo: "intermitente", x: 3300, y: 348, largura: 90, altura: 12,
        atraso: 0, tempoLigado: 900, ciclo: 5200 },
      { id: "onda_sala3_2", tipo: "intermitente", x: 3440, y: 348, largura: 90, altura: 12,
        atraso: 400, tempoLigado: 900, ciclo: 5200 },
      { id: "onda_sala3_3", tipo: "intermitente", x: 3580, y: 348, largura: 90, altura: 12,
        atraso: 800, tempoLigado: 900, ciclo: 5200 },
      // Patrulha mais rápida entre o interruptor e o corredor final.
      { id: "movel_rapido_sala3", tipo: "movel", x: 3790, y: 290, largura: 18, altura: 100,
        eixo: "y", alcance: 80, velocidade: 120 },
      // Quatro barreiras altas, quase encostadas, formam o corredor final.
      { id: "corredor_fixo_1", tipo: "fixo", x: 3840, y: 265, largura: 20, altura: 250 },
      { id: "corredor_fixo_2", tipo: "fixo", x: 3868, y: 265, largura: 20, altura: 250 },
      { id: "corredor_fixo_3", tipo: "fixo", x: 3896, y: 265, largura: 20, altura: 250 },
      { id: "corredor_fixo_4", tipo: "fixo", x: 3924, y: 265, largura: 20, altura: 250 }
    ],
    interruptores: [
      { id: "interruptor_ti", x: 3740, y: 374,
        desliga: ["corredor_fixo_1", "corredor_fixo_2", "corredor_fixo_3", "corredor_fixo_4"],
        duracao: 6000 }
    ],
    // O cofre fica logo após o corredor; daqui até a saída não há lasers.
    cofre: { x: 4000, y: 358 },
    // A saída é desenhada como um retângulo verde pela lógica do jogo.
    meta: { x: 4900, y: 358 }
  }
];
