/* =============================================
   app.js — Application bootstrap
   Injects page HTML, boots Firebase/local,
   renders everything
   ============================================= */

function injectPages() {
  document.getElementById('pages-container').innerHTML = `

  <!-- DASHBOARD -->
  <div class="page active" id="page-dashboard">
    <div class="grid-4">
      <div class="stat-card blue">
        <div class="stat-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 3v2H7V3H5v2H3v4l2 2v8h14v-8l2-2V5h-2V3h-2v2h-2V3H9m0 4h6v2h2v2l-2 2v6H9v-6L7 9V7h2z"/></svg></div>
        <div class="stat-label">Total de Máquinas</div>
        <div class="stat-value">30</div>
        <div class="stat-sub">28 ativas · 1 manutenção · 1 parada</div>
      </div>
      <div class="stat-card amber">
        <div class="stat-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .89-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2z"/></svg></div>
        <div class="stat-label">Manutenções Pendentes</div>
        <div class="stat-value" style="color:var(--accent-amber)">7</div>
        <div class="stat-sub">2 críticas · 3 altas · 2 médias</div>
      </div>
      <div class="stat-card cyan">
        <div class="stat-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg></div>
        <div class="stat-label">Em Execução</div>
        <div class="stat-value" style="color:var(--accent-cyan)">3</div>
        <div class="stat-sub">2 preventivas · 1 corretiva</div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg></div>
        <div class="stat-label">Concluídas no Mês</div>
        <div class="stat-value" style="color:var(--accent-green)">41</div>
        <div class="stat-sub">MTTR: 4.2h · MTBF: 312h</div>
      </div>
    </div>

    <div class="grid-2 mt-16">
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 21H2V3h2v16h2v-9h4v9h2V6h4v13h2v-5h4v5z"/></svg>
            Manutenções por Tipo — Março 2025
          </div>
        </div>
        <div class="chart-container"><canvas id="chartTipos"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2"/></svg>
            Consumo de Suprimentos (L/Kg)
          </div>
        </div>
        <div class="chart-container"><canvas id="chartSuprimentos"></canvas></div>
      </div>
    </div>

    <div class="grid-2 mt-16">
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>
            Próximas Manutenções
          </div>
          <button class="btn btn-outline" onclick="showPage('agendamentos',null)" style="font-size:12px;padding:5px 10px">Ver todas</button>
        </div>
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-dot blue"></div>
            <div class="timeline-time">Hoje 14:00 · OS #11185</div>
            <div class="timeline-text"><strong>Máq. 13 — Terryplus-i</strong> · Preventiva · José Silva</div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot amber"></div>
            <div class="timeline-time">Hoje 16:30 · OS #11186</div>
            <div class="timeline-text"><strong>Máq. 01 — Omniplus</strong> · Verificação de correia · Carlos Lima</div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot blue"></div>
            <div class="timeline-time">Amanhã 08:00 · OS #11187</div>
            <div class="timeline-text"><strong>Máq. 46 — Terryplus-i Jac</strong> · Preventiva Geral · João Nunes</div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot green"></div>
            <div class="timeline-time">27/03 09:00 · OS #11188</div>
            <div class="timeline-text"><strong>Máq. 04 — Omniplus-i</strong> · Troca de óleo · Pedro Costa</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 2.77 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
            Performance Mecânicos
          </div>
        </div>
        <div class="chart-container"><canvas id="chartMecanicos"></canvas></div>
      </div>
    </div>

    <div class="card mt-16">
      <div class="card-header">
        <div class="card-title">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22M12 6l7.5 13h-15M11 10v4h2v-4m0 6v2h-2v-2"/></svg>
          Alertas de Estoque Baixo
        </div>
      </div>
      <div id="supply-alerts">
        <div class="supply-row">
          <div class="supply-name">Óleo Mobil Gear 600 XP 150 <span class="badge badge-estoque">CRÍTICO</span></div>
          <div class="supply-bar-wrap"><div class="progress-bar"><div class="progress-fill progress-red" style="width:20%"></div></div></div>
          <div class="supply-qty" style="color:var(--accent-red)">2 L</div>
        </div>
        <div class="supply-row">
          <div class="supply-name">Óleo Mobil SHC 629</div>
          <div class="supply-bar-wrap"><div class="progress-bar"><div class="progress-fill progress-amber" style="width:35%"></div></div></div>
          <div class="supply-qty" style="color:var(--accent-amber)">3.5 L</div>
        </div>
        <div class="supply-row">
          <div class="supply-name">Correia Dentada Picanol 6R</div>
          <div class="supply-bar-wrap"><div class="progress-bar"><div class="progress-fill progress-amber" style="width:40%"></div></div></div>
          <div class="supply-qty" style="color:var(--accent-amber)">2 un</div>
        </div>
        <div class="supply-row">
          <div class="supply-name">Filtro de Ar C280</div>
          <div class="supply-bar-wrap"><div class="progress-bar"><div class="progress-fill progress-blue" style="width:55%"></div></div></div>
          <div class="supply-qty">5 un</div>
        </div>
      </div>
    </div>
  </div>

  <!-- NOTIFICAÇÕES -->
  <div class="page" id="page-notificacoes">
    <div class="card">
      <div class="card-header">
        <div style="display:flex;align-items:center;gap:12px">
          <div class="card-title">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 6.5c0-2.5-2-4.5-4.5-4.5S12 4 12 6.5c0 3.9-1.8 5.4-3 6.5H3v2h18v-2c-1.2-1.1-3-2.6-3-6.5"/></svg>
            Central de Notificações
          </div>
          <span id="notif-count-badge" class="badge badge-corretiva" style="display:none"></span>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <select id="notif-filtro" style="width:150px;font-size:12px;padding:6px 10px" onchange="renderNotificacoes()">
            <option value="todas">Todas</option>
            <option value="nao-lidas">Não lidas</option>
            <option value="critica">Críticas</option>
            <option value="alerta">Alertas</option>
            <option value="info">Informações</option>
            <option value="sucesso">Concluídas</option>
          </select>
          <button class="btn btn-outline" style="font-size:12px;padding:5px 10px" onclick="marcarTodasLidas()">Marcar todas lidas</button>
          <button class="btn btn-outline" style="font-size:12px;padding:5px 10px" onclick="limparLidas()">Limpar lidas</button>
        </div>
      </div>
      <div id="notif-list"></div>
      <div id="notif-empty" style="display:none;text-align:center;padding:32px;color:var(--text-muted)">
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32" style="opacity:.3;margin-bottom:8px"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
        <div>Nenhuma notificação.</div>
      </div>
    </div>
  </div>

  <!-- MÁQUINAS -->
  <div class="page" id="page-maquinas">
    <div class="flex-between mb-16">
      <div style="display:flex;gap:8px">
        <input type="text" placeholder="Buscar máquina..." style="width:240px" id="search-maq">
        <select style="width:160px">
          <option>Todos os status</option><option>Ativo</option><option>Em manutenção</option><option>Parado</option>
        </select>
        <select style="width:160px">
          <option>Todas categorias</option><option>Tecido Brim</option><option>Tecido Lençol</option><option>Felpudo</option><option>Felpudo Jac</option>
        </select>
      </div>
      <button class="btn btn-primary" onclick="openModal('modal-maquina')">
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        Nova Máquina
      </button>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table id="tabela-maquinas">
          <thead>
            <tr><th>Código</th><th>Nome / Modelo</th><th>Categoria</th><th>Fabricante</th><th>Nº Série</th><th>Data Aq.</th><th>Velocidade</th><th>Status</th><th>Ações</th></tr>
          </thead>
          <tbody id="tbody-maquinas"></tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- SUPRIMENTOS -->
  <div class="page" id="page-suprimentos">
    <div class="flex-between mb-16">
      <div style="display:flex;gap:8px">
        <input type="text" placeholder="Buscar suprimento..." style="width:240px">
        <select style="width:160px">
          <option>Todas categorias</option><option>Óleos e Lubrificantes</option><option>Peças Mecânicas</option><option>Filtros</option><option>Elétrico/Eletrônico</option>
        </select>
      </div>
      <button class="btn btn-primary" onclick="abrirNovoSuprimento()">
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        Novo Suprimento
      </button>
    </div>
    <div class="grid-4 mb-16">
      <div class="stat-card blue"><div class="stat-label">Total de Itens</div><div class="stat-value">—</div></div>
      <div class="stat-card red"><div class="stat-label">Estoque Crítico</div><div class="stat-value" style="color:var(--accent-red)">—</div></div>
      <div class="stat-card amber"><div class="stat-label">Estoque Baixo</div><div class="stat-value" style="color:var(--accent-amber)">—</div></div>
      <div class="stat-card green"><div class="stat-label">Itens OK</div><div class="stat-value" style="color:var(--accent-green)">—</div></div>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Código</th><th>Nome do Suprimento</th><th>Categoria</th><th>Qtd. Estoque</th><th>Qtd. Mínima</th><th>Localização</th><th>Status</th><th>Ações</th></tr>
          </thead>
          <tbody id="tbody-suprimentos"></tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- MECÂNICOS -->
  <div class="page" id="page-mecanicos">
    <div class="flex-between mb-16">
      <input type="text" placeholder="Buscar mecânico..." style="width:240px">
      <button class="btn btn-primary" onclick="abrirNovoMecanico()">
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        Novo Mecânico
      </button>
    </div>
    <div class="grid-3" id="grid-mecanicos"></div>
  </div>

  <!-- AGENDAMENTOS -->
  <div class="page" id="page-agendamentos">
    <div class="flex-between mb-16">
      <div style="display:flex;gap:8px">
        <select style="width:160px">
          <option>Todos os tipos</option><option>Preventiva</option><option>Corretiva</option><option>Preditiva</option>
        </select>
        <select style="width:160px">
          <option>Todos os status</option><option>Pendente</option><option>Em Execução</option><option>Concluído</option><option>Cancelado</option>
        </select>
      </div>
      <button class="btn btn-primary" onclick="openModal('modal-agend')">
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        Novo Agendamento
      </button>
    </div>
    <div id="lista-os"></div>
  </div>

  <!-- EXECUÇÃO -->
  <div class="page" id="page-execucao">
    <div class="grid-2">
      <div>
        <div class="card mb-16">
          <div class="card-header">
            <div class="card-title">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
              OS em Execução
            </div>
          </div>
          <div id="os-execucao-list"></div>
        </div>
        <div class="card" id="card-sup-utilizados" style="display:none">
          <div class="card-header">
            <div class="card-title">Suprimentos Utilizados</div>
          </div>
          <div style="display:flex;gap:8px;margin-bottom:12px">
            <select id="exec-sup-sel" style="flex:1;font-size:13px"></select>
            <input id="exec-sup-qtd" type="number" min="0.1" step="0.1" placeholder="Qtd." style="width:80px">
            <button class="btn btn-primary" style="padding:7px 12px;font-size:12px" onclick="adicionarSuprimentoOS()">+</button>
          </div>
          <div id="exec-sup-lista" style="font-size:13px"></div>
        </div>
      </div>

      <div>
        <div id="exec-empty" class="card" style="text-align:center;padding:40px">
          <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40" style="color:var(--text-muted);margin-bottom:12px"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
          <div style="font-size:14px;font-weight:600;color:var(--text-secondary);margin-bottom:4px">Nenhuma OS selecionada</div>
          <div style="font-size:13px;color:var(--text-muted)">Selecione uma OS em execução à esquerda para abrir o painel</div>
        </div>

        <div id="exec-painel" style="display:none">
          <div class="card mb-16">
            <div class="card-header">
              <div>
                <div id="exec-titulo" style="font-family:var(--font-cond);font-size:17px;font-weight:700"></div>
                <div id="exec-maq" style="font-size:13px;color:var(--text-muted);margin-top:2px"></div>
              </div>
              <div style="display:flex;gap:6px;align-items:center">
                <div id="exec-tipo-badge"></div>
                <div id="exec-prior-badge"></div>
              </div>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;background:var(--bg-input);border-radius:var(--radius-sm);padding:12px 16px;margin-bottom:16px">
              <div>
                <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em">Mecânico</div>
                <div id="exec-mec" style="font-weight:600;font-size:14px;margin-top:2px"></div>
              </div>
              <div style="text-align:right">
                <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em">Tempo Decorrido</div>
                <div id="exec-timer" style="font-family:var(--font-cond);font-size:24px;font-weight:700;color:var(--accent-cyan);letter-spacing:.05em;margin-top:2px">00:00:00</div>
              </div>
            </div>
            <div style="margin-bottom:16px">
              <div style="font-size:12px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between">
                Checklist de Manutenção <span id="exec-checklist-prog" style="color:var(--text-muted);font-weight:400"></span>
              </div>
              <div id="checklist-items"></div>
            </div>
            <div style="margin-bottom:16px">
              <div style="font-size:12px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Laudo Técnico</div>
              <textarea id="exec-laudo" placeholder="Descreva os serviços realizados, peças substituídas, observações técnicas..." style="min-height:100px"></textarea>
              <div id="exec-rascunho-info" style="display:none;font-size:11px;color:var(--text-muted);margin-top:4px">
                Rascunho salvo às <span id="exec-rascunho-hora"></span>
              </div>
            </div>
            <div style="display:flex;gap:8px;justify-content:flex-end">
              <button class="btn btn-outline" onclick="salvarRascunho()">Salvar Rascunho</button>
              <button class="btn btn-primary" onclick="finalizarOS()">
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                Finalizar OS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- RELATÓRIOS -->
  <div class="page" id="page-relatorios">
    <div class="tabs" id="rel-tabs">
      <div class="tab active" onclick="setTab(this,'rel-visao-geral')">Visão Geral</div>
      <div class="tab" onclick="setTab(this,'rel-maquinas')">Máquinas</div>
      <div class="tab" onclick="setTab(this,'rel-mecanicos')">Mecânicos</div>
      <div class="tab" onclick="setTab(this,'rel-suprimentos')">Suprimentos</div>
      <div class="tab" onclick="setTab(this,'rel-mttr')">MTTR / MTBF</div>
    </div>

    <!-- Visão Geral -->
    <div id="rel-visao-geral">
      <div class="grid-4 mb-16">
        <div class="stat-card blue"><div class="stat-label">Total OS (Mês)</div><div class="stat-value">41</div><div class="stat-sub">↑ 5% vs mês anterior</div></div>
        <div class="stat-card green"><div class="stat-label">Taxa de Conclusão</div><div class="stat-value" style="color:var(--accent-green)">95%</div><div class="stat-sub">39 de 41 finalizadas</div></div>
        <div class="stat-card amber"><div class="stat-label">MTTR Médio</div><div class="stat-value" style="color:var(--accent-amber)">4.2h</div><div class="stat-sub">↓ 0.3h vs mês anterior</div></div>
        <div class="stat-card cyan"><div class="stat-label">MTBF Médio</div><div class="stat-value" style="color:var(--accent-cyan)">312h</div><div class="stat-sub">↑ 7h vs mês anterior</div></div>
      </div>
      <div class="grid-2 mb-16">
        <div class="card">
          <div class="card-header"><div class="card-title">Distribuição por Tipo</div></div>
          <div class="chart-container"><canvas id="chartRelTipo"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">Evolução Mensal de OS</div></div>
          <div class="chart-container"><canvas id="chartRelMensal"></canvas></div>
        </div>
      </div>
    </div>

    <!-- Máquinas -->
    <div id="rel-maquinas" style="display:none">
      <div class="grid-2 mb-16">
        <div class="card">
          <div class="card-header"><div class="card-title">Status do Parque</div></div>
          <div class="chart-container"><canvas id="chartRelMaqStatus"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">OS por Categoria</div></div>
          <div class="chart-container"><canvas id="chartRelMaqCat"></canvas></div>
        </div>
      </div>
    </div>

    <!-- Mecânicos -->
    <div id="rel-mecanicos" style="display:none">
      <div class="grid-2 mb-16">
        <div class="card">
          <div class="card-header"><div class="card-title">OS por Mecânico (mês)</div></div>
          <div class="chart-container"><canvas id="chartRelMecOS"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">MTTR por Mecânico</div></div>
          <div class="chart-container"><canvas id="chartRelMecMttr"></canvas></div>
        </div>
      </div>
    </div>

    <!-- Suprimentos -->
    <div id="rel-suprimentos" style="display:none">
      <div class="card mb-16">
        <div class="card-header"><div class="card-title">Estoque Atual vs Mínimo</div></div>
        <div class="chart-container" style="height:240px"><canvas id="chartRelSupEstoque"></canvas></div>
      </div>
    </div>

    <!-- MTTR / MTBF -->
    <div id="rel-mttr" style="display:none">
      <div class="grid-2 mb-16">
        <div class="card">
          <div class="card-header"><div class="card-title">MTTR por Tipo de OS</div></div>
          <div class="chart-container"><canvas id="chartMttrTipo"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">Evolução MTBF (6 meses)</div></div>
          <div class="chart-container"><canvas id="chartMtbfEvolucao"></canvas></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">MTTR / MTBF por Máquina</div></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Máquina</th><th>Categoria</th><th>Paradas</th><th>MTTR (h)</th><th>MTBF (h)</th><th>Disponibilidade</th><th>Tendência</th></tr></thead>
            <tbody id="tbody-rel-mttr"></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  `;
}

// ---- App boot ----
async function iniciarApp() {
  setLoadingProgress(5, 'Iniciando GEMAN...');

  // Inject HTML
  injectModals();
  injectPages();

  const saved = localStorage.getItem(LS_KEY);
  if (saved) {
    try {
      const cfg = JSON.parse(saved);
      setLoadingProgress(10, 'Restaurando conexão Firebase...');
      if (firebase.apps.length === 0) firebase.initializeApp(cfg);
      db = firebase.firestore();
      await db.collection('_ping').doc('test').set({ t: Date.now() });
      DB_MODE = 'firebase';
      setLoadingProgress(15, 'Conectado! Carregando dados...');
    } catch (e) {
      console.warn('Firebase restore failed, switching to local mode:', e);
      DB_MODE = 'local';
    }
  }

  await carregarDados();
  renderizarTudo();
  atualizarIndicadorDB();
  hideLoading();
  initFiltros();

  if (DB_MODE === 'local') {
    setTimeout(() => {
      document.getElementById('db-config-notice').style.display = 'flex';
    }, 800);
  }
}

// Boot
iniciarApp();
