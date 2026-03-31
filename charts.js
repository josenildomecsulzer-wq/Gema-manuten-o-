/* =============================================
   charts.js — All Chart.js initializations
   ============================================= */

let chartsInit  = false;
let _relInit    = {};
let relChartsInit = false;

const C = '#94a3b8'; // text color for chart axes
const G = 'rgba(255,255,255,0.05)'; // grid line color

function mkChart(id, cfg) {
  const canvas = document.getElementById(id);
  if (!canvas) return null;
  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();
  return new Chart(canvas, cfg);
}

// ---- Dashboard charts ----
function initCharts() {
  if (chartsInit) return;
  chartsInit = true;

  // Manutenções por tipo (bar)
  mkChart('chartTipos', {
    type: 'bar',
    data: {
      labels: ['Jan','Fev','Mar','Abr','Mai','Jun'],
      datasets: [
        { label:'Preventiva', data:[12,15,18,14,16,19], backgroundColor:'rgba(37,99,235,.6)', borderRadius:4 },
        { label:'Corretiva',  data:[5,4,6,3,5,4],       backgroundColor:'rgba(239,68,68,.6)',  borderRadius:4 },
        { label:'Preditiva',  data:[2,3,3,4,3,5],       backgroundColor:'rgba(139,92,246,.5)', borderRadius:4 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: C, font: { size: 11 } } } },
      scales: {
        y: { grid: { color: G }, ticks: { color: C }, stacked: true },
        x: { grid: { display: false }, ticks: { color: C }, stacked: true }
      }
    }
  });

  // Consumo de suprimentos (line)
  mkChart('chartSuprimentos', {
    type: 'line',
    data: {
      labels: ['Jan','Fev','Mar','Abr','Mai','Jun'],
      datasets: [
        { label:'Óleo (L)',    data:[18,22,25,20,24,28], borderColor:'#06b6d4', backgroundColor:'rgba(6,182,212,.1)', tension:.4, fill:true },
        { label:'Filtros (un)',data:[4,5,6,4,5,7],       borderColor:'#f59e0b', backgroundColor:'rgba(245,158,11,.1)',tension:.4, fill:true },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: C, font: { size: 11 } } } },
      scales: {
        y: { grid: { color: G }, ticks: { color: C } },
        x: { grid: { display: false }, ticks: { color: C } }
      }
    }
  });

  // Performance mecânicos (horizontal bar)
  mkChart('chartMecanicos', {
    type: 'bar',
    data: {
      labels: MECANICOS.map(m => m.nome.split(' ')[0]),
      datasets: [{ label:'OS/mês', data: MECANICOS.map(m => m.os), backgroundColor:'rgba(37,99,235,.6)', borderRadius:4 }]
    },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: G }, ticks: { color: C } },
        y: { grid: { display: false }, ticks: { color: C } }
      }
    }
  });
}

// ---- Relatórios charts ----
function initRelatorioCharts() {
  if (relChartsInit) return;
  relChartsInit = true;
  initRelVisaoGeral();
}

function initRelVisaoGeral() {
  if (_relInit.visao) return; _relInit.visao = true;

  mkChart('chartRelTipo', {
    type: 'doughnut',
    data: {
      labels: ['Preventiva','Corretiva','Preditiva'],
      datasets: [{ data:[55,30,15], backgroundColor:['rgba(37,99,235,.7)','rgba(239,68,68,.7)','rgba(139,92,246,.7)'], borderWidth:0 }]
    },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ labels:{ color:C } } } }
  });

  mkChart('chartRelMensal', {
    type: 'line',
    data: {
      labels: ['Out','Nov','Dez','Jan','Fev','Mar'],
      datasets: [
        { label:'Total OS', data:[38,42,35,45,39,41], borderColor:'#2563eb', backgroundColor:'rgba(37,99,235,.1)', tension:.4, fill:true },
        { label:'Concluídas', data:[35,40,33,42,37,39], borderColor:'#10b981', backgroundColor:'rgba(16,185,129,.1)', tension:.4, fill:true },
      ]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ labels:{ color:C } } },
      scales:{ y:{ grid:{ color:G }, ticks:{ color:C } }, x:{ grid:{ display:false }, ticks:{ color:C } } }
    }
  });
}

function initRelMaquinas() {
  if (_relInit.maq) return; _relInit.maq = true;
  mkChart('chartRelMaqStatus', {
    type: 'doughnut',
    data: {
      labels: ['Ativo','Em Manutenção','Parado'],
      datasets: [{ data:[28,1,1], backgroundColor:['rgba(16,185,129,.7)','rgba(245,158,11,.7)','rgba(239,68,68,.7)'], borderWidth:0 }]
    },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ labels:{ color:C } } } }
  });
  mkChart('chartRelMaqCat', {
    type:'bar',
    data:{
      labels:['Tecido Brim','Tecido Lençol','Felpudo','Felpudo Jac'],
      datasets:[{data:[7,7,10,6],backgroundColor:['rgba(37,99,235,.6)','rgba(6,182,212,.6)','rgba(16,185,129,.6)','rgba(139,92,246,.6)'],borderRadius:4}]
    },
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},
      scales:{y:{grid:{color:G},ticks:{color:C}},x:{grid:{display:false},ticks:{color:C}}}}
  });
}

function initRelMecanicos() {
  if (_relInit.mec) return; _relInit.mec = true;
  mkChart('chartRelMecOS', {
    type:'bar',
    data:{
      labels: MECANICOS.map(m=>m.nome.split(' ')[0]),
      datasets:[{label:'OS/mês',data:MECANICOS.map(m=>m.os),backgroundColor:'rgba(37,99,235,.6)',borderRadius:4}]
    },
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},
      scales:{y:{grid:{color:G},ticks:{color:C}},x:{grid:{display:false},ticks:{color:C}}}}
  });
  mkChart('chartRelMecMttr', {
    type:'bar',
    data:{
      labels: MECANICOS.map(m=>m.nome.split(' ')[0]),
      datasets:[{label:'MTTR (h)',data:MECANICOS.map(m=>m.mttr),backgroundColor:'rgba(6,182,212,.6)',borderRadius:4}]
    },
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},
      scales:{y:{grid:{color:G},ticks:{color:C}},x:{grid:{display:false},ticks:{color:C}}}}
  });
}

function initRelSuprimentos() {
  if (_relInit.sup) return; _relInit.sup = true;
  mkChart('chartRelSupEstoque', {
    type:'bar',
    data:{
      labels: SUPRIMENTOS.map(s=>s.cod),
      datasets:[
        {label:'Atual',data:SUPRIMENTOS.map(s=>s.qtd),backgroundColor:'rgba(16,185,129,.5)',borderRadius:4},
        {label:'Mínimo',data:SUPRIMENTOS.map(s=>s.min),backgroundColor:'rgba(239,68,68,.3)',borderRadius:4}
      ]},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{labels:{color:C}}},
      scales:{y:{grid:{color:G},ticks:{color:C}},x:{grid:{display:false},ticks:{color:C,font:{size:10}}}}}
  });
}

function initRelMttr() {
  if (_relInit.mttr) return; _relInit.mttr = true;
  const tbody = document.getElementById('tbody-rel-mttr');
  if (tbody) {
    tbody.innerHTML = MAQUINAS.slice(0, 10).map((m, i) => {
      const stops = OS_LIST.filter(o => o.maq.startsWith(m.id) && o.tipo === 'corretiva').length;
      const mttr  = stops ? (2 + i * 0.3).toFixed(1) : '—';
      const mtbf  = stops ? Math.round(280 + i * 15) : '—';
      const disp  = stops ? (98.5 - i * 0.3).toFixed(1) + '%' : '99.9%';
      const trend = i < 3 ? '↑ Melhora' : i > 7 ? '↓ Piora' : '→ Estável';
      const tColor = i < 3 ? 'var(--accent-green)' : i > 7 ? 'var(--accent-red)' : 'var(--text-muted)';
      return `<tr>
        <td class="primary"><span class="table-code">${m.id}</span></td>
        <td>${m.cat}</td>
        <td style="text-align:center">${stops}</td>
        <td style="text-align:center;color:var(--accent-amber)">${mttr}</td>
        <td style="text-align:center;color:var(--accent-cyan)">${mtbf}</td>
        <td style="text-align:center;color:var(--accent-green)">${disp}</td>
        <td style="color:${tColor};font-size:12px;font-weight:600">${trend}</td>
      </tr>`;
    }).join('');
  }

  mkChart('chartMttrTipo', {
    type:'bar',
    data:{labels:['Preventiva','Corretiva','Preditiva'],
      datasets:[{data:[2.1,6.8,3.4],backgroundColor:['rgba(37,99,235,.5)','rgba(239,68,68,.5)','rgba(139,92,246,.5)'],borderRadius:4}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},
      scales:{y:{grid:{color:G},ticks:{color:C},title:{display:true,text:'Horas',color:C}},x:{grid:{display:false},ticks:{color:C}}}}
  });
  mkChart('chartMtbfEvolucao', {
    type:'line',
    data:{labels:['Out','Nov','Dez','Jan','Fev','Mar'],
      datasets:[{label:'MTBF (h)',data:[280,295,310,305,318,312],borderColor:'#06b6d4',backgroundColor:'rgba(6,182,212,.1)',tension:.4,fill:true}]},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{labels:{color:C}}},
      scales:{y:{grid:{color:G},ticks:{color:C}},x:{grid:{display:false},ticks:{color:C}}}}
  });
}
