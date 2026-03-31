/* =============================================
   modals.js — Injects all modal HTML into DOM
   and sets up filter/search listeners
   ============================================= */

function injectModals() {
  document.getElementById('modals-container').innerHTML = `

  <!-- DB Config Modal -->
  <div class="modal-overlay" id="modal-db-config">
    <div class="modal" style="width:580px">
      <div class="modal-header">
        <div>
          <div class="modal-title">Configurar Firebase Firestore</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:3px">Cole as credenciais do seu projeto Firebase</div>
        </div>
        <button class="modal-close" onclick="closeModal('modal-db-config')">×</button>
      </div>
      <div style="background:var(--bg-input);border-radius:var(--radius-sm);padding:14px 16px;margin-bottom:16px;font-size:12px;color:var(--text-secondary);line-height:1.7">
        <strong style="color:var(--text-primary);display:block;margin-bottom:6px">Como obter as credenciais:</strong>
        1. Acesse <span style="color:var(--accent-cyan)">console.firebase.google.com</span> e crie um projeto<br>
        2. Vá em <strong>Configurações do Projeto → Seus apps → Web</strong><br>
        3. Copie o objeto <code style="background:rgba(255,255,255,.08);padding:1px 5px;border-radius:3px">firebaseConfig</code><br>
        4. No Firestore, ative o banco em modo <strong>Teste</strong><br>
        5. Cole cada campo abaixo e clique em Salvar e Conectar
      </div>
      <div class="form-grid">
        <div class="form-group full"><label>API Key</label><input id="fb-apiKey" placeholder="AIzaSy..."></div>
        <div class="form-group"><label>Auth Domain</label><input id="fb-authDomain" placeholder="meu-app.firebaseapp.com"></div>
        <div class="form-group"><label>Project ID</label><input id="fb-projectId" placeholder="meu-app-12345"></div>
        <div class="form-group"><label>Storage Bucket</label><input id="fb-storageBucket" placeholder="meu-app.appspot.com"></div>
        <div class="form-group"><label>Messaging Sender ID</label><input id="fb-messagingSenderId" placeholder="123456789"></div>
        <div class="form-group"><label>App ID</label><input id="fb-appId" placeholder="1:123:web:abc..."></div>
      </div>
      <div id="fb-connect-status" style="display:none;margin:12px 0;font-size:13px;padding:10px 14px;border-radius:6px"></div>
      <div class="form-actions">
        <button class="btn btn-outline" onclick="closeModal('modal-db-config')">Cancelar</button>
        <button class="btn btn-primary" onclick="conectarFirebase()">Salvar e Conectar</button>
      </div>
    </div>
  </div>

  <!-- Modal Nova Máquina -->
  <div class="modal-overlay" id="modal-maquina">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">Cadastrar Máquina</div>
        <button class="modal-close" onclick="closeModal('modal-maquina')">×</button>
      </div>
      <div class="form-grid">
        <div class="form-group"><label>Código</label><input id="maq-codigo" placeholder="Máq. 25"></div>
        <div class="form-group"><label>Nome / Modelo</label><input id="maq-nome" placeholder="Tear Omniplus-i"></div>
        <div class="form-group"><label>Categoria</label>
          <select id="maq-cat"><option>Tecido Brim</option><option>Tecido Lençol</option><option>Felpudo</option><option>Felpudo Jac</option></select>
        </div>
        <div class="form-group"><label>Velocidade (RPM)</label><input id="maq-vel" type="number" placeholder="280"></div>
        <div class="form-group"><label>Fabricante</label><input id="maq-fab" placeholder="Picanol"></div>
        <div class="form-group"><label>Modelo</label><input id="maq-modelo" placeholder="Omniplus-i Connect-4-P 280"></div>
        <div class="form-group"><label>Número de Série</label><input id="maq-serie" placeholder="448062"></div>
        <div class="form-group"><label>Data de Aquisição</label><input id="maq-aq" type="date"></div>
        <div class="form-group"><label>Status Inicial</label>
          <select id="maq-status"><option>Ativo</option><option>Em Manutenção</option><option>Parado</option></select>
        </div>
        <div class="form-group full"><label>Observações</label><textarea id="maq-obs" placeholder="Informações adicionais..."></textarea></div>
      </div>
      <div class="form-actions">
        <button class="btn btn-outline" onclick="closeModal('modal-maquina')">Cancelar</button>
        <button class="btn btn-primary" onclick="salvarMaquina()">Salvar Máquina</button>
      </div>
    </div>
  </div>

  <!-- Modal Suprimento -->
  <div class="modal-overlay" id="modal-suprimento">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title" id="modal-sup-title">Cadastrar Suprimento</div>
        <button class="modal-close" onclick="closeModal('modal-suprimento')">×</button>
      </div>
      <div class="form-grid">
        <div class="form-group"><label>Nome do Suprimento</label><input id="sup-nome" placeholder="Óleo Mobil Gear 600 XP 150"></div>
        <div class="form-group"><label>Código Interno</label><input id="sup-cod" placeholder="SUP-001"></div>
        <div class="form-group"><label>Categoria</label>
          <select id="sup-cat"><option>Óleos e Lubrificantes</option><option>Peças Mecânicas</option><option>Filtros</option><option>Elétrico/Eletrônico</option><option>Consumíveis</option></select>
        </div>
        <div class="form-group"><label>Unidade</label>
          <select id="sup-un"><option value="L">Litros (L)</option><option value="kg">Quilogramas (kg)</option><option value="un">Unidades (un)</option><option value="m">Metros (m)</option></select>
        </div>
        <div class="form-group"><label>Quantidade em Estoque</label><input id="sup-qtd" type="number" min="0" step="0.1" placeholder="0"></div>
        <div class="form-group"><label>Quantidade Mínima</label><input id="sup-min" type="number" min="0" step="0.1" placeholder="5"></div>
        <div class="form-group full"><label>Localização no Almoxarifado</label><input id="sup-loc" placeholder="Prateleira A-3, Gaveta 2"></div>
      </div>
      <div class="form-actions">
        <button class="btn btn-outline" onclick="closeModal('modal-suprimento')">Cancelar</button>
        <button class="btn btn-primary" onclick="salvarSuprimento()">Salvar Suprimento</button>
      </div>
    </div>
  </div>

  <!-- Modal Movimentação de Estoque -->
  <div class="modal-overlay" id="modal-movim">
    <div class="modal" style="width:460px">
      <div class="modal-header">
        <div class="modal-title">Movimentação de Estoque</div>
        <button class="modal-close" onclick="closeModal('modal-movim')">×</button>
      </div>
      <div style="background:var(--bg-input);border-radius:var(--radius-sm);padding:12px 16px;margin-bottom:16px">
        <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px">Suprimento</div>
        <div id="movim-sup-nome" style="font-weight:700;font-size:14px"></div>
        <div id="movim-sup-info" style="font-size:12px;color:var(--text-secondary);margin-top:2px"></div>
      </div>
      <div class="form-grid" style="grid-template-columns:1fr;gap:12px;margin-bottom:14px">
        <div class="form-group"><label>Tipo de Movimentação</label>
          <select id="movim-tipo" onchange="previewMovim()">
            <option value="entrada">Entrada (Recebimento)</option>
            <option value="saida">Saída (Consumo)</option>
            <option value="ajuste">Ajuste de Inventário</option>
          </select>
        </div>
        <div class="form-group"><label>Quantidade</label><input id="movim-qtd" type="number" min="0.1" step="0.1" placeholder="0" oninput="previewMovim()"></div>
        <div class="form-group"><label>Observação (opcional)</label><input id="movim-obs" placeholder="Recebimento NF 12345..."></div>
      </div>
      <div id="movim-preview" style="background:var(--bg-input);border-radius:var(--radius-sm);padding:10px 14px;font-size:13px;margin-bottom:16px;display:none">
        <span style="color:var(--text-muted)">Estoque atual:</span> <strong id="movim-atual"></strong>
        <span style="margin:0 6px;color:var(--text-muted)">→</span>
        <span style="color:var(--text-muted)">Novo estoque:</span> <strong id="movim-novo" style="color:var(--accent-green)"></strong>
      </div>
      <div class="form-actions">
        <button class="btn btn-outline" onclick="closeModal('modal-movim')">Cancelar</button>
        <button class="btn btn-primary" onclick="confirmarMovim()">Confirmar Movimentação</button>
      </div>
    </div>
  </div>

  <!-- Modal Confirmar Exclusão Suprimento -->
  <div class="modal-overlay" id="modal-del-sup">
    <div class="modal" style="width:420px">
      <div class="modal-header">
        <div class="modal-title" style="color:var(--accent-red)">Excluir Suprimento</div>
        <button class="modal-close" onclick="closeModal('modal-del-sup')">×</button>
      </div>
      <div style="font-size:14px;color:var(--text-secondary);margin-bottom:20px;line-height:1.6">
        Tem certeza que deseja excluir <strong id="del-sup-nome" style="color:var(--text-primary)"></strong>?<br>
        <span style="color:var(--text-muted);font-size:13px">Esta ação não pode ser desfeita.</span>
      </div>
      <div class="form-actions">
        <button class="btn btn-outline" onclick="closeModal('modal-del-sup')">Cancelar</button>
        <button class="btn btn-danger" onclick="confirmarExcluirSuprimento()">Excluir</button>
      </div>
    </div>
  </div>

  <!-- Modal Mecânico -->
  <div class="modal-overlay" id="modal-mecanico">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title" id="modal-mec-title">Cadastrar Mecânico</div>
        <button class="modal-close" onclick="closeModal('modal-mecanico')">×</button>
      </div>
      <div class="form-grid">
        <div class="form-group"><label>Nome Completo</label><input id="mec-nome" placeholder="João Silva"></div>
        <div class="form-group"><label>Cargo / Função</label><input id="mec-func" placeholder="Mecânico Tecelagem"></div>
        <div class="form-group"><label>Turno</label>
          <select id="mec-turno">
            <option>Manhã (06h-14h)</option><option>Tarde (14h-22h)</option>
            <option>Noite (22h-06h)</option><option>Adm.</option>
          </select>
        </div>
        <div class="form-group"><label>Telefone</label><input id="mec-tel" placeholder="(83) 99900-0000"></div>
        <div class="form-group"><label>Nível de Acesso</label>
          <select id="mec-nivel"><option value="tecnico">Técnico</option><option value="supervisor">Supervisor</option><option value="administrador">Administrador</option></select>
        </div>
        <div class="form-group"><label>Cor do Avatar</label>
          <select id="mec-cor"><option value="blue">Azul</option><option value="green">Verde</option><option value="amber">Âmbar</option><option value="purple">Roxo</option></select>
        </div>
      </div>
      <div class="form-actions">
        <button class="btn btn-outline" onclick="closeModal('modal-mecanico')">Cancelar</button>
        <button class="btn btn-primary" onclick="salvarMecanico()">Salvar Mecânico</button>
      </div>
    </div>
  </div>

  <!-- Modal Confirmar Exclusão Mecânico -->
  <div class="modal-overlay" id="modal-del-mec">
    <div class="modal" style="width:420px">
      <div class="modal-header">
        <div class="modal-title" style="color:var(--accent-red)">Excluir Mecânico</div>
        <button class="modal-close" onclick="closeModal('modal-del-mec')">×</button>
      </div>
      <div style="font-size:14px;color:var(--text-secondary);margin-bottom:20px;line-height:1.6">
        Tem certeza que deseja excluir <strong id="del-mec-nome" style="color:var(--text-primary)"></strong>?
      </div>
      <div class="form-actions">
        <button class="btn btn-outline" onclick="closeModal('modal-del-mec')">Cancelar</button>
        <button class="btn btn-danger" onclick="confirmarExcluirMecanico()">Excluir</button>
      </div>
    </div>
  </div>

  <!-- Modal Novo Agendamento -->
  <div class="modal-overlay" id="modal-agend">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">Novo Agendamento</div>
        <button class="modal-close" onclick="closeModal('modal-agend')">×</button>
      </div>
      <div class="form-grid">
        <div class="form-group full"><label>Máquina</label><select id="sel-maquina-agend"></select></div>
        <div class="form-group"><label>Tipo de Manutenção</label>
          <select><option>Preventiva</option><option>Corretiva</option><option>Preditiva</option></select>
        </div>
        <div class="form-group"><label>Prioridade</label>
          <select><option value="baixa">Baixa</option><option value="media">Média</option><option value="alta">Alta</option><option value="critica">Crítica</option></select>
        </div>
        <div class="form-group"><label>Mecânico Responsável</label>
          <select><option>José Silva</option><option>Carlos Lima</option><option>João Nunes</option><option>Pedro Costa</option><option>Marco Ferreira</option></select>
        </div>
        <div class="form-group"><label>Data / Hora</label><input type="datetime-local"></div>
        <div class="form-group full"><label>Descrição</label><textarea placeholder="Descreva o serviço a ser executado..."></textarea></div>
      </div>
      <div class="form-actions">
        <button class="btn btn-outline" onclick="closeModal('modal-agend')">Cancelar</button>
        <button class="btn btn-primary" onclick="salvarAgendamento()">Agendar Manutenção</button>
      </div>
    </div>
  </div>

  <!-- Modal Detalhes OS -->
  <div class="modal-overlay" id="modal-detalhes-os">
    <div class="modal" style="width:680px">
      <div class="modal-header">
        <div>
          <div class="modal-title" id="det-os-titulo"></div>
          <div id="det-os-badges" style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap"></div>
        </div>
        <button class="modal-close" onclick="closeModal('modal-detalhes-os')">×</button>
      </div>
      <div class="grid-2" id="det-os-info" style="margin-bottom:16px;gap:10px"></div>
      <div style="margin-bottom:16px">
        <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px">Descrição</div>
        <div id="det-os-desc" style="font-size:13px;color:var(--text-secondary);line-height:1.6;background:var(--bg-input);padding:12px;border-radius:var(--radius-sm)"></div>
      </div>
      <div id="det-os-checklist-wrap" style="display:none;margin-bottom:16px">
        <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px">Checklist</div>
        <div id="det-os-checklist" style="border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden"></div>
      </div>
      <div id="det-os-sup-wrap" style="display:none;margin-bottom:16px">
        <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px">Suprimentos Utilizados</div>
        <div id="det-os-sup-lista" style="border:1px solid var(--border);border-radius:var(--radius-sm);padding:4px 12px"></div>
      </div>
      <div id="det-os-laudo-wrap" style="display:none;margin-bottom:16px">
        <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px">Laudo Técnico</div>
        <div id="det-os-laudo" style="font-size:13px;color:var(--text-secondary);background:var(--bg-input);padding:12px;border-radius:var(--radius-sm);line-height:1.6;font-style:italic"></div>
      </div>
      <div class="form-actions" id="det-os-actions"></div>
    </div>
  </div>

  <!-- Modal Histórico de Máquina -->
  <div class="modal-overlay" id="modal-historico">
    <div class="modal" style="width:720px">
      <div class="modal-header">
        <div>
          <div class="modal-title" id="hist-modal-titulo"></div>
          <div id="hist-modal-sub" style="font-size:12px;color:var(--text-muted);margin-top:3px"></div>
        </div>
        <button class="modal-close" onclick="closeModal('modal-historico')">×</button>
      </div>
      <div class="grid-4" id="hist-kpis" style="margin-bottom:16px;gap:8px"></div>
      <div class="tabs" id="hist-tabs">
        <div class="tab active" onclick="setHistTab(this,'lista')">Lista de OS</div>
        <div class="tab" onclick="setHistTab(this,'timeline')">Timeline</div>
      </div>
      <!-- Lista -->
      <div id="hist-lista">
        <div id="hist-empty" style="display:none;text-align:center;padding:24px;color:var(--text-muted);font-size:13px">Nenhuma OS encontrada para esta máquina.</div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>OS</th><th>Tipo</th><th>Mecânico</th><th>Data</th><th>Duração</th><th>Status</th></tr></thead>
            <tbody id="hist-tbody"></tbody>
          </table>
        </div>
      </div>
      <!-- Timeline -->
      <div id="hist-timeline-view" style="display:none">
        <div class="timeline" id="hist-timeline-items"></div>
      </div>
      <div class="form-actions" style="margin-top:16px">
        <button class="btn btn-outline" onclick="closeModal('modal-historico')">Fechar</button>
        <button class="btn btn-primary" onclick="abrirOSMaquinaFromHist()">Criar OS para esta Máquina</button>
      </div>
    </div>
  </div>

  `;
}

// ---- Search & filter listeners ----
function initFiltros() {
  // Máquinas: search
  const searchMaq = document.getElementById('search-maq');
  if (searchMaq) {
    searchMaq.addEventListener('input', function () {
      const q = this.value.toLowerCase();
      document.querySelectorAll('#tbody-maquinas tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  // Máquinas: status + category filters
  const pageMaq = document.getElementById('page-maquinas');
  if (pageMaq) {
    const selects   = pageMaq.querySelectorAll('select');
    const statusSel = selects[0];
    const catSel    = selects[1];
    function applyMaqFilters() {
      const statusVal = statusSel.value;
      const catVal    = catSel.value;
      document.querySelectorAll('#tbody-maquinas tr').forEach(row => {
        const badges  = row.querySelector('td:nth-child(8)');
        const catCell = row.querySelector('td:nth-child(3)');
        let show = true;
        if (statusVal !== 'Todos os status') {
          show = show && badges && badges.textContent.includes(statusVal === 'Em manutenção' ? 'Em Manutenção' : statusVal);
        }
        if (catVal !== 'Todas categorias') {
          show = show && catCell && catCell.textContent.trim() === catVal;
        }
        row.style.display = show ? '' : 'none';
      });
    }
    statusSel.addEventListener('change', applyMaqFilters);
    catSel.addEventListener('change', applyMaqFilters);
  }

  // Agendamentos: tipo + status filters
  const pageAgend = document.getElementById('page-agendamentos');
  if (pageAgend) {
    const selects   = pageAgend.querySelectorAll('select');
    const tipoSel   = selects[0];
    const statusSel = selects[1];
    const statusKey = { 'Pendente':'pendente', 'Em Execução':'exec', 'Concluído':'concluido', 'Cancelado':'cancelado' };
    function applyOSFilters() {
      const tipoVal   = tipoSel.value.toLowerCase();
      const statusVal = statusSel.value;
      document.querySelectorAll('#lista-os .os-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        let show = true;
        if (tipoVal !== 'todos os tipos') show = show && text.includes(tipoVal);
        if (statusVal !== 'Todos os status') {
          const key = statusKey[statusVal];
          show = show && key && card.innerHTML.includes('badge-' + key);
        }
        card.style.display = show ? '' : 'none';
      });
    }
    tipoSel.addEventListener('change', applyOSFilters);
    statusSel.addEventListener('change', applyOSFilters);
  }

  // Suprimentos: search + category
  const pageSup = document.getElementById('page-suprimentos');
  if (pageSup) {
    const searchIn = pageSup.querySelector('input[type=text]');
    const catSel   = pageSup.querySelector('select');
    function applySupFilter() {
      const q   = searchIn.value.toLowerCase();
      const cat = catSel.value;
      document.querySelectorAll('#tbody-suprimentos tr').forEach(row => {
        const text    = row.textContent.toLowerCase();
        const catCell = row.querySelector('td:nth-child(3)');
        let show = text.includes(q);
        if (cat !== 'Todas categorias') show = show && catCell && catCell.textContent.trim() === cat;
        row.style.display = show ? '' : 'none';
      });
    }
    searchIn.addEventListener('input', applySupFilter);
    catSel.addEventListener('change', applySupFilter);
  }

  // Mecânicos: search
  const pageMec = document.getElementById('page-mecanicos');
  if (pageMec) {
    const searchIn = pageMec.querySelector('input[type=text]');
    if (searchIn) {
      searchIn.addEventListener('input', function () {
        const q = this.value.toLowerCase();
        document.querySelectorAll('#grid-mecanicos .mec-card').forEach(card => {
          card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      });
    }
  }
}
