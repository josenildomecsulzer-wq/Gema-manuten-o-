/* =============================================
   render.js — All DOM rendering functions
   ============================================= */

function renderizarTudo() {
  renderMaquinas();
  renderSuprimentos();
  renderMecanicos();
  renderOS();
  renderOSExecucao();
  renderChecklist();
  renderRelatorio();
  populateMaqSelect();
  updateSupplyStats();
  populateExecSupSelect();
  gerarNotificacoes();
  atualizarBadgeSidebar();
  setTimeout(initCharts, 100);
}

// ---- Máquinas ----
function renderMaquinas() {
  const tbody = document.getElementById('tbody-maquinas');
  if (!tbody) return;
  tbody.innerHTML = MAQUINAS.map((m, idx) => `
    <tr>
      <td class="primary"><span class="table-code">${m.id}</span></td>
      <td class="primary">${m.nome}</td>
      <td>${m.cat}</td>
      <td>${m.fab}</td>
      <td><span class="table-code">${m.serie}</span></td>
      <td>${m.aq}</td>
      <td>${m.vel} RPM</td>
      <td>${statusBadge(m.status)}</td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-outline" style="font-size:11px;padding:4px 8px" onclick="abrirOSMaquina(${idx})">OS</button>
          <button class="btn btn-outline" style="font-size:11px;padding:4px 8px" onclick="abrirHistoricoMaquina(${idx})">Histórico</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ---- Suprimentos ----
function renderSuprimentos() {
  const tbody = document.getElementById('tbody-suprimentos');
  if (!tbody) return;
  tbody.innerHTML = SUPRIMENTOS.map((s, idx) => {
    const pct      = Math.round((s.qtd / s.min) * 100);
    const isCrit   = pct < 30;
    const isLow    = pct < 60;
    const color    = isCrit ? 'var(--accent-red)' : isLow ? 'var(--accent-amber)' : 'var(--accent-green)';
    const barClass = isCrit ? 'progress-red'       : isLow ? 'progress-amber'      : 'progress-green';
    const barPct   = Math.min(pct, 100);
    return `
    <tr>
      <td><span class="table-code">${s.cod}</span></td>
      <td class="primary">${s.nome}${isCrit ? ` <span class="badge badge-estoque">CRÍTICO</span>` : ''}</td>
      <td>${s.cat}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="progress-bar" style="width:80px"><div class="progress-fill ${barClass}" style="width:${barPct}%"></div></div>
          <span style="color:${color};font-weight:700;font-size:13px">${s.qtd} ${s.un}</span>
        </div>
      </td>
      <td>${s.min} ${s.un}</td>
      <td>${s.loc}</td>
      <td>${isCrit ? `<span class="badge badge-parado">Crítico</span>` : isLow ? `<span class="badge badge-manut">Baixo</span>` : `<span class="badge badge-active">OK</span>`}</td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-outline" style="font-size:11px;padding:4px 8px" onclick="abrirEditarSuprimento(${idx})">Editar</button>
          <button class="btn btn-outline" style="font-size:11px;padding:4px 8px" onclick="abrirMovim(${idx})">Movim.</button>
          <button class="btn btn-danger"  style="font-size:11px;padding:4px 8px" onclick="abrirExcluirSuprimento(${idx})">✕</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

// ---- Mecânicos ----
function renderMecanicos() {
  const grid = document.getElementById('grid-mecanicos');
  if (!grid) return;
  const corMap = { blue:'mec-av-blue', green:'mec-av-green', amber:'mec-av-amber', purple:'mec-av-purple' };
  const nivelBadge = { administrador:'badge-adm|Administrador', supervisor:'badge-sup|Supervisor', tecnico:'badge-tec|Técnico' };
  grid.innerHTML = MECANICOS.map((m, idx) => {
    const parts = (nivelBadge[m.nivel] || 'badge-tec|Técnico').split('|');
    const [nc, nt] = parts;
    return `
    <div class="mec-card">
      <div class="flex-between" style="margin-bottom:12px">
        <div class="flex-center gap-12">
          <div class="mec-avatar ${corMap[m.cor] || 'mec-av-blue'}">${m.av}</div>
          <div>
            <div style="font-weight:700;font-size:14px">${m.nome}</div>
            <div style="font-size:12px;color:var(--text-muted)">${m.func}</div>
            <span class="badge ${nc}" style="margin-top:4px;display:inline-flex">${nt}</span>
          </div>
        </div>
        <div style="display:flex;gap:6px;align-self:flex-start">
          <button class="btn btn-outline" style="padding:5px 8px;font-size:11px" onclick="abrirEditarMecanico(${idx})" title="Editar">
            <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm2.92 1.42L14.06 10.5l1.44 1.44-8.14 8.17H5.92v-1.44zM20.71 5.63l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83a1 1 0 000-1.41z"/></svg>
          </button>
          <button class="btn btn-danger" style="padding:5px 8px;font-size:11px" onclick="abrirExcluirMecanico(${idx})" title="Excluir">
            <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </div>
      <div class="divider" style="margin:8px 0"></div>
      <div style="font-size:12px;color:var(--text-muted);display:flex;flex-direction:column;gap:4px">
        <div>⏰ Turno: <span style="color:var(--text-secondary)">${m.turno}</span></div>
        <div>📞 <span style="color:var(--text-secondary)">${m.tel}</span></div>
      </div>
      <div class="kpi-row">
        <div class="kpi-mini"><div class="kpi-mini-val" style="color:var(--accent-blue-hover)">${m.os}</div><div class="kpi-mini-lbl">OS/mês</div></div>
        <div class="kpi-mini"><div class="kpi-mini-val" style="color:var(--accent-green)">${m.mttr}h</div><div class="kpi-mini-lbl">MTTR</div></div>
        <div class="kpi-mini"><div class="kpi-mini-val" style="color:var(--accent-amber)">98%</div><div class="kpi-mini-lbl">Efic.</div></div>
      </div>
    </div>`;
  }).join('');
}

// ---- Ordens de Serviço ----
function renderOS() {
  const lista = document.getElementById('lista-os');
  if (!lista) return;
  lista.innerHTML = OS_LIST.map((os, idx) => `
    <div class="os-card">
      <div class="os-header">
        <span class="os-id">${os.id}</span>
        <div style="display:flex;gap:6px;align-items:center">
          ${tipoBadge(os.tipo)}
          ${priorBadge(os.prior)}
          ${statusOSBadge(os.status)}
        </div>
      </div>
      <div class="os-machine">${os.maq}</div>
      <div class="os-desc">${os.desc}</div>
      <div class="os-footer">
        <div class="os-meta">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
          ${os.mecanico}
        </div>
        <div class="os-meta">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-2 .89-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>
          ${os.data}
        </div>
        <div style="display:flex;gap:6px">
          ${os.status === 'exec'    ? `<button class="btn btn-success" style="font-size:11px;padding:5px 10px" onclick="showPage('execucao',null);setTimeout(()=>selecionarOS('${os.id}'),200)">Executar</button>` : ''}
          ${os.status === 'pendente'? `<button class="btn btn-primary"  style="font-size:11px;padding:5px 10px" onclick="showPage('execucao',null);setTimeout(()=>selecionarOS('${os.id}'),200)">Iniciar</button>` : ''}
          <button class="btn btn-outline" style="font-size:11px;padding:5px 10px" onclick="abrirDetalhesOS('${os.id}')">Detalhes</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ---- Relatório ----
function renderRelatorio() {
  const tbody = document.getElementById('tbody-relatorio');
  if (!tbody) return;
  tbody.innerHTML = OS_LIST.map(os => `
    <tr>
      <td><span class="table-code">${os.id}</span></td>
      <td class="primary">${os.maq}</td>
      <td>${tipoBadge(os.tipo)}</td>
      <td>${os.mecanico}</td>
      <td>${os.data}</td>
      <td>${((os.id.replace(/\D/g, '') * 1.3 % 5 + 1).toFixed(1))}h</td>
      <td style="font-size:12px">2 itens</td>
      <td>${statusOSBadge(os.status)}</td>
    </tr>
  `).join('');
}

// ---- Populate machine select ----
function populateMaqSelect() {
  ['sel-maquina-agend', 'sel-maquina-os'].forEach(selId => {
    const sel = document.getElementById(selId);
    if (!sel) return;
    sel.innerHTML = '<option value="">Selecione a máquina...</option>';
    MAQUINAS.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = `${m.id} — ${m.nome} (${m.cat})`;
      sel.appendChild(opt);
    });
  });
}

// ---- Supply stats ----
function updateSupplyStats() {
  const crit = SUPRIMENTOS.filter(s => (s.qtd / s.min) * 100 < 30).length;
  const low  = SUPRIMENTOS.filter(s => { const p = (s.qtd / s.min) * 100; return p >= 30 && p < 60; }).length;
  const ok   = SUPRIMENTOS.filter(s => (s.qtd / s.min) * 100 >= 60).length;
  const statsEl = document.querySelectorAll('#page-suprimentos .stat-value');
  if (statsEl.length >= 4) {
    statsEl[0].textContent = SUPRIMENTOS.length;
    statsEl[1].textContent = crit;
    statsEl[2].textContent = low;
    statsEl[3].textContent = ok;
  }
}

// ---- Histórico de Manutenções por Máquina ----
let _histMaqIdx = null;

function abrirHistoricoMaquina(idx) {
  _histMaqIdx = idx;
  const maq     = MAQUINAS[idx];
  const osMatch = OS_LIST.filter(os => os.maq.startsWith(maq.id));

  document.getElementById('hist-modal-titulo').textContent = `Histórico — ${maq.id}`;
  document.getElementById('hist-modal-sub').textContent    = `${maq.nome} · ${maq.cat} · Série: ${maq.serie} · Aquisição: ${maq.aq}`;

  const total      = osMatch.length;
  const concluidas = osMatch.filter(o => o.status === 'concluido').length;
  const corretivas = osMatch.filter(o => o.tipo === 'corretiva').length;
  const durTotal   = osMatch.reduce((acc, o) => acc + (o._duracao || 0), 0);
  const durHoras   = durTotal ? (durTotal / 3600).toFixed(1) + 'h' : '—';

  document.getElementById('hist-kpis').innerHTML = `
    <div style="background:var(--bg-input);border-radius:var(--radius-sm);padding:12px;text-align:center">
      <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">Total de OS</div>
      <div style="font-family:var(--font-cond);font-size:24px;font-weight:700;color:var(--accent-blue-hover)">${total}</div>
    </div>
    <div style="background:var(--bg-input);border-radius:var(--radius-sm);padding:12px;text-align:center">
      <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">Concluídas</div>
      <div style="font-family:var(--font-cond);font-size:24px;font-weight:700;color:var(--accent-green)">${concluidas}</div>
    </div>
    <div style="background:var(--bg-input);border-radius:var(--radius-sm);padding:12px;text-align:center">
      <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">Corretivas</div>
      <div style="font-family:var(--font-cond);font-size:24px;font-weight:700;color:var(--accent-red)">${corretivas}</div>
    </div>
    <div style="background:var(--bg-input);border-radius:var(--radius-sm);padding:12px;text-align:center">
      <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">Tempo Total</div>
      <div style="font-family:var(--font-cond);font-size:24px;font-weight:700;color:var(--accent-amber)">${durHoras}</div>
    </div>`;

  if (total === 0) {
    document.getElementById('hist-tbody').innerHTML = '';
    document.getElementById('hist-empty').style.display = 'block';
    document.querySelector('#hist-lista .table-wrap').style.display = 'none';
  } else {
    document.getElementById('hist-empty').style.display = 'none';
    document.querySelector('#hist-lista .table-wrap').style.display = '';
    document.getElementById('hist-tbody').innerHTML = osMatch.map(os => {
      const dur = os._duracao ? (os._duracao / 3600).toFixed(1) + 'h' : '—';
      return `
      <tr>
        <td><span class="table-code">${os.id}</span></td>
        <td>${tipoBadge(os.tipo)}</td>
        <td>${os.mecanico}</td>
        <td>${os.data}</td>
        <td>${dur}</td>
        <td>${statusOSBadge(os.status)}</td>
      </tr>`;
    }).join('');
  }

  const tipoColor = { preventiva: 'blue', corretiva: 'red', preditiva: 'amber' };
  document.getElementById('hist-timeline-items').innerHTML = osMatch.length
    ? osMatch.map(os => `
        <div class="timeline-item">
          <div class="timeline-dot ${tipoColor[os.tipo] || 'blue'}"></div>
          <div class="timeline-time">${os.data} · ${os.id}</div>
          <div class="timeline-text">
            <strong>${os.mecanico}</strong> · ${tipoBadge(os.tipo)} ${priorBadge(os.prior)} ${statusOSBadge(os.status)}<br>
            <span style="font-size:12px;color:var(--text-muted);margin-top:3px;display:block">${os.desc}</span>
            ${os._laudo ? `<span style="font-size:12px;color:var(--text-secondary);font-style:italic;display:block;margin-top:2px">Laudo: ${os._laudo}</span>` : ''}
          </div>
        </div>`).join('')
    : `<div style="color:var(--text-muted);font-size:13px;padding:16px 0">Nenhum registro encontrado.</div>`;

  setHistTab(document.querySelector('#hist-tabs .tab'), 'lista');
  openModal('modal-historico');
}

function abrirOSMaquina(idx) {
  const maq = MAQUINAS[idx];
  const sel = document.getElementById('sel-maquina-agend');
  if (sel) {
    const opt = [...sel.options].find(o => o.value === maq.id);
    if (opt) sel.value = maq.id;
  }
  openModal('modal-agend');
}

function abrirOSMaquinaFromHist() {
  closeModal('modal-historico');
  if (_histMaqIdx !== null) abrirOSMaquina(_histMaqIdx);
}

// ---- Detalhes da OS ----
function abrirDetalhesOS(osId) {
  const os = OS_LIST.find(o => o.id === osId);
  if (!os) return;

  document.getElementById('det-os-titulo').textContent = `Ordem de Serviço ${os.id}`;
  document.getElementById('det-os-badges').innerHTML = `${tipoBadge(os.tipo)} ${priorBadge(os.prior)} ${statusOSBadge(os.status)}`;

  const dur = os._duracao ? (os._duracao / 3600).toFixed(1) + 'h' : '—';
  const infos = [
    { label:'Máquina',    value: os.maq },
    { label:'Mecânico',   value: os.mecanico },
    { label:'Data / Hora',value: os.data },
    { label:'Duração',    value: dur },
  ];
  document.getElementById('det-os-info').innerHTML = infos.map(i => `
    <div style="background:var(--bg-input);border-radius:var(--radius-sm);padding:10px 14px">
      <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px">${i.label}</div>
      <div style="font-size:13px;font-weight:600;color:var(--text-primary)">${i.value}</div>
    </div>`).join('');

  document.getElementById('det-os-desc').textContent = os.desc;

  if (os._checklist && os._checklist.some(v => v)) {
    document.getElementById('det-os-checklist-wrap').style.display = 'block';
    document.getElementById('det-os-checklist').innerHTML = CHECKLIST.map((item, i) => {
      const val   = os._checklist[i] || '—';
      const color = val === 'OK' ? 'var(--accent-green)' : val === 'LD' ? 'var(--accent-amber)' : val === 'OBS' ? 'var(--accent-red)' : 'var(--text-muted)';
      return `<div style="display:flex;align-items:center;gap:10px;padding:7px 12px;border-bottom:1px solid var(--border)">
        <span style="font-family:monospace;font-size:11px;font-weight:700;color:${color};min-width:28px">${val}</span>
        <span style="font-size:12px;color:var(--text-secondary)">${item}</span>
      </div>`;
    }).join('');
  } else {
    document.getElementById('det-os-checklist-wrap').style.display = 'none';
  }

  if (os._suprimentos && os._suprimentos.length) {
    document.getElementById('det-os-sup-wrap').style.display = 'block';
    document.getElementById('det-os-sup-lista').innerHTML = os._suprimentos.map(s =>
      `<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border);font-size:13px">
        <span style="color:var(--text-primary);font-weight:500">${s.nome}</span>
        <span style="color:var(--text-muted)">${s.qtd} ${s.un}</span>
      </div>`).join('');
  } else {
    document.getElementById('det-os-sup-wrap').style.display = 'none';
  }

  if (os._laudo && os._laudo.trim()) {
    document.getElementById('det-os-laudo-wrap').style.display = 'block';
    document.getElementById('det-os-laudo').textContent = os._laudo;
  } else {
    document.getElementById('det-os-laudo-wrap').style.display = 'none';
  }

  let actions = '';
  if (os.status === 'pendente') {
    actions = `<button class="btn btn-primary" onclick="closeModal('modal-detalhes-os');showPage('execucao',null);setTimeout(()=>selecionarOS('${os.id}'),200)">Iniciar OS</button>`;
  } else if (os.status === 'exec') {
    actions = `<button class="btn btn-success" onclick="closeModal('modal-detalhes-os');showPage('execucao',null);setTimeout(()=>selecionarOS('${os.id}'),200)">Abrir Execução</button>`;
  } else if (os.status === 'concluido') {
    actions = `<button class="btn btn-outline" onclick="closeModal('modal-detalhes-os');exportarPDFOS('${os.id}')">
      <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M19 3H5c-1.1 0-2 .9-2 2v14l4-4h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
      Exportar Laudo
    </button>`;
  }
  document.getElementById('det-os-actions').innerHTML = actions;

  openModal('modal-detalhes-os');
}
