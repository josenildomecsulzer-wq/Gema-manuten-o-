/* =============================================
   crud.js — CRUD operations for all entities,
   movimentação de estoque, PDF export
   ============================================= */

// ---- Máquina ----
function salvarMaquina() {
  const codigo = document.getElementById('maq-codigo').value.trim();
  const nome   = document.getElementById('maq-nome').value.trim();
  if (!codigo || !nome) { showToast('Preencha ao menos Código e Nome!', 'error'); return; }

  let aq = document.getElementById('maq-aq').value || '';
  if (aq) { const [y, m, d] = aq.split('-'); aq = `${d}/${m}/${y}`; }

  const statusMap = { 'Ativo':'ativo', 'Em Manutenção':'manutencao', 'Parado':'parado' };
  const entry = {
    id:     codigo,
    nome,
    cat:    document.getElementById('maq-cat').value,
    fab:    document.getElementById('maq-fab').value,
    modelo: document.getElementById('maq-modelo').value,
    serie:  document.getElementById('maq-serie').value,
    aq:     aq || '—',
    vel:    '—',
    status: statusMap[document.getElementById('maq-status').value] || 'ativo',
  };

  MAQUINAS.push(entry);
  dbSalvar('maquinas', entry);
  renderMaquinas();
  populateMaqSelect();

  ['maq-codigo','maq-nome','maq-fab','maq-modelo','maq-serie','maq-aq','maq-obs']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  closeModal('modal-maquina');
  showToast('Máquina cadastrada com sucesso!');
}

// ---- Agendamento ----
function salvarAgendamento() {
  closeModal('modal-agend');
  showToast('Manutenção agendada com sucesso!');
}

// ---- Suprimentos ----
let _supEditIdx = null;

function abrirNovoSuprimento() {
  _supEditIdx = null;
  document.getElementById('modal-sup-title').textContent = 'Cadastrar Suprimento';
  ['sup-nome','sup-cod','sup-qtd','sup-min','sup-loc'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('sup-cat').value = 'Óleos e Lubrificantes';
  document.getElementById('sup-un').value  = 'L';
  openModal('modal-suprimento');
}

function abrirEditarSuprimento(idx) {
  _supEditIdx = idx;
  const s = SUPRIMENTOS[idx];
  document.getElementById('modal-sup-title').textContent = 'Editar Suprimento';
  document.getElementById('sup-nome').value = s.nome;
  document.getElementById('sup-cod').value  = s.cod;
  document.getElementById('sup-cat').value  = s.cat;
  document.getElementById('sup-un').value   = s.un;
  document.getElementById('sup-qtd').value  = s.qtd;
  document.getElementById('sup-min').value  = s.min;
  document.getElementById('sup-loc').value  = s.loc;
  openModal('modal-suprimento');
}

function salvarSuprimento() {
  const nome = document.getElementById('sup-nome').value.trim();
  const cod  = document.getElementById('sup-cod').value.trim();
  if (!nome || !cod) { showToast('Preencha Nome e Código!', 'error'); return; }

  const entry = {
    nome,
    cod,
    cat: document.getElementById('sup-cat').value,
    un:  document.getElementById('sup-un').value,
    qtd: parseFloat(document.getElementById('sup-qtd').value) || 0,
    min: parseFloat(document.getElementById('sup-min').value) || 0,
    loc: document.getElementById('sup-loc').value.trim(),
  };

  if (_supEditIdx === null) {
    SUPRIMENTOS.push(entry);
    dbSalvar('suprimentos', entry);
    showToast('Suprimento cadastrado!');
  } else {
    const existing = SUPRIMENTOS[_supEditIdx];
    const updated = { ...existing, ...entry };
    SUPRIMENTOS[_supEditIdx] = updated;
    dbSalvar('suprimentos', updated);
    showToast('Suprimento atualizado!');
  }

  renderSuprimentos();
  updateSupplyStats();
  populateExecSupSelect();
  closeModal('modal-suprimento');
}

let _supDelIdx = null;

function abrirExcluirSuprimento(idx) {
  _supDelIdx = idx;
  document.getElementById('del-sup-nome').textContent = SUPRIMENTOS[idx].nome;
  openModal('modal-del-sup');
}

function confirmarExcluirSuprimento() {
  if (_supDelIdx === null) return;
  const s = SUPRIMENTOS[_supDelIdx];
  if (s._docId) dbExcluir('suprimentos', s._docId);
  SUPRIMENTOS.splice(_supDelIdx, 1);
  _supDelIdx = null;
  renderSuprimentos();
  updateSupplyStats();
  closeModal('modal-del-sup');
  showToast('Suprimento removido.');
}

// ---- Movimentação de estoque ----
let _movimIdx = null;

function abrirMovim(idx) {
  _movimIdx = idx;
  const s = SUPRIMENTOS[idx];
  document.getElementById('movim-sup-nome').textContent = s.nome;
  document.getElementById('movim-sup-info').textContent = `Estoque atual: ${s.qtd} ${s.un} · Mínimo: ${s.min} ${s.un}`;
  document.getElementById('movim-qtd').value = '';
  document.getElementById('movim-obs').value = '';
  document.getElementById('movim-tipo').value = 'entrada';
  document.getElementById('movim-preview').style.display = 'none';
  openModal('modal-movim');
}

function previewMovim() {
  if (_movimIdx === null) return;
  const s    = SUPRIMENTOS[_movimIdx];
  const qtd  = parseFloat(document.getElementById('movim-qtd').value) || 0;
  const tipo = document.getElementById('movim-tipo').value;
  if (!qtd) { document.getElementById('movim-preview').style.display = 'none'; return; }

  let novo;
  if (tipo === 'entrada') novo = s.qtd + qtd;
  else if (tipo === 'saida') novo = Math.max(0, s.qtd - qtd);
  else novo = qtd; // ajuste

  const color = novo >= s.min ? 'var(--accent-green)' : novo > 0 ? 'var(--accent-amber)' : 'var(--accent-red)';
  document.getElementById('movim-atual').textContent = `${s.qtd} ${s.un}`;
  document.getElementById('movim-novo').textContent  = `${Math.round(novo * 10) / 10} ${s.un}`;
  document.getElementById('movim-novo').style.color  = color;
  document.getElementById('movim-preview').style.display = 'block';
}

function confirmarMovim() {
  if (_movimIdx === null) return;
  const s    = SUPRIMENTOS[_movimIdx];
  const qtd  = parseFloat(document.getElementById('movim-qtd').value) || 0;
  const tipo = document.getElementById('movim-tipo').value;
  if (!qtd) { showToast('Informe a quantidade!', 'error'); return; }

  if (tipo === 'entrada')      s.qtd = Math.round((s.qtd + qtd) * 10) / 10;
  else if (tipo === 'saida')   s.qtd = Math.max(0, Math.round((s.qtd - qtd) * 10) / 10);
  else                         s.qtd = Math.round(qtd * 10) / 10;

  dbSalvar('suprimentos', s);
  renderSuprimentos();
  updateSupplyStats();
  closeModal('modal-movim');
  showToast(`Movimentação registrada! Novo estoque: ${s.qtd} ${s.un}`);
}

// ---- Mecânicos ----
let _mecEditIdx = null;

function getInitials(nome) {
  return nome.trim().split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function abrirNovoMecanico() {
  _mecEditIdx = null;
  document.getElementById('modal-mec-title').textContent = 'Cadastrar Mecânico';
  document.getElementById('mec-nome').value  = '';
  document.getElementById('mec-func').value  = '';
  document.getElementById('mec-turno').value = 'Manhã (06h-14h)';
  document.getElementById('mec-tel').value   = '';
  document.getElementById('mec-nivel').value = 'tecnico';
  document.getElementById('mec-cor').value   = 'blue';
  openModal('modal-mecanico');
}

function abrirEditarMecanico(idx) {
  _mecEditIdx = idx;
  const m = MECANICOS[idx];
  document.getElementById('modal-mec-title').textContent = 'Editar Mecânico';
  document.getElementById('mec-nome').value  = m.nome;
  document.getElementById('mec-func').value  = m.func;
  document.getElementById('mec-turno').value = m.turno;
  document.getElementById('mec-tel').value   = m.tel;
  document.getElementById('mec-nivel').value = m.nivel;
  document.getElementById('mec-cor').value   = m.cor;
  openModal('modal-mecanico');
}

function salvarMecanico() {
  const nome = document.getElementById('mec-nome').value.trim();
  const func = document.getElementById('mec-func').value.trim();
  if (!nome) { showToast('Preencha o nome do mecânico!', 'error'); return; }

  const turno = document.getElementById('mec-turno').value;
  const tel   = document.getElementById('mec-tel').value.trim();
  const nivel = document.getElementById('mec-nivel').value;
  const cor   = document.getElementById('mec-cor').value;
  const av    = getInitials(nome);

  if (_mecEditIdx === null) {
    const entry = { nome, func, turno, tel, nivel, os: 0, mttr: 0, av, cor };
    MECANICOS.push(entry);
    dbSalvar('mecanicos', entry);
    showToast('Mecânico cadastrado com sucesso!');
  } else {
    const updated = { ...MECANICOS[_mecEditIdx], nome, func, turno, tel, nivel, cor, av };
    MECANICOS[_mecEditIdx] = updated;
    dbSalvar('mecanicos', updated);
    showToast('Mecânico atualizado com sucesso!');
  }

  renderMecanicos();
  closeModal('modal-mecanico');
}

let _mecDelIdx = null;

function abrirExcluirMecanico(idx) {
  _mecDelIdx = idx;
  document.getElementById('del-mec-nome').textContent = MECANICOS[idx].nome;
  openModal('modal-del-mec');
}

function confirmarExcluirMecanico() {
  if (_mecDelIdx === null) return;
  const m = MECANICOS[_mecDelIdx];
  if (m._docId) dbExcluir('mecanicos', m._docId);
  MECANICOS.splice(_mecDelIdx, 1);
  _mecDelIdx = null;
  renderMecanicos();
  closeModal('modal-del-mec');
  showToast(`${m.nome} removido com sucesso.`);
}

// ---- PDF / Print export ----
function exportarPDFOS(osId) {
  const os = OS_LIST.find(o => o.id === osId);
  if (!os) return;

  const dur = os._duracao ? (os._duracao / 3600).toFixed(1) + 'h' : '—';

  const checklistHTML = os._checklist
    ? CHECKLIST.map((item, i) => {
        const val   = os._checklist[i] || '—';
        const color = val === 'OK' ? '#16a34a' : val === 'LD' ? '#d97706' : val === 'OBS' ? '#dc2626' : '#888';
        return `<tr>
          <td style="padding:4px 8px;border:1px solid #ddd;font-size:11px;font-weight:700;color:${color};width:40px">${val}</td>
          <td style="padding:4px 8px;border:1px solid #ddd;font-size:11px">${item}</td>
        </tr>`;
      }).join('')
    : '<tr><td colspan="2" style="padding:8px;font-size:11px;color:#888">Checklist não preenchido.</td></tr>';

  const supHTML = os._suprimentos && os._suprimentos.length
    ? os._suprimentos.map(s =>
        `<tr>
          <td style="padding:4px 8px;border:1px solid #ddd;font-size:11px">${s.nome}</td>
          <td style="padding:4px 8px;border:1px solid #ddd;font-size:11px;text-align:center">${s.qtd} ${s.un}</td>
        </tr>`).join('')
    : '<tr><td colspan="2" style="padding:8px;font-size:11px;color:#888">Nenhum suprimento utilizado.</td></tr>';

  document.getElementById('print-area').innerHTML = `
    <div style="font-family:Arial,sans-serif;padding:24px;color:#000;max-width:800px;margin:0 auto">
      <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #1e3a8a;padding-bottom:12px;margin-bottom:20px">
        <div>
          <div style="font-size:20px;font-weight:700;color:#1e3a8a">GEMAN — Laudo Técnico</div>
          <div style="font-size:11px;color:#555;margin-top:2px">Ordem de Serviço ${os.id}</div>
        </div>
        <div style="text-align:right;font-size:11px;color:#555">
          <div>Emitido: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</div>
          <div style="margin-top:3px">Status: <strong>${os.status === 'concluido' ? 'Concluído' : os.status}</strong></div>
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
        <tr>
          <td style="padding:6px 8px;border:1px solid #ddd;font-size:11px;font-weight:700;background:#f5f5f5;width:25%">Máquina</td>
          <td style="padding:6px 8px;border:1px solid #ddd;font-size:11px">${os.maq}</td>
          <td style="padding:6px 8px;border:1px solid #ddd;font-size:11px;font-weight:700;background:#f5f5f5;width:20%">Tipo</td>
          <td style="padding:6px 8px;border:1px solid #ddd;font-size:11px">${os.tipo.charAt(0).toUpperCase()+os.tipo.slice(1)}</td>
        </tr>
        <tr>
          <td style="padding:6px 8px;border:1px solid #ddd;font-size:11px;font-weight:700;background:#f5f5f5">Mecânico</td>
          <td style="padding:6px 8px;border:1px solid #ddd;font-size:11px">${os.mecanico}</td>
          <td style="padding:6px 8px;border:1px solid #ddd;font-size:11px;font-weight:700;background:#f5f5f5">Duração</td>
          <td style="padding:6px 8px;border:1px solid #ddd;font-size:11px">${dur}</td>
        </tr>
        <tr>
          <td style="padding:6px 8px;border:1px solid #ddd;font-size:11px;font-weight:700;background:#f5f5f5">Data / Hora</td>
          <td style="padding:6px 8px;border:1px solid #ddd;font-size:11px" colspan="3">${os.data}</td>
        </tr>
        <tr>
          <td style="padding:6px 8px;border:1px solid #ddd;font-size:11px;font-weight:700;background:#f5f5f5">Descrição</td>
          <td style="padding:6px 8px;border:1px solid #ddd;font-size:11px" colspan="3">${os.desc}</td>
        </tr>
      </table>
      <div style="font-size:12px;font-weight:700;color:#1e3a8a;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Checklist</div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px">${checklistHTML}</table>
      <div style="font-size:12px;font-weight:700;color:#1e3a8a;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Suprimentos Utilizados</div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px">${supHTML}</table>
      <div style="font-size:12px;font-weight:700;color:#1e3a8a;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Laudo Técnico</div>
      <div style="font-size:11px;border:1px solid #ddd;padding:10px;min-height:60px;line-height:1.6">${os._laudo || 'Nenhum laudo registrado.'}</div>
      <div style="margin-top:40px;display:flex;justify-content:space-between;font-size:11px">
        <div style="text-align:center"><div style="border-top:1px solid #000;width:200px;padding-top:4px">Assinatura do Mecânico</div></div>
        <div style="text-align:center"><div style="border-top:1px solid #000;width:200px;padding-top:4px">Assinatura do Supervisor</div></div>
      </div>
      <div style="margin-top:24px;border-top:1px solid #ddd;padding-top:8px;font-size:10px;color:#aaa;text-align:center">GEMAN — Gestor de Manutenção de Tecelagem</div>
    </div>`;

  window.print();
}
