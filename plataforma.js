/* Login, sessão e progresso do onboarding. Tudo fica no localStorage do navegador. */
const USUARIOS = [
  { usuario: 'colaborador', senha: 'colab123', papel: 'colaborador', nome: 'Lucas Almeida' },
  { usuario: 'colaborador2', senha: 'colab456', papel: 'colaborador', nome: 'Beatriz Costa' },
  { usuario: 'supervisor',  senha: 'super123', papel: 'supervisor',  nome: 'Ana Ribeiro' }
];

const Auth = {
  chave: 'gerenciador-sessao-v1',
  sessao() { try { return JSON.parse(localStorage.getItem(this.chave)); } catch (e) { return null; } },
  entrar(usuario, senha) {
    const u = USUARIOS.find((x) => x.usuario === usuario.trim().toLowerCase() && x.senha === senha);
    if (!u) return null;
    const s = { usuario: u.usuario, papel: u.papel, nome: u.nome };
    try { localStorage.setItem(this.chave, JSON.stringify(s)); } catch (e) { return null; }
    return s;
  },
  sair() { try { localStorage.removeItem(this.chave); } catch (e) {} location.href = 'login.html'; },
  destino(papel) { return papel === 'supervisor' ? 'supervisor.html' : 'index.html'; },
  // Redireciona quem não está logado, ou está na página do outro perfil.
  exigir(papel) {
    const s = this.sessao();
    if (!s) { location.replace('login.html'); return null; }
    if (s.papel !== papel) { location.replace(this.destino(s.papel)); return null; }
    return s;
  }
};

const Progresso = {
  chave: (u) => 'onboarding-progresso-v1:' + u,
  vazio: () => ({ iniciadoEm: null, ultimaAtividade: null, faseAtual: null, totalFases: 2, concluido: false, fases: {}, eventos: [] }),
  ler(u) {
    try { const p = JSON.parse(localStorage.getItem(this.chave(u))); if (p && p.fases) return p; } catch (e) {}
    return this.vazio();
  },
  salvar(u, p) { try { localStorage.setItem(this.chave(u), JSON.stringify(p)); } catch (e) {} },
  limpar(u) { try { localStorage.removeItem(this.chave(u)); } catch (e) {} },
  rotulo(id, f) { return 'Fase ' + id + (f && f.nome && f.nome !== 'Fase ' + id ? ' · ' + f.nome : ''); },

  // Recebe os eventos enviados pelo jogo (postMessage) e atualiza o progresso salvo.
  registrar(d, u) {
    const p = this.ler(u), agora = Date.now();
    if (d.totalFases) p.totalFases = d.totalFases;
    let f = p.fases[d.fase];
    if (!f) f = p.fases[d.fase] = { status: 'andamento', nome: '', tentativas: 0, gameOvers: 0, vidasPerdidas: 0,
      duvidas: 0, totalDuvidas: 0, crachas: 0, totalCrachas: 0, checkpoints: 0, totalCheckpoints: 0,
      temCofre: false, projeto: false, tempoMs: null };
    const feita = f.status === 'concluida';
    const nome = this.rotulo(d.fase, f);
    const log = (texto) => { p.eventos.push({ t: agora, fase: d.fase, texto }); if (p.eventos.length > 80) p.eventos.shift(); };

    if (d.tipo === 'fase_inicio') {
      if (!p.iniciadoEm) p.iniciadoEm = agora;
      p.faseAtual = d.fase; f.tentativas++;
      f.nome = d.nome || f.nome; f.totalDuvidas = d.totalDuvidas; f.totalCrachas = d.totalCrachas;
      f.totalCheckpoints = d.totalCheckpoints; f.temCofre = !!d.temCofre;
      if (!feita) { f.duvidas = 0; f.crachas = 0; f.checkpoints = 0; f.projeto = false; }
      log(f.tentativas > 1 ? `Recomeçou: ${this.rotulo(d.fase, f)} (tentativa ${f.tentativas})` : `Iniciou ${this.rotulo(d.fase, f)}`);
    } else if (!feita) {
      if (d.tipo === 'coleta') {
        const novaDuvida = d.duvidas > f.duvidas;
        f.duvidas = d.duvidas; f.crachas = d.crachas;
        log(novaDuvida ? `Coletou uma dúvida (${d.duvidas}/${f.totalDuvidas})` : `Coletou um crachá (${d.crachas}/${f.totalCrachas})`);
      } else if (d.tipo === 'vida') {
        f.vidasPerdidas++; log(`Perdeu uma vida (restam ${d.vidas})`);
      } else if (d.tipo === 'game_over') {
        f.gameOvers++; log('Game over');
      } else if (d.tipo === 'checkpoint') {
        f.checkpoints = d.indice; log(`Checkpoint ${d.indice}/${d.total}`);
      } else if (d.tipo === 'projeto') {
        f.projeto = true; log('Pegou o projeto no cofre');
      } else if (d.tipo === 'fase_concluida') {
        f.status = 'concluida'; f.tempoMs = d.duracaoMs; f.vidasRestantes = d.vidas;
        f.duvidas = d.duvidas; f.crachas = d.crachas; f.concluidaEm = agora;
        log(`Concluiu ${nome}`);
        if (d.ultima) { p.concluido = true; p.concluidoEm = agora; log('Concluiu o onboarding 🎉'); }
      }
    }
    p.ultimaAtividade = agora;
    this.salvar(u, p);
    return p;
  },

  percentual(p) {
    const n = p.totalFases || 2;
    let soma = 0;
    for (let i = 1; i <= n; i++) {
      const f = p.fases[i];
      if (!f) continue;
      if (f.status === 'concluida') { soma += 1; continue; }
      const tot = f.totalDuvidas + f.totalCrachas + f.totalCheckpoints + (f.temCofre ? 1 : 0);
      const fei = f.duvidas + f.crachas + f.checkpoints + (f.projeto ? 1 : 0);
      soma += tot ? Math.min(0.95, fei / tot) : 0;
    }
    return Math.round((soma * 100) / n);
  }
};

const fmtTempo = (ms) => {
  if (ms == null) return '—';
  const s = Math.round(ms / 1000);
  return Math.floor(s / 60) + 'min ' + String(s % 60).padStart(2, '0') + 's';
};
const fmtQuando = (t) => {
  if (!t) return '—';
  const d = Date.now() - t;
  if (d < 60000) return 'agora há pouco';
  if (d < 3600000) return 'há ' + Math.floor(d / 60000) + ' min';
  if (d < 86400000) return 'há ' + Math.floor(d / 3600000) + ' h';
  return new Date(t).toLocaleDateString('pt-BR');
};

/* Tarefas ("atividades na empresa") de cada colaborador, usadas pelo Gerenciador e pelo painel do supervisor. */
const Tarefas = {
  nomes: {
    status:     { pendente: 'Pendente', ativo: 'Ativo', concluido: 'Concluído' },
    prioridade: { baixa: 'Baixa', media: 'Média', alta: 'Alta', urgente: 'Urgente' },
    categoria:  { trabalho: 'Trabalho', pessoal: 'Pessoal', ideia: 'Ideia', estudo: 'Estudo' }
  },
  chave: (u) => 'gerenciador-itens-v1:' + u,
  exemplos(u) {
    const agora = Date.now(), dia = 86400000;
    if (u === 'colaborador2') return [
      { id: 1, titulo: 'Treinamento de segurança da informação', descricao: 'Concluir o módulo obrigatório da plataforma de cursos', status: 'pendente', prioridade: 'urgente', categoria: 'estudo', criado: agora },
      { id: 2, titulo: 'Revisar relatório mensal', descricao: 'Conferir os números do time antes de enviar à gestão', status: 'ativo', prioridade: 'alta', categoria: 'trabalho', criado: agora - dia },
      { id: 3, titulo: 'Alinhamento com o time de design', descricao: 'Reunião para definir o escopo da próxima campanha', status: 'pendente', prioridade: 'media', categoria: 'trabalho', criado: agora - 2 * dia },
      { id: 4, titulo: 'Ler o manual do cliente', descricao: 'Entender processos e vocabulário da conta principal', status: 'ativo', prioridade: 'baixa', categoria: 'estudo', criado: agora - 3 * dia },
      { id: 5, titulo: 'Organizar pasta de contratos', descricao: 'Padronizar nomes e arquivar os contratos de 2026', status: 'concluido', prioridade: 'media', categoria: 'trabalho', criado: agora - 4 * dia }
    ];
    return [
      { id: 1, titulo: 'Reunião com cliente', descricao: 'Apresentação da proposta de marketing digital', status: 'pendente', prioridade: 'urgente', categoria: 'trabalho', criado: agora },
      { id: 2, titulo: 'Estudar TypeScript', descricao: 'Completar o módulo avançado de tipos genéricos', status: 'ativo', prioridade: 'media', categoria: 'estudo', criado: agora - dia },
      { id: 3, titulo: 'Backup do servidor', descricao: 'Realizar backup completo dos dados de produção', status: 'concluido', prioridade: 'alta', categoria: 'trabalho', criado: agora - 2 * dia },
      { id: 4, titulo: 'Lista de compras', descricao: 'Itens para o escritório: cadernos, canetas, post-its', status: 'pendente', prioridade: 'baixa', categoria: 'pessoal', criado: agora - 3 * dia }
    ];
  },
  ler(u) {
    const tenta = (k) => { try { const v = JSON.parse(localStorage.getItem(k)); return Array.isArray(v) ? v : null; } catch (e) { return null; } };
    // 'colaborador' aproveita os itens salvos antes de existir um espaço por usuário
    return tenta(this.chave(u)) || (u === 'colaborador' ? tenta('gerenciador-itens-v1') : null) || this.exemplos(u);
  }
};
