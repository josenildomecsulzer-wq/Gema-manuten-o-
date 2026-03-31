/* =============================================
   execucao.js — OS Execution engine: timer,
   checklist, suprimentos utilizados, finalização
   ============================================= */

let _osAtiva       = null;
let _osSupUtiliz   = [];
let _timerInterval = null;
let _timerSegundos = 0;

function populateExecSupSelect() {
  const sel = document.getElementById('exec-sup-sel');
  if (!sel) return;
  sel.innerHTML = '<option value="">Selecionar suprimento...</option>';
  SUPRIMENTOS.forEach((s, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${s.nome} (${s.qtd} ${s.un} disponível)`;
    sel.appendChild(opt);
  });
}

function selecionarOS(osId) {
  const os = OS_LIST.find(o => o.id === osId);
  if (!os) return;

  if (_timerInterval) clearInterval(_timerInterval);
  _timerSegundos = 0;
  _osAtiva = os;
  _osSupUtiliz = [];

  document.getElementById('exec-empty').style.display  = 'none';
  document.getElementById('exec-painel').style.display = 'block';
  document.getElementById('card-sup-utilizados').style.display = 'block';

  document.getElementById('exec-titulo').textContent     = `Execução — ${os.id}`;
  document.getElementById('exec-maq').textContent        = os.maq;
  document.getElementById('exec-mec').textContent        = os.mecanico;
  document.getElementById('exec-tipo-badge').innerHTML   = tipoBadge(os.tipo);
  document.getElementById('exec-prior-badge').innerHTML  = priorBadge(os.prior);
  document.getElementById('exec-laudo').value            = os._rascunho || '';
  document.getElementById('exec-rascunho-info').style.display = 'none';

  renderChecklist();

  if (os._checklist) {
    os._checklist.forEach((val, i) => {
      const sel = document.querySelector(`#checklist-items select[data-cl="${i}"]`);
      if (sel) sel.value = val;
    });
    atualizarProgressoChecklist();
  }

  renderSupUtiliz();
  populateExecSupSelect();

  _timerSegundos = os._tempoDecorrido || 0;
  atualizarTimer();
  _timerInterval = setInterval(() => {
    _timerSegundos++;
    os._tempoDecorrido = _timerSegundos;
    atualizarTimer();
  }, 1000);

  renderOSExecucao();
}

function renderOSExecucao() {
  const el   = document.getElementById('os-execucao-list');
  if (!el) return;
  const exec = OS_LIST.filter(o => o.status === 'exec');

  if (!exec.length) {
    el.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px">Nenhuma OS em execução no momento.</div>`;
    return;
  }

  el.innerHTML = exec.map(os => {
    const isActive = _osAtiva && _osAtiva.id === os.id;
    return `
    <div class="os-card" onclick="selecionarOS('${os.id}')" style="${isActive ? 'border-color:var(--accent-blue);background:var(--bg-card-hover)' : ''}">
      <div class="os-header">
        <span class="os-id">${os.id}</span>
        <div style="display:flex;gap:6px;align-items:center">
          ${tipoBadge(os.tipo)}
          ${priorBadge(os.prior)}
        </div>
      </div>
      <div class="os-machine" style="font-size:13px">${os.maq}</div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:4px">${os.mecanico} · ${os.data}</div>
      ${isActive ? `<div style="font-size:11px;color:var(--accent-blue);margin-top:6px;font-weight:600">▶ Aberta no painel</div>` : ''}
    </div>`;
  }).join('');
}

function atualizarTimer() {
  const h  = String(Math.floor(_timerSegundos / 3600)).padStart(2, '0');
  const m  = String(Math.floor((_timerSegundos % 3600) / 60)).padStart(2, '0');
  const s  = String(_timerSegundos % 60).padStart(2, '0');
  const el = document.getElementById('exec-timer');
  if (el) el.textContent = `${h}:${m}:${s}`;
}

function renderChecklist() {
  const el = document.getElementById('checklist-items');
  if (!el) return;
  el.innerHTML = CHECKLIST.map((item, i) => `
    <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
      <select data-cl="${i}" style="width:90px;padding:4px 6px;font-size:12px" onchange="atualizarProgressoChecklist()">
        <option value="">—</option>
        <option value="OK">OK</option>
        <option value="NSP">NSP</option>
        <option value="LD">LD</option>
        <option value="OBS">OBS</option>
      </select>
      <span style="font-size:13px;color:var(--text-secondary);flex:1">${item}</span>
    </div>
  `).join('');
  atualizarProgressoChecklist();
}

function atualizarProgressoChecklist() {
  const sels       = document.querySelectorAll('#checklist-items select');
  const total      = sels.length;
  const preenchidos = [...sels].filter(s => s.value !== '').length;
  const prog       = document.getElementById('exec-checklist-prog');
  if (prog) prog.textContent = `(${preenchidos}/${total} itens)`;
}

function renderSupUtiliz() {
  const el = document.getElementById('exec-sup-lista');
  if (!el) return;
  if (!_osSupUtiliz.length) {
    el.innerHTML = '<span style="color:var(--text-muted)">Nenhum suprimento adicionado.</span>';
    return;
  }
  el.innerHTML = _osSupUtiliz.map((item, i) => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border)">
      <div>
        <span style="font-weight:600;color:var(--text-primary)">${item.nome}</span>
        <span style="color:var(--text-muted);margin-left:8px">${item.qtd} ${item.un}</span>
      </div>
      <button onclick="removerSupOS(${i})" style="background:none;border:none;color:var(--accent-red);cursor:pointer;font-size:16px;padding:0 4px">×</button>
    </div>
  `).join('');
}

function adicionarSuprimentoOS() {
  const sel = document.getElementById('exec-sup-sel');
  const qtdEl = document.getElementById('exec-sup-qtd');
  const idx   = parseInt(sel.value);
  const qtd   = parseFloat(qtdEl.value);

  if (isNaN(idx) || sel.value === '') { showToast('Selecione um suprimento!', 'error'); return; }
  if (!qtd || qtd <= 0)               { showToast('Informe uma quantidade válida!', 'error'); return; }

  const s = SUPRIMENTOS[idx];
  if (qtd > s.qtd) { showToast(`Estoque insuficiente! Disponível: ${s.qtd} ${s.un}`, 'error'); return; }

  _osSupUtiliz.push({ idx, nome: s.nome, qtd, un: s.un });
  sel.value    = '';
  qtdEl.value  = '';
  renderSupUtiliz();
  populateExecSupSelect();
}

function removerSupOS(i) {
  _osSupUtiliz.splice(i, 1);
  renderSupUtiliz();
  populateExecSupSelect();
}

function salvarRascunho() {
  if (!_osAtiva) return;
  _osAtiva._rascunho  = document.getElementById('exec-laudo').value;
  _osAtiva._checklist = [...document.querySelectorAll('#checklist-items select')].map(s => s.value);
  const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  document.getElementById('exec-rascunho-hora').textContent = now;
  document.getElementById('exec-rascunho-info').style.display = 'block';
  showToast(`Rascunho da ${_osAtiva.id} salvo!`);
}

function finalizarOS() {
  if (!_osAtiva) return;

  const sels       = [...document.querySelectorAll('#checklist-items select')];
  const preenchidos = sels.filter(s => s.value !== '').length;
  if (preenchidos === 0) {
    showToast('Preencha ao menos um item do checklist antes de finalizar!', 'error');
    return;
  }

  const laudo = document.getElementById('exec-laudo').value.trim();

  // Baixar suprimentos do estoque
  _osSupUtiliz.forEach(item => {
    SUPRIMENTOS[item.idx].qtd = Math.max(0, Math.round((SUPRIMENTOS[item.idx].qtd - item.qtd) * 10) / 10);
  });

  // Atualizar OS
  _osAtiva.status      = 'concluido';
  _osAtiva._laudo      = laudo;
  _osAtiva._checklist  = sels.map(s => s.value);
  _osAtiva._duracao    = _timerSegundos;
  _osAtiva._suprimentos = [..._osSupUtiliz];

  if (_osAtiva._docId) {
    dbAtualizar('ordens_servico', _osAtiva._docId, {
      status: 'concluido',
      _laudo: laudo,
      _checklist: _osAtiva._checklist,
      _duracao: _timerSegundos,
      _suprimentos: _osAtiva._suprimentos,
    });
  }

  if (_timerInterval) { clearInterval(_timerInterval); _timerInterval = null; }

  renderOSExecucao();
  renderOS();
  renderRelatorio();
  renderSuprimentos();
  updateSupplyStats();

  const supCount       = _osSupUtiliz.length;
  const durMin         = Math.round(_timerSegundos / 60);
  const osIdFinalizada = _osAtiva.id;
  const osMaqFinalizada = _osAtiva.maq;

  _osAtiva      = null;
  _osSupUtiliz  = [];

  document.getElementById('exec-painel').style.display  = 'none';
  document.getElementById('exec-empty').style.display   = 'block';
  document.getElementById('card-sup-utilizados').style.display = 'none';

  showToast(`OS finalizada! ${durMin} min · ${supCount ? supCount + ' suprimento(s) baixado(s)' : 'nenhum suprimento'}`);
  pushNotif('sucesso', `Serviço Concluído — ${osIdFinalizada}`, `${osMaqFinalizada} · ${durMin} min de duração.`);
}
