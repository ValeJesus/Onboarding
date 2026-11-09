// Efeitos originais sintetizados em Web Audio; não depende de arquivos externos.
window.EFEITOS_JOGO = (() => {
  const AudioContextJogo = window.AudioContext || window.webkitAudioContext;
  let contexto = null;
  let silenciado = false;

  const sequencias = {
    pulo: [
      { inicio: 340, fim: 520, duracao: 0.075, ganho: 0.026, onda: "triangle" }
    ],
    pista: [
      { inicio: 660, fim: 790, duracao: 0.09, ganho: 0.032, onda: "sine" },
      { inicio: 880, fim: 1120, duracao: 0.12, atraso: 0.075, ganho: 0.026, onda: "triangle" }
    ],
    acesso: [
      { inicio: 440, fim: 520, duracao: 0.09, ganho: 0.03, onda: "triangle" },
      { inicio: 660, fim: 820, duracao: 0.14, atraso: 0.085, ganho: 0.034, onda: "sine" }
    ],
    dispersao: [
      { inicio: 520, fim: 280, duracao: 0.11, ganho: 0.025, onda: "triangle" },
      { inicio: 360, fim: 220, duracao: 0.09, atraso: 0.035, ganho: 0.018, onda: "sine" }
    ],
    dano: [
      { inicio: 260, fim: 150, duracao: 0.18, ganho: 0.035, onda: "triangle" }
    ],
    checkpoint: [
      { inicio: 587, fim: 660, duracao: 0.11, ganho: 0.026, onda: "sine" },
      { inicio: 784, fim: 880, duracao: 0.14, atraso: 0.09, ganho: 0.03, onda: "triangle" }
    ],
    interruptor: [
      { inicio: 390, fim: 390, duracao: 0.055, ganho: 0.025, onda: "square" },
      { inicio: 620, fim: 760, duracao: 0.13, atraso: 0.07, ganho: 0.028, onda: "sine" }
    ],
    projeto: [
      { inicio: 523, fim: 523, duracao: 0.13, ganho: 0.026, onda: "triangle" },
      { inicio: 659, fim: 659, duracao: 0.13, atraso: 0.1, ganho: 0.026, onda: "triangle" },
      { inicio: 784, fim: 988, duracao: 0.22, atraso: 0.2, ganho: 0.032, onda: "sine" }
    ],
    vitoria: [
      { inicio: 523, fim: 523, duracao: 0.12, ganho: 0.024, onda: "triangle" },
      { inicio: 659, fim: 659, duracao: 0.12, atraso: 0.1, ganho: 0.024, onda: "triangle" },
      { inicio: 784, fim: 784, duracao: 0.15, atraso: 0.2, ganho: 0.026, onda: "triangle" },
      { inicio: 1047, fim: 1175, duracao: 0.28, atraso: 0.32, ganho: 0.03, onda: "sine" }
    ],
    gameover: [
      { inicio: 220, fim: 165, duracao: 0.2, ganho: 0.034, onda: "triangle" },
      { inicio: 165, fim: 110, duracao: 0.3, atraso: 0.19, ganho: 0.03, onda: "sine" }
    ]
  };

  function preparar() {
    if (!AudioContextJogo) return;
    try {
      if (!contexto) contexto = new AudioContextJogo();
      if (contexto.state === "suspended") contexto.resume().catch(() => {});
    } catch (erro) {
      // A falta de suporte a Web Audio não impede o jogo de continuar.
    }
  }

  function tocar(nome) {
    const notas = sequencias[nome];
    if (!AudioContextJogo || silenciado || !notas) return;

    try {
      preparar();
      const agora = contexto.currentTime;

      for (const nota of notas) {
        const oscilador = contexto.createOscillator();
        const volume = contexto.createGain();
        const inicio = agora + (nota.atraso || 0);
        const fim = inicio + nota.duracao;
        oscilador.type = nota.onda;
        oscilador.frequency.setValueAtTime(nota.inicio, inicio);
        if (nota.fim !== nota.inicio) {
          oscilador.frequency.exponentialRampToValueAtTime(Math.max(1, nota.fim), fim);
        }
        volume.gain.setValueAtTime(0.0001, inicio);
        volume.gain.linearRampToValueAtTime(nota.ganho, inicio + 0.012);
        volume.gain.exponentialRampToValueAtTime(0.0001, fim);
        oscilador.connect(volume);
        volume.connect(contexto.destination);
        oscilador.start(inicio);
        oscilador.stop(fim + 0.015);
      }
    } catch (erro) {
      // A falta de suporte a Web Audio não impede o jogo de continuar.
    }
  }

  function alternarSilencio() {
    silenciado = !silenciado;
    return !silenciado;
  }

  return { preparar, tocar, alternarSilencio, estaSilenciado: () => silenciado };
})();
