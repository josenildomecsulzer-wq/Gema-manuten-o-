# GEMAN — Gestor de Manutenção de Tecelagem

Sistema de gestão de manutenção industrial para tecelagem com suporte a Firebase Firestore (modo online) e armazenamento local (modo offline).

---

## Estrutura do Projeto

```
geman/
├── index.html              # Entry point principal
├── vercel.json             # Configuração de deploy (Vercel)
│
├── css/
│   ├── base.css            # Variáveis CSS, reset, tipografia, helpers
│   ├── components.css      # Botões, badges, cards, tabelas, formulários,
│   │                       # modais, alertas, progresso, OS cards,
│   │                       # notificações, timeline, gráficos,
│   │                       # mecânicos, suprimentos, tabs
│   ├── layout.css          # Sidebar, topbar, main, grids, loading,
│   │                       # aviso de DB, indicador de DB
│   └── print.css           # Estilos para impressão / PDF
│
└── js/
    ├── data.js             # Dados seed e estado global (MAQUINAS, SUPRIMENTOS, etc.)
    ├── firebase.js         # Conexão Firebase, CRUD helpers, listeners em tempo real
    ├── ui.js               # Navegação, modais, toast, tabs, badges
    ├── render.js           # Todas as funções de renderização DOM
    ├── charts.js           # Gráficos Chart.js (dashboard + relatórios)
    ├── crud.js             # CRUD de máquinas, suprimentos, mecânicos,
    │                       # movimentação de estoque, export PDF
    ├── execucao.js         # Motor de execução de OS: timer, checklist,
    │                       # suprimentos utilizados, finalização
    ├── notificacoes.js     # Engine de notificações
    ├── modals.js           # Injeção de HTML dos modais + listeners de filtros
    └── app.js              # Bootstrap: injeta páginas, inicializa app
```

---

## Funcionalidades

- **Dashboard** — KPIs, gráficos de manutenção, timeline, alertas de estoque
- **Máquinas** — Cadastro, busca, filtros, histórico por máquina
- **Suprimentos** — Estoque, movimentação (entrada/saída/ajuste), alertas críticos
- **Mecânicos** — Cadastro, KPIs de performance (OS/mês, MTTR)
- **Agendamentos** — Lista de OS com filtros por tipo e status
- **Execução de OS** — Timer, checklist de manutenção, suprimentos utilizados, laudo técnico, finalização
- **Relatórios** — Visão geral, máquinas, mecânicos, suprimentos, MTTR/MTBF
- **Notificações** — Central com filtros, marcar lidas, dispensar
- **Export PDF** — Laudo técnico completo por OS

---

## Banco de Dados

### Modo Local (padrão)
Funciona sem configuração. Dados ficam em memória (não persistem entre sessões).

### Modo Firebase (persistência real)
1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Crie um projeto → Adicione um app Web
3. Copie o `firebaseConfig`
4. No app, clique no indicador **"Local"** no canto superior direito
5. Cole as credenciais e clique em **Salvar e Conectar**

---

## Deploy na Vercel

### Via CLI
```bash
npm i -g vercel
cd geman
vercel
```

### Via interface web
1. Arraste a pasta `geman/` para [vercel.com/new](https://vercel.com/new)
2. O `vercel.json` já está configurado — nenhuma configuração extra necessária

### Via GitHub
1. Suba a pasta `geman/` como repositório
2. Importe no Vercel → Deploy automático

---

## Desenvolvimento local

Basta abrir `index.html` diretamente no navegador — não precisa de servidor.

Ou use um servidor local simples:
```bash
# Python
python3 -m http.server 3000

# Node.js (npx)
npx serve .
```
