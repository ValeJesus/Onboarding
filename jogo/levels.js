// Cada objeto descreve uma fase. Para adicionar outra, inclua um novo objeto
// nesta lista; o game.js avança pela ordem dos itens.
window.LEVELS = [
  {
    id: 1,
    nome: "Observar",
    largura: 6000,
    // Prateleiras pontuais: início, trechos de salto e saídas das escadarias.
    plataformas: [
      { x: 430, y: 250, largura: 150, altura: 18 },
      { x: 1040, y: 250, largura: 170, altura: 18 },
      { x: 1970, y: 250, largura: 170, altura: 18 },
      { x: 2670, y: 250, largura: 180, altura: 18 },
      { x: 3970, y: 250, largura: 160, altura: 18 },
      { x: 4940, y: 250, largura: 160, altura: 18 }
    ],
    // x é o centro da patrulha; alcance é a largura total do percurso.
    inimigos: [
      { tipo: "confusao", x: 700, y: 374, alcance: 150 },
      // Estas Distrações patrulham sobre a prateleira, de ponta a ponta.
      { tipo: "confusao", x: 1125, y: 234, alcance: 120 },
      { tipo: "confusao", x: 2055, y: 234, alcance: 120 },
      { tipo: "confusao", x: 2760, y: 234, alcance: 130 },
      { tipo: "confusao", x: 3450, y: 374, alcance: 150 },
      { tipo: "confusao", x: 4050, y: 234, alcance: 110 },
      { tipo: "confusao", x: 4270, y: 374, alcance: 120 },
      { tipo: "confusao", x: 5550, y: 374, alcance: 150 }
    ],
    // Estantes destacadas fazem o papel dos canos, variando altura e agrupamento.
    obstaculos: [
      { x: 940, largura: 62, altura: 56 },
      { x: 1500, largura: 68, altura: 68 },
      { x: 1600, largura: 64, altura: 58 },
      { x: 2280, largura: 68, altura: 82 },
      { x: 2380, largura: 62, altura: 54 },
      { x: 3100, largura: 72, altura: 72 },
      { x: 3600, largura: 62, altura: 56 },
      { x: 4400, largura: 68, altura: 76 },
      { x: 4500, largura: 64, altura: 58 },
      { x: 5200, largura: 62, altura: 58 },
      { x: 5750, largura: 70, altura: 82 }
    ],
    // Cada escada é feita de pilhas de caixas tampadas, com pequenos vãos entre pilhas.
    escadas: [
      { x: 1780, caixasPorDegrau: [1, 2, 3, 4], larguraCaixa: 42, alturaCaixa: 30, gaps: [8, 8, 16] },
      { x: 3740, caixasPorDegrau: [1, 2, 3, 4], larguraCaixa: 42, alturaCaixa: 30, gaps: [8, 8, 16] },
      { x: 4640, caixasPorDegrau: [1, 2, 3, 4], larguraCaixa: 42, alturaCaixa: 30, gaps: [8, 8, 16] }
    ],
    coletaveis: [
      { tipo: "duvida", x: 400, y: 368 },
      { tipo: "duvida", x: 1500, y: 300 },
      { tipo: "duvida", x: 2380, y: 314 },
      { tipo: "duvida", x: 3898, y: 248 },
      { tipo: "duvida", x: 5200, y: 310 },
      { tipo: "cracha", x: 500, y: 376 },
      { tipo: "cracha", x: 1200, y: 376 },
      { tipo: "cracha", x: 2200, y: 376 },
      { tipo: "cracha", x: 3000, y: 376 },
      { tipo: "cracha", x: 3670, y: 376 },
      { tipo: "cracha", x: 4570, y: 376 },
      { tipo: "cracha", x: 5350, y: 376 }
    ],
    npc: { x: 130, y: 374 },
    licao: {
      titulo: "Reconhecimento concluído!",
      itens: [
        "Observar antes de agir",
        "Aprender com quem já sabe",
        "Perguntar e anotar",
        "Errar faz parte; esconder o erro, não"
      ]
    },
    // A meta fica no fim do percurso.
    meta: { x: 5900, y: 345 }
  },
  {
    id: 2,
    nome: "Executar",
    largura: 5000,
    corFundo: "#1a1a2e",
    // Divisões lógicas da fase; o chão permanece contínuo entre as salas.
    salas: [
      { nome: "Sala 1", inicio: 0, fim: 1600 },
      { nome: "Sala 2", inicio: 1600, fim: 3200 },
      { nome: "Sala 3", inicio: 3200, fim: 5000 }
    ],
    plataformas: [
      // Superfícies sólidas em pontos seguros; o personagem passa por baixo delas.
      { x: 420, y: 250, largura: 160, altura: 18 },
      { x: 1080, y: 250, largura: 180, altura: 18 },
      { x: 1430, y: 250, largura: 160, altura: 18 },
      { x: 2320, y: 250, largura: 160, altura: 18 },
      { x: 3020, y: 250, largura: 160, altura: 18 },
      { x: 4280, y: 250, largura: 180, altura: 18 }
    ],
    // Obstáculos do retorno após o cofre: racks técnicos e caixas de equipamento escalonadas.
    obstaculos: [
      { x: 4210, largura: 68, altura: 64 },
      { x: 4690, largura: 72, altura: 70 }
    ],
    escadas: [
      { x: 4350, caixasPorDegrau: [1, 2, 3, 2], larguraCaixa: 46,
        alturaCaixa: 28, gaps: [18, 20, 32, 0] }
    ],
    // Drones de observação e robôs de segurança patrulham os pontos de acesso.
    inimigos: [
      { tipo: "confusao", arte: "drone", x: 500, y: 234, alcance: 110 },
      { tipo: "confusao", arte: "robo", x: 1510, y: 234, alcance: 110 },
      { tipo: "confusao", arte: "drone", x: 2400, y: 234, alcance: 110 },
      { tipo: "confusao", arte: "robo", x: 4370, y: 234, alcance: 130 }
    ],
    // Checkpoints no começo das salas 2 e 3; y é o centro do marcador.
    checkpoints: [
      { x: 1616, y: 378 },
      { x: 3216, y: 378 }
    ],
    // A única dica coletável fica sobre a plataforma antes do técnico de TI.
    coletaveis: [
      { tipo: "duvida", x: 3020, y: 229,
        texto: "Converse com pessoas de outros setores: elas podem trazer informações e perspectivas úteis para o projeto." }
    ],
    // A TI fica perto do interruptor na Sala 3; o diálogo usa NPC_DIALOGS[2].
    npc: { x: 3670, y: 374 },
    // Ondas horizontais e pares verticais usam ciclos independentes para sincronizar a travessia.
    lasers: [
      // Duas barreiras verticais alternam a janela de passagem na Sala 1.
      { id: "portao_vertical_sala1_a", tipo: "intermitente", x: 800, y: 310, largura: 18, altura: 160,
        atraso: 0, tempoLigado: 2000, ciclo: 6000 },
      { id: "portao_vertical_sala1_b", tipo: "intermitente", x: 1000, y: 310, largura: 18, altura: 160,
        atraso: 3000, tempoLigado: 2000, ciclo: 6000 },
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
      // Outro par de portões no trecho seguinte alterna o ritmo de travessia.
      { id: "portao_vertical_sala2_a", tipo: "intermitente", x: 2570, y: 310, largura: 18, altura: 160,
        atraso: 1200, tempoLigado: 2000, ciclo: 6000 },
      { id: "portao_vertical_sala2_b", tipo: "intermitente", x: 2670, y: 310, largura: 18, altura: 160,
        atraso: 4200, tempoLigado: 2000, ciclo: 6000 },
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
    // O cofre fica logo após o corredor; os obstáculos do retorno ficam no trecho até a saída.
    cofre: { x: 4000, y: 358 },
    licao: {
      titulo: "Execução concluída!",
      itens: [
        "Observar lasers — Planejar antes de agir",
        "Acionar colega de TI — Pedir ajuda e comunicar",
        "Checkpoint, cofre e fuga — Retomar erros e entregar no prazo"
      ]
    },
    // A saída é desenhada como um retângulo verde pela lógica do jogo.
    meta: { x: 4900, y: 358 }
  }
];
