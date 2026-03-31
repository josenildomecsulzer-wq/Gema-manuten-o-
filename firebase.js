/* =============================================
   firebase.js — Firebase connection, CRUD helpers,
   real-time listeners
   ============================================= */

// ---- Loading progress ----
function setLoadingProgress(pct, msg) {
  const bar   = document.getElementById('db-loading-bar');
  const msgEl = document.getElementById('db-loading-msg');
  if (bar)   bar.style.width = pct + '%';
  if (msgEl && msg) msgEl.textContent = msg;
}

function hideLoading() {
  const el = document.getElementById('db-loading');
  if (el) {
    el.style.opacity = '0';
    el.style.transition = 'opacity .4s';
    setTimeout(() => el.style.display = 'none', 400);
  }
}

// ---- Firebase connection ----
async function conectarFirebase() {
  const cfg = {
    apiKey:            document.getElementById('fb-apiKey').value.trim(),
    authDomain:        document.getElementById('fb-authDomain').value.trim(),
    projectId:         document.getElementById('fb-projectId').value.trim(),
    storageBucket:     document.getElementById('fb-storageBucket').value.trim(),
    messagingSenderId: document.getElementById('fb-messagingSenderId').value.trim(),
    appId:             document.getElementById('fb-appId').value.trim(),
  };

  if (!cfg.apiKey || !cfg.projectId) {
    mostrarStatusConexao('error', 'Preencha ao menos API Key e Project ID.');
    return;
  }

  mostrarStatusConexao('loading', 'Conectando...');

  try {
    if (firebase.apps.length) firebase.apps.forEach(a => a.delete());
    firebase.initializeApp(cfg);
    db = firebase.firestore();
    await db.collection('_ping').doc('test').set({ t: Date.now() });
    localStorage.setItem(LS_KEY, JSON.stringify(cfg));
    DB_MODE = 'firebase';
    mostrarStatusConexao('success', '✓ Conectado com sucesso! Carregando dados...');

    setTimeout(async () => {
      closeModal('modal-db-config');
      document.getElementById('db-config-notice').style.display = 'none';
      await carregarDados();
      renderizarTudo();
      atualizarIndicadorDB();
      showToast('Firebase conectado! Dados sincronizados.');
    }, 1200);
  } catch (e) {
    mostrarStatusConexao('error', 'Erro: ' + e.message);
  }
}

function mostrarStatusConexao(tipo, msg) {
  const el = document.getElementById('fb-connect-status');
  if (!el) return;
  el.style.display = 'block';
  const styles = {
    loading: 'background:rgba(37,99,235,.15);border:1px solid rgba(37,99,235,.3);color:#93c5fd',
    success: 'background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.3);color:#6ee7b7',
    error:   'background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.3);color:#fca5a5',
  };
  el.style.cssText += ';' + styles[tipo];
  el.textContent = msg;
}

// ---- Load all collections ----
async function carregarDados() {
  if (DB_MODE === 'firebase' && db) {
    setLoadingProgress(20, 'Carregando máquinas...');
    const snapMaq = await db.collection('maquinas').orderBy('id').get();
    MAQUINAS = snapMaq.empty
      ? await seedCollection('maquinas', SEED_MAQUINAS)
      : snapMaq.docs.map(d => ({ ...d.data(), _docId: d.id }));

    setLoadingProgress(40, 'Carregando suprimentos...');
    const snapSup = await db.collection('suprimentos').orderBy('cod').get();
    SUPRIMENTOS = snapSup.empty
      ? await seedCollection('suprimentos', SEED_SUPRIMENTOS)
      : snapSup.docs.map(d => ({ ...d.data(), _docId: d.id }));

    setLoadingProgress(60, 'Carregando mecânicos...');
    const snapMec = await db.collection('mecanicos').orderBy('nome').get();
    MECANICOS = snapMec.empty
      ? await seedCollection('mecanicos', SEED_MECANICOS)
      : snapMec.docs.map(d => ({ ...d.data(), _docId: d.id }));

    setLoadingProgress(80, 'Carregando ordens de serviço...');
    const snapOS = await db.collection('ordens_servico').orderBy('id').get();
    OS_LIST = snapOS.empty
      ? await seedCollection('ordens_servico', SEED_OS)
      : snapOS.docs.map(d => ({ ...d.data(), _docId: d.id }));

    setLoadingProgress(100, 'Pronto!');
    configurarListeners();
  } else {
    MAQUINAS    = SEED_MAQUINAS.map(m => ({ ...m }));
    SUPRIMENTOS = SEED_SUPRIMENTOS.map(s => ({ ...s }));
    MECANICOS   = SEED_MECANICOS.map(m => ({ ...m }));
    OS_LIST     = SEED_OS.map(o => ({ ...o }));
    setLoadingProgress(100, 'Modo local ativo');
  }
}

async function seedCollection(col, data) {
  const batch = db.batch();
  data.forEach(item => {
    const ref = db.collection(col).doc();
    batch.set(ref, item);
  });
  await batch.commit();
  const snap = await db.collection(col).get();
  return snap.docs.map(d => ({ ...d.data(), _docId: d.id }));
}

// ---- Real-time listeners ----
function configurarListeners() {
  db.collection('maquinas').onSnapshot(snap => {
    MAQUINAS = snap.docs.map(d => ({ ...d.data(), _docId: d.id }));
    renderMaquinas(); updateSupplyStats(); populateMaqSelect();
  });
  db.collection('suprimentos').onSnapshot(snap => {
    SUPRIMENTOS = snap.docs.map(d => ({ ...d.data(), _docId: d.id }));
    renderSuprimentos(); updateSupplyStats(); populateExecSupSelect();
  });
  db.collection('mecanicos').onSnapshot(snap => {
    MECANICOS = snap.docs.map(d => ({ ...d.data(), _docId: d.id }));
    renderMecanicos();
  });
  db.collection('ordens_servico').onSnapshot(snap => {
    OS_LIST = snap.docs.map(d => ({ ...d.data(), _docId: d.id }));
    renderOS(); renderOSExecucao(); renderRelatorio();
    gerarNotificacoes(); atualizarBadgeSidebar();
  });
}

// ---- CRUD helpers ----
async function dbSalvar(col, item) {
  if (DB_MODE === 'firebase' && db) {
    if (item._docId) {
      const { _docId, ...data } = item;
      await db.collection(col).doc(_docId).set(data);
    } else {
      const ref = await db.collection(col).add(item);
      item._docId = ref.id;
    }
  }
}

async function dbAtualizar(col, docId, dados) {
  if (DB_MODE === 'firebase' && db && docId) {
    await db.collection(col).doc(docId).update(dados);
  }
}

async function dbExcluir(col, docId) {
  if (DB_MODE === 'firebase' && db && docId) {
    await db.collection(col).doc(docId).delete();
  }
}

// ---- DB indicator in topbar ----
function atualizarIndicadorDB() {
  let ind = document.getElementById('db-indicator');
  if (!ind) {
    ind = document.createElement('div');
    ind.id = 'db-indicator';
    ind.onclick = abrirConfigDB;
    const tr = document.querySelector('.topbar-right');
    if (tr) tr.prepend(ind);
  }
  if (DB_MODE === 'firebase') {
    ind.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;padding:4px 10px;border-radius:6px;cursor:pointer;border:1px solid;background:rgba(16,185,129,.12);border-color:rgba(16,185,129,.3);color:#6ee7b7';
    ind.innerHTML = `<span style="width:7px;height:7px;border-radius:50%;background:#10b981;display:inline-block"></span> Firestore`;
  } else {
    ind.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;padding:4px 10px;border-radius:6px;cursor:pointer;border:1px solid;background:rgba(245,158,11,.1);border-color:rgba(245,158,11,.3);color:#fcd34d';
    ind.innerHTML = `<span style="width:7px;height:7px;border-radius:50%;background:#f59e0b;display:inline-block"></span> Local`;
  }
}

function abrirConfigDB() {
  const saved = localStorage.getItem(LS_KEY);
  if (saved) {
    const cfg = JSON.parse(saved);
    document.getElementById('fb-apiKey').value            = cfg.apiKey || '';
    document.getElementById('fb-authDomain').value        = cfg.authDomain || '';
    document.getElementById('fb-projectId').value         = cfg.projectId || '';
    document.getElementById('fb-storageBucket').value     = cfg.storageBucket || '';
    document.getElementById('fb-messagingSenderId').value = cfg.messagingSenderId || '';
    document.getElementById('fb-appId').value             = cfg.appId || '';
  }
  openModal('modal-db-config');
}
