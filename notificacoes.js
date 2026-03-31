/* =============================================
   notificacoes.js — Notification engine
   ============================================= */

let NOTIFICACOES  = [];
let _notifIdSeq   = 100;

function gerarNotificacoes() {
  NOTIFICACOES = [];
  const agora = Date.now();
  const ago   = min => agora - min * 60000;

  MAQUINAS.filter(m => m.status === 'parado').forEach(m => {
    addNotif('critica', `Máquina Parada — ${m.id}`, `${m.nome} (${m.cat}) está parada. Verifique OS corretiva pendente.`, ago(180));
  });
  MAQUINAS.filter(m => m.status === 'manutencao').forEach(m => {
    addNotif('alerta', `Em Manutenção — ${m.id}`, `${m.nome} está em manutenção programada.`, ago(60));
  });
  SUPRIMENTOS.filter(s => (s.qtd / s.min) * 100 < 30).forEach(s => {
    addNotif('critica', `Estoque Crítico — ${s.nome}`, `Atual: ${s.qtd} ${s.un} (mínimo: ${s.min} ${s.un}). Reabastecer urgente.`, ago(65));
  });
  SUPRIMENTOS.filter(s => { const p = (s.qtd / s.min) * 100; return p >= 30 && p < 60; }).forEach(s => {
    addNotif('alerta', `Estoque Baixo — ${s.nome}`, `Atual: ${s.qtd} ${s.un} (mínimo: ${s.min} ${s.un}).`, ago(120));
  });
  OS_LIST.filter(o => o.status === 'pendente').forEach(o => {
    addNotif('alerta', `Manutenção Pendente — ${o.id}`, `${o.maq} · ${o.mecanico} · Prioridade: ${o.prior.toUpperCase()}`, ago(2 * 60 * 24));
  });
  OS_LIST.filter(o => o.status === 'exec').forEach(o => {
    addNotif('info', `Serviço em Execução — ${o.id}`, `${o.maq} · ${o.mecanico} iniciou a ${o.tipo}.`, ago(45));
  });
  OS_LIST.filter(o => o.status === 'concluido').forEach(o => {
    addNotif('sucesso', `Serviço Concluído — ${o.id}`, `${o.maq} · ${o.mecanico} finalizou a ${o.tipo}.`, ago(120));
  });
}

function addNotif(tipo, msg, detalhe, ts) {
  NOTIFICACOES.push({ id: ++_notifIdSeq, tipo, msg, detalhe, ts, lida: false });
}

function pushNotif(tipo, msg, detalhe) {
  addNotif(tipo, msg, detalhe, Date.now());
  atualizarBadgeSidebar();
}

function naoLidasCount() {
  return NOTIFICACOES.filter(n => !n.lida).length;
}

function atualizarBadgeSidebar() {
  const count   = naoLidasCount();
  const badge   = document.querySelector('.nav-item.notif-dot .nav-badge, .notif-dot .nav-badge');
  if (badge) {
    badge.textContent    = count || '';
    badge.style.display  = count ? '' : 'none';
  }
  const badgeEl = document.getElementById('notif-count-badge');
  if (badgeEl) {
    badgeEl.textContent   = count ? `${count} não lida${count > 1 ? 's' : ''}` : '';
    badgeEl.style.display = count ? '' : 'none';
  }
}

function renderNotificacoes() {
  const filtro = document.getElementById('notif-filtro')?.value || 'todas';
  let lista    = [...NOTIFICACOES].sort((a, b) => b.ts - a.ts);
  if (filtro === 'nao-lidas')  lista = lista.filter(n => !n.lida);
  else if (filtro !== 'todas') lista = lista.filter(n => n.tipo === filtro);

  const el      = document.getElementById('notif-list');
  const emptyEl = document.getElementById('notif-empty');
  if (!el) return;

  if (!lista.length) {
    el.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    atualizarBadgeSidebar();
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';

  const iconSvg = {
    critica: '<path d="M12 2L1 21h22M12 6l7.5 13h-15M11 10v4h2v-4m0 6v2h-2v-2"/>',
    alerta:  '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 5h-2v6h2V7zm0 8h-2v2h2v-2z"/>',
    info:    '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>',
    sucesso: '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>',
  };
  const iconCls  = { critica:'notif-red', alerta:'notif-amber', info:'notif-blue', sucesso:'notif-green' };
  const tipoLabel = { critica:'Crítica', alerta:'Alerta', info:'Informação', sucesso:'Concluído' };

  el.innerHTML = lista.map(n => {
    const mins  = Math.round((Date.now() - n.ts) / 60000);
    const tempo = mins < 60 ? `Há ${mins} min` : mins < 1440 ? `Há ${Math.round(mins / 60)}h` : `Há ${Math.round(mins / 1440)}d`;
    return `
    <div class="notification-item${n.lida ? ' lida' : ''}" id="notif-item-${n.id}">
      <div class="notif-unread-dot${n.lida ? ' hidden' : ''}"></div>
      <div class="notif-icon ${iconCls[n.tipo] || 'notif-blue'}">
        <svg viewBox="0 0 24 24" fill="currentColor">${iconSvg[n.tipo] || iconSvg.info}</svg>
      </div>
      <div class="notif-body">
        <div class="notif-msg">${n.msg}</div>
        <div class="notif-detail">${n.detalhe}</div>
        <div class="notif-time">${tempo} · ${tipoLabel[n.tipo] || ''}</div>
        ${!n.lida ? `<div class="notif-actions"><button class="notif-action-btn" onclick="marcarLida(${n.id})">Marcar como lida</button></div>` : ''}
      </div>
      <button class="notif-dismiss" onclick="dispensarNotif(${n.id})" title="Dispensar">×</button>
    </div>`;
  }).join('');

  atualizarBadgeSidebar();
}

function marcarLida(id) {
  const n = NOTIFICACOES.find(n => n.id === id);
  if (n) n.lida = true;
  renderNotificacoes();
}

function dispensarNotif(id) {
  NOTIFICACOES = NOTIFICACOES.filter(n => n.id !== id);
  renderNotificacoes();
}

function marcarTodasLidas() {
  NOTIFICACOES.forEach(n => n.lida = true);
  renderNotificacoes();
  showToast('Todas as notificações marcadas como lidas.');
}

function limparLidas() {
  NOTIFICACOES = NOTIFICACOES.filter(n => !n.lida);
  renderNotificacoes();
  showToast('Notificações lidas removidas.');
}
