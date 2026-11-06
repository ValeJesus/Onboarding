/* Gerenciador — dados salvos no localStorage do navegador */

const NOMES = {
  status:     { pendente: 'Pendente', ativo: 'Ativo', concluido: 'Concluído' },
  prioridade: { baixa: 'Baixa', media: 'Média', alta: 'Alta', urgente: 'Urgente' },
  categoria:  { trabalho: 'Trabalho', pessoal: 'Pessoal', ideia: 'Ideia', estudo: 'Estudo' }
};
const COR_STATUS = { pendente: '#e09400', ativo: '#1f6fd6', concluido: '#0e8a5f' };
const COR_PRIO   = { baixa: '#9aa0ad', media: '#1f6fd6', alta: '#5b34f5', urgente: '#c0332e' };
const COR_CAT    = { trabalho: '#55555f', pessoal: '#5b34f5', ideia: '#e09400', estudo: '#1f6fd6' };
const PROXIMO    = { pendente: 'ativo', ativo: 'concluido', concluido: 'pendente' };
const ICONE_ST   = { pendente: 'clock', ativo: 'circle', concluido: 'check' };
const DIA = 24 * 60 * 60 * 1000;
const CHAVE = 'gerenciador-itens-v1';

const $ = (id) => document.getElementById(id);
const ico = (nome) => `<svg class="ico"><use href="#i-${nome}"/></svg>`;
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/* ---------- dados ---------- */
function exemplos() {
  const agora = Date.now();
  return [
    { id: 1, titulo: 'Reunião com cliente', descricao: 'Apresentação da proposta de marketing digital', status: 'pendente',  prioridade: 'urgente', categoria: 'trabalho', criado: agora },
    { id: 2, titulo: 'Estudar TypeScript',  descricao: 'Completar o módulo avançado de tipos genéricos', status: 'ativo',     prioridade: 'media',   categoria: 'estudo',   criado: agora - 1 * DIA },
    { id: 3, titulo: 'Backup do servidor',  descricao: 'Realizar backup completo dos dados de produção', status: 'concluido', prioridade: 'alta',    categoria: 'trabalho', criado: agora - 2 * DIA },
    { id: 4, titulo: 'Lista de compras',    descricao: 'Itens para o escritório: cadernos, canetas, post-its', status: 'pendente', prioridade: 'baixa', categoria: 'pessoal', criado: agora - 3 * DIA }
  ];
}

function carregar() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE));
    if (Array.isArray(salvo)) return salvo;
  } catch (e) { /* ignora e usa os exemplos */ }
  return exemplos();
}

let itens = carregar();
let editandoId = null;

function salvar() {
  try { localStorage.setItem(CHAVE, JSON.stringify(itens)); } catch (e) { /* modo privado */ }
  renderTudo();
}

const contar = (campo, valor) => itens.filter((i) => i[campo] === valor).length;
const taxa = () => (itens.length ? Math.round((contar('status', 'concluido') * 100) / itens.length) : 0);
const naSemana = () => itens.filter((i) => Date.now() - i.criado < 7 * DIA).length;

/* ---------- abas ---------- */
function irPara(aba) {
  document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.dataset.aba === aba));
  document.querySelectorAll('.aba').forEach((a) => a.classList.toggle('active', a.id === 'aba-' + aba));
  window.scrollTo({ top: 0 });
}
document.querySelectorAll('[data-aba]').forEach((el) => el.addEventListener('click', () => irPara(el.dataset.aba)));

/* ---------- aba Itens ---------- */
function renderCards() {
  const total = itens.length;
  const outros = [
    ['pendente',  'Pendentes',  'amber', 'clock'],
    ['ativo',     'Ativos',     'blue',  'zap'],
    ['concluido', 'Concluídos', 'green', 'check-circle']
  ].map(([chave, rotulo, cor, icone]) => `
    <article class="stat-card">
      <div class="stat-head">
        <span class="stat-ico ${cor}">${ico(icone)}</span>
        <span class="pill">${rotulo}</span>
        <button class="stat-go" type="button" data-filtro="${chave}" title="Filtrar ${rotulo.toLowerCase()}">${ico('up-right')}</button>
      </div>
      <div class="stat-num">${contar('status', chave)}<span>itens</span></div>
    </article>`).join('');

  $('cards').innerHTML = `
    <article class="stat-card hero">
      <div class="stat-head">
        <span class="stat-ico violet">${ico('layers')}</span>
        <span class="pill">Total</span>
        <button class="stat-go" type="button" data-filtro="" title="Ver todos">${ico('down')}</button>
      </div>
      <div class="stat-num">${total}<span>itens</span></div>
      <div class="bar"><i style="width:${total ? 100 : 0}%"></i></div>
      <div class="stat-foot"><b>100%</b> do total <span class="pill sm">▲ ${naSemana()} na semana</span></div>
    </article>` + outros;
}

function renderLista() {
  const q = norm($('busca').value.trim());
  const fs = $('f-status').value;
  const fc = $('f-cat').value;

  const visiveis = itens
    .filter((i) =>
      (!q || norm(i.titulo).includes(q) || norm(i.descricao).includes(q)) &&
      (!fs || i.status === fs) &&
      (!fc || i.categoria === fc))
    .sort((a, b) => b.criado - a.criado);

  $('contagem').textContent = `${visiveis.length} ${visiveis.length === 1 ? 'ITEM' : 'ITENS'}`;
  $('rotulo-status').textContent = fs ? NOMES.status[fs] : 'Todos os status';

  if (!visiveis.length) {
    $('lista').innerHTML = `
      <div class="empty">
        <span class="empty-ico">${ico('layers')}</span>
        <h3>Nenhum item encontrado</h3>
        <p>Ajuste os filtros ou crie um novo item.</p>
      </div>`;
    return;
  }

  $('lista').innerHTML = visiveis.map((i) => `
    <article class="item ${i.status}">
      <button class="status-btn ${i.status}" type="button" data-act="status" data-id="${i.id}" title="Alterar status" aria-label="Alterar status">${ico(ICONE_ST[i.status])}</button>
      <div class="item-body">
        <h3>${esc(i.titulo)}</h3>
        ${i.descricao ? `<p>${esc(i.descricao)}</p>` : ''}
        <div class="tags">
          <span class="tag st-${i.status}"><i class="dot"></i>${NOMES.status[i.status]}</span>
          <span class="tag pr-${i.prioridade}">${NOMES.prioridade[i.prioridade]}</span>
          <span class="tag cat-${i.categoria}">${NOMES.categoria[i.categoria]}</span>
        </div>
      </div>
      <details class="menu">
        <summary aria-label="Mais opções">${ico('more')}</summary>
        <div class="menu-pop">
          <button type="button" data-act="editar" data-id="${i.id}">Editar</button>
          <button type="button" class="danger" data-act="excluir" data-id="${i.id}">Excluir</button>
        </div>
      </details>
    </article>`).join('');
}

['busca', 'f-status', 'f-cat'].forEach((id) => $(id).addEventListener('input', renderLista));

$('cards').addEventListener('click', (e) => {
  const b = e.target.closest('[data-filtro]');
  if (!b) return;
  $('f-status').value = b.dataset.filtro;
  renderLista();
});

$('lista').addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const id = Number(b.dataset.id);
  const item = itens.find((x) => x.id === id);
  if (!item) return;

  if (b.dataset.act === 'status') {
    item.status = PROXIMO[item.status];
    salvar();
  } else if (b.dataset.act === 'editar') {
    abrirModal(id);
  } else if (b.dataset.act === 'excluir') {
    if (confirm('Excluir este item?')) {
      itens = itens.filter((x) => x.id !== id);
      salvar();
    }
  }
});

// fecha o menu "..." ao clicar fora ou abrir outro
document.addEventListener('click', (e) => {
  document.querySelectorAll('.menu[open]').forEach((m) => { if (!m.contains(e.target)) m.removeAttribute('open'); });
});

/* ---------- modal ---------- */
const modal = $('modal');
const CAMPOS = { titulo: 'f-titulo', descricao: 'f-descricao', status: 'f-m-status', prioridade: 'f-m-prioridade', categoria: 'f-m-categoria' };

function abrirModal(id) {
  editandoId = id || null;
  const base = itens.find((x) => x.id === id) ||
    { titulo: '', descricao: '', status: 'pendente', prioridade: 'media', categoria: 'pessoal' };
  $('modal-title').textContent = id ? 'Editar item' : 'Novo item';
  Object.entries(CAMPOS).forEach(([k, el]) => { $(el).value = base[k]; });
  modal.showModal();
  $('f-titulo').focus();
}

$('btn-novo').addEventListener('click', () => abrirModal());
$('modal-x').addEventListener('click', () => modal.close());
$('modal-cancel').addEventListener('click', () => modal.close());
modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });

$('modal-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const dados = {};
  Object.entries(CAMPOS).forEach(([k, el]) => { dados[k] = $(el).value.trim(); });
  if (!dados.titulo) return;

  if (editandoId) {
    Object.assign(itens.find((x) => x.id === editandoId), dados);
  } else {
    itens.push({ ...dados, id: Date.now(), criado: Date.now() });
  }
  modal.close();
  salvar();
});

/* ---------- aba Análises ---------- */
function renderKpis() {
  const kpi = (icone, cor, rotulo, n, sub) => `
    <article class="card kpi">
      <div class="kpi-h"><span class="stat-ico ${cor}">${ico(icone)}</span>${rotulo}</div>
      <b>${n}</b><small>${sub}</small>
    </article>`;
  $('kpis').innerHTML =
    kpi('layers', 'violet', 'Total', itens.length, `${naSemana()} criados esta semana`) +
    kpi('check-circle', 'green', 'Concluídos', contar('status', 'concluido'), `${taxa()}% de conclusão`) +
    kpi('clock', 'amber', 'Pendentes', contar('status', 'pendente'), 'Aguardando ação') +
    kpi('activity', 'blue', 'Ativos', contar('status', 'ativo'), 'Em andamento agora');
}

function renderRosca() {
  const total = itens.length;
  const C = 2 * Math.PI * 70;
  let deslocamento = 0;
  let arcos = '';
  Object.keys(NOMES.status).forEach((k) => {
    const n = contar('status', k);
    if (!total || !n) return;
    const tam = (C * n) / total;
    arcos += `<circle cx="100" cy="100" r="70" fill="none" stroke="${COR_STATUS[k]}" stroke-width="36"
      stroke-dasharray="${tam} ${C - tam}" stroke-dashoffset="${-deslocamento}" transform="rotate(-90 100 100)"/>`;
    deslocamento += tam;
  });

  $('g-status').innerHTML = `
    <div class="donut">
      <svg viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="70" fill="none" stroke="#eef0f6" stroke-width="36"/>${arcos}
      </svg>
      <div class="donut-c"><b>${total}</b><span>ITENS</span></div>
    </div>
    <ul class="legend">
      ${Object.keys(NOMES.status).map((k) =>
        `<li><i style="background:${COR_STATUS[k]}"></i>${NOMES.status[k]}<b>${contar('status', k)}</b></li>`).join('')}
    </ul>`;
}

function renderLinha() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dias = [];
  for (let d = 13; d >= 0; d--) {
    const ini = hoje.getTime() - d * DIA;
    dias.push({
      label: new Date(ini).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      n: itens.filter((i) => i.criado >= ini && i.criado < ini + DIA).length
    });
  }
  const max = Math.max(1, ...dias.map((d) => d.n));
  const pos = dias.map((d, i) => [18 + i * (484 / 13), 180 - (d.n / max) * 150]);

  $('g-dia').innerHTML = `
    <svg class="line" viewBox="0 0 520 220">
      ${[0, 1, 2, 3].map((i) => `<line x1="10" x2="510" y1="${20 + i * 50}" y2="${20 + i * 50}" stroke="#eef0f6"/>`).join('')}
      <polyline points="${pos.map((p) => p.join(',')).join(' ')}" fill="none" stroke="#5b34f5" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
      ${pos.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="#5b34f5"><title>${dias[i].label}: ${dias[i].n}</title></circle>`).join('')}
      ${pos.map((p, i) => (i % 2 === 0 ? `<text x="${p[0]}" y="208" text-anchor="middle" class="axis">${dias[i].label}</text>` : '')).join('')}
    </svg>`;
}

function renderBarras() {
  const maxP = Math.max(1, ...Object.keys(NOMES.prioridade).map((k) => contar('prioridade', k)));
  $('g-prio').innerHTML = Object.keys(NOMES.prioridade).map((k) => {
    const n = contar('prioridade', k);
    return `<div class="hrow"><label>${NOMES.prioridade[k]}</label>
      <div class="htrack"><i style="width:${(n / maxP) * 100}%;background:${COR_PRIO[k]}"></i></div><b>${n}</b></div>`;
  }).join('');

  const maxC = Math.max(1, ...Object.keys(NOMES.categoria).map((k) => contar('categoria', k)));
  $('g-cat').innerHTML = Object.keys(NOMES.categoria).map((k) => {
    const n = contar('categoria', k);
    return `<div class="vcol"><b>${n}</b>
      <div class="vtrack"><i style="height:${(n / maxC) * 100}%;background:${COR_CAT[k]}"></i></div>
      <label>${NOMES.categoria[k]}</label></div>`;
  }).join('');
}

function renderAnalises() {
  renderKpis();
  renderRosca();
  renderLinha();
  renderBarras();
  $('taxa').innerHTML = `${ico('trend')} Taxa de conclusão atual: <b>${taxa()}%</b> dos itens criados já foram concluídos.`;
}

/* ---------- aba IA (respostas locais, sem serviço externo) ---------- */
function responder(pergunta) {
  const p = norm(pergunta);
  if (!itens.length) return 'Você ainda não tem itens. Crie o primeiro em "Novo item" e eu te ajudo a organizar.';

  const cat = Object.keys(NOMES.categoria).find((c) => p.includes(c));
  const st = /pendente/.test(p) ? 'pendente' : /ativ|andamento/.test(p) ? 'ativo' : /conclu|finaliz|feit/.test(p) ? 'concluido' : null;

  if (/taxa|percent|%|progresso/.test(p)) {
    return `A taxa de conclusão é de ${taxa()}%: ${contar('status', 'concluido')} de ${itens.length} itens concluídos. ${naSemana()} item(ns) criado(s) nos últimos 7 dias.`;
  }

  if (/sugest|organiz|dica|proximos passos|o que fazer/.test(p)) {
    const urg = itens.filter((i) => i.status !== 'concluido' && (i.prioridade === 'urgente' || i.prioridade === 'alta'));
    const ativos = itens.filter((i) => i.status === 'ativo');
    const pend = itens.filter((i) => i.status === 'pendente');
    const d = [];
    if (urg.length) d.push(`Resolva primeiro o que é urgente/alta: ${urg.slice(0, 2).map((i) => i.titulo).join(', ')}.`);
    if (ativos.length) d.push(`Termine o que já está em andamento antes de abrir novas frentes: ${ativos.slice(0, 2).map((i) => i.titulo).join(', ')}.`);
    if (pend.length) d.push(`Agrupe os pendentes num bloco único de tempo (${pend.length} aguardando ação).`);
    if (!d.length) d.push('Tudo em dia! Aproveite para planejar a próxima semana.');
    d.push('Reserve 10 minutos no fim do dia para atualizar os status.');
    return 'Sugestões para a sua semana:\n' + d.slice(0, 3).map((t, i) => `${i + 1}. ${t}`).join('\n');
  }

  if (cat || st) {
    const lista = itens.filter((i) => (!cat || i.categoria === cat) && (!st || i.status === st));
    const nome = [st && `status ${NOMES.status[st].toLowerCase()}`, cat && `categoria ${NOMES.categoria[cat].toLowerCase()}`].filter(Boolean).join(' e ');
    if (!lista.length) return `Nenhum item com ${nome} no momento.`;
    if (/quant/.test(p)) return `Você tem ${lista.length} item(ns) com ${nome}.`;
    return `Itens com ${nome} (${lista.length}):\n` + lista.map((i) => `• ${i.titulo} (${NOMES.prioridade[i.prioridade]})`).join('\n');
  }

  if (/quant|total|resumo|situac/.test(p)) {
    return `Você tem ${itens.length} itens: ${contar('status', 'pendente')} pendente(s), ${contar('status', 'ativo')} ativo(s) e ${contar('status', 'concluido')} concluído(s).`;
  }

  return 'Posso responder sobre quantidades, status, categorias, taxa de conclusão e dar sugestões. Tente: "Quantas tarefas estão pendentes?" ou "Me dê 3 sugestões para organizar minha semana."';
}

function perguntar(texto) {
  texto = texto.trim();
  if (!texto) return;
  const vazio = $('chat-empty');
  if (vazio) vazio.remove();
  const corpo = $('chat-body');
  corpo.insertAdjacentHTML('beforeend',
    `<div class="msg user">${esc(texto)}</div><div class="msg bot">${esc(responder(texto))}</div>`);
  corpo.scrollTop = corpo.scrollHeight;
  $('chat-input').value = '';
}

$('chat-form').addEventListener('submit', (e) => { e.preventDefault(); perguntar($('chat-input').value); });
document.querySelectorAll('.chip').forEach((c) => c.addEventListener('click', () => perguntar(c.textContent)));

/* ---------- início ---------- */
function renderTudo() {
  renderCards();
  renderLista();
  renderAnalises();
}
renderTudo();

/* ---------- assistente virtual (widget no canto inferior direito) ---------- */
const NOME_ASSISTENTE = 'Clara';
const CHAVE_ASSIST = 'gerenciador-assistente-v1';
const EXEMPLOS = [
  'Quais itens da categoria estudo estão ativos?',
  'Quantas tarefas estão concluídas?',
  'Me dê 3 sugestões para organizar minha semana.',
  'Qual a taxa de conclusão da semana?'
];

function lerConfigAssist() {
  try {
    const c = JSON.parse(localStorage.getItem(CHAVE_ASSIST));
    if (c && c.estilo && c.modo) return c;
  } catch (e) { /* sem configuração salva */ }
  return null;
}
function gravarConfigAssist(c) {
  try {
    if (c) localStorage.setItem(CHAVE_ASSIST, JSON.stringify(c));
    else localStorage.removeItem(CHAVE_ASSIST);
  } catch (e) { /* modo privado */ }
}

let configAssist = lerConfigAssist();
let escolha = { estilo: null, modo: null };
let telaAssist = configAssist ? 'chat' : '1';
let exemploIdx = 0;

$('assist-nome').textContent = NOME_ASSISTENTE;

function fecharMenuAssist() {
  $('assist-pop').hidden = true;
  $('assist-dots').setAttribute('aria-expanded', 'false');
}

function addMsg(texto, quem) {
  const msgs = $('assist-msgs');
  const linha = document.createElement('div');
  linha.className = 'bmsg ' + quem;
  if (quem === 'bot') {
    const av = document.createElement('span');
    av.className = 'avatar';
    linha.appendChild(av);
  }
  const bolha = document.createElement('div');
  bolha.className = 'bolha';
  bolha.textContent = texto;
  linha.appendChild(bolha);
  msgs.appendChild(linha);
  msgs.scrollTop = msgs.scrollHeight;
}

function mostrarTela(nome) {
  telaAssist = nome;
  document.querySelectorAll('.tela').forEach((t) => t.classList.toggle('active', t.dataset.tela === nome));
  $('assist-menu').hidden = nome !== 'chat';   // os três pontinhos só aparecem na conversa
  fecharMenuAssist();
  if (nome === 'chat') {
    if (!$('assist-msgs').children.length) addMsg('Perfeito! Agora já podemos conversar.\nEm que posso ajudar?', 'bot');
    $('assist-input').focus();
  }
}

function abrirAssist() {
  $('assist-panel').hidden = false;
  $('assist-fab').setAttribute('aria-expanded', 'true');
  $('assist-hint').classList.add('off');
  mostrarTela(telaAssist);
}
function fecharAssist() {
  $('assist-panel').hidden = true;
  $('assist-fab').setAttribute('aria-expanded', 'false');
  fecharMenuAssist();
}

$('assist-fab').addEventListener('click', () => ($('assist-panel').hidden ? abrirAssist() : fecharAssist()));
$('assist-hint').addEventListener('click', abrirAssist);
$('assist-hint').addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirAssist(); } });
$('assist-close').addEventListener('click', fecharAssist);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('assist-panel').hidden && !modal.open) fecharAssist(); });

// escolha das opções (telas 1 e 2)
document.querySelectorAll('.opcoes').forEach((grupo) => {
  grupo.addEventListener('click', (e) => {
    const b = e.target.closest('.opcao');
    if (!b) return;
    grupo.querySelectorAll('.opcao').forEach((o) => {
      o.classList.toggle('sel', o === b);
      o.setAttribute('aria-checked', String(o === b));
    });
    escolha[grupo.dataset.grupo] = b.dataset.valor;
    grupo.closest('.tela').querySelector('.assist-cta').disabled = false;
  });
});
$('cta-1').addEventListener('click', () => { if (escolha.estilo) mostrarTela('2'); });
$('cta-2').addEventListener('click', () => {
  if (!escolha.modo) return;
  configAssist = { ...escolha };
  gravarConfigAssist(configAssist);
  mostrarTela('chat');
});

// três pontinhos → reconfigurar
$('assist-dots').addEventListener('click', (e) => {
  e.stopPropagation();
  const abrir = $('assist-pop').hidden;
  $('assist-pop').hidden = !abrir;
  $('assist-dots').setAttribute('aria-expanded', String(abrir));
});
document.addEventListener('click', (e) => { if (!e.target.closest('#assist-menu')) fecharMenuAssist(); });
$('assist-reset').addEventListener('click', () => {
  configAssist = null;
  escolha = { estilo: null, modo: null };
  gravarConfigAssist(null);
  $('assist-msgs').innerHTML = '';
  document.querySelectorAll('.opcao').forEach((o) => { o.classList.remove('sel'); o.setAttribute('aria-checked', 'false'); });
  document.querySelectorAll('.assist-cta').forEach((b) => { b.disabled = true; });
  mostrarTela('1');
});

// conversa: usa as mesmas respostas da aba IA, ajustadas ao estilo e ao modo escolhidos
function personalizar(texto) {
  const c = configAssist || {};
  const abre = { amigavel: 'Claro! ', paciente: 'Sem pressa, vamos ver juntos. ', profissional: '' }[c.estilo] || '';
  let t = abre + texto;
  if (c.modo === 'explicacoes') t += '\n\nComo cheguei nisso: li os itens salvos neste navegador e agrupei por status, categoria e data de criação.';
  if (c.modo === 'exemplos') t += '\n\nExemplo de outra pergunta: "' + EXEMPLOS[exemploIdx++ % EXEMPLOS.length] + '"';
  return t;
}

$('assist-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const texto = $('assist-input').value.trim();
  if (!texto) return;
  $('assist-input').value = '';
  addMsg(texto, 'user');
  setTimeout(() => { if (configAssist) addMsg(personalizar(responder(texto)), 'bot'); }, 350);
});
