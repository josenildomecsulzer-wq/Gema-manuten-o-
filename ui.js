/* =============================================
   ui.js — Navigation, Modal helpers, Toast,
   Tabs, Page title mapping
   ============================================= */

// ---- Page navigation ----
function showPage(id, navEl) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (navEl && navEl.classList && navEl.classList.contains('nav-item')) {
    navEl.classList.add('active');
  } else {
    document.querySelectorAll('.nav-item').forEach(n => {
      const oc = n.getAttribute('onclick') || '';
      if (oc.includes("showPage('" + id + "'")) n.classList.add('active');
    });
  }

  const titles = {
    dashboard:      'Dashboard',
    maquinas:       'Gestão de Máquinas',
    suprimentos:    'Suprimentos & Almoxarifado',
    mecanicos:      'Equipe Técnica',
    agendamentos:   'Agendamentos de Manutenção',
    execucao:       'Execução de OS',
    relatorios:     'Relatórios & Indicadores',
    notificacoes:   'Notificações',
  };
  document.getElementById('page-title').textContent = titles[id] || id;

  if (id === 'dashboard')   setTimeout(initCharts, 50);
  if (id === 'relatorios')  setTimeout(initRelatorioCharts, 50);
  if (id === 'suprimentos') updateSupplyStats();
  if (id === 'notificacoes') { gerarNotificacoes(); renderNotificacoes(); }
}

// ---- Modal helpers ----
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// Close on backdrop click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// ---- Toast ----
function showToast(msg, type = 'success') {
  const colors = {
    success: '#10b981',
    error:   '#ef4444',
    info:    '#2563eb',
  };
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:24px;right:24px;background:${colors[type]||colors.success};color:white;padding:12px 20px;border-radius:8px;font-weight:600;font-size:13px;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.4);transition:opacity 0.3s`;
  t.textContent = (type === 'success' ? '✓ ' : '✕ ') + msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3000);
}

// ---- Tabs ----
function setTab(el, panelId) {
  if (panelId && panelId.startsWith('rel-')) {
    document.querySelectorAll('#rel-tabs .tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    ['rel-visao-geral','rel-maquinas','rel-mecanicos','rel-suprimentos','rel-mttr'].forEach(id => {
      const p = document.getElementById(id);
      if (p) p.style.display = id === panelId ? '' : 'none';
    });
    if (panelId === 'rel-visao-geral')  initRelVisaoGeral();
    if (panelId === 'rel-maquinas')     initRelMaquinas();
    if (panelId === 'rel-mecanicos')    initRelMecanicos();
    if (panelId === 'rel-suprimentos')  initRelSuprimentos();
    if (panelId === 'rel-mttr')         initRelMttr();
    return;
  }
  // Histórico tabs
  document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

function setHistTab(el, tab) {
  document.querySelectorAll('#hist-tabs .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('hist-lista').style.display         = tab === 'lista'    ? '' : 'none';
  document.getElementById('hist-timeline-view').style.display = tab === 'timeline' ? '' : 'none';
}

// ---- Badge helpers ----
function statusBadge(s) {
  const m = { ativo:'badge-active|Ativo', manutencao:'badge-manut|Em Manutenção', parado:'badge-parado|Parado' };
  const parts = (m[s] || 'badge-pendente|Indefinido').split('|');
  return `<span class="badge ${parts[0]}">${parts[1]}</span>`;
}
function statusOSBadge(s) {
  const m = { pendente:'badge-pendente|Pendente', exec:'badge-exec|Em Execução', concluido:'badge-concluido|Concluído', cancelado:'badge-cancelado|Cancelado' };
  const parts = (m[s] || 'badge-pendente|Indefinido').split('|');
  return `<span class="badge ${parts[0]}">${parts[1]}</span>`;
}
function tipoBadge(t)  { return `<span class="badge badge-${t}">${t.charAt(0).toUpperCase() + t.slice(1)}</span>`; }
function priorBadge(p) { return `<span class="badge badge-${p}">${p.charAt(0).toUpperCase() + p.slice(1)}</span>`; }
