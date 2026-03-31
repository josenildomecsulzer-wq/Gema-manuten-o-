/* =============================================
   data.js — Seed data & global state
   ============================================= */

const LS_KEY = 'geman_firebase_config';

let DB_MODE = 'local'; // 'local' | 'firebase'
let db = null;

// ---- In-memory data stores ----
let MAQUINAS    = [];
let SUPRIMENTOS = [];
let MECANICOS   = [];
let OS_LIST     = [];

// ---- Maintenance checklist items ----
const CHECKLIST = [
  'Verificar nível de óleo do cabeçote',
  'Verificar nível de óleo das caixas de câmbio',
  'Lubrificar correntes e guias',
  'Verificar tensão da correia dentada',
  'Limpar filtro de ar',
  'Verificar sensores indutivos',
  'Testar sistema de frenagem',
  'Verificar conexões elétricas',
  'Calibrar densidade (RPM)',
  'Teste de funcionamento em vazio',
];

// ---- Seed data ----
const SEED_MAQUINAS = [
  {id:'Máq. 01',nome:'Tear Omniplus',cat:'Tecido Brim',fab:'Picanol',modelo:'Omniplus-4-P 360',serie:'393002',aq:'30/10/2018',vel:360,status:'ativo'},
  {id:'Máq. 02',nome:'Tear Omniplus',cat:'Tecido Brim',fab:'Picanol',modelo:'Omniplus-4-P 360',serie:'393001',aq:'30/10/2018',vel:360,status:'ativo'},
  {id:'Máq. 03',nome:'Tear Omniplus-i',cat:'Tecido Lençol',fab:'Picanol',modelo:'Omniplus-i Connect-4-P 280',serie:'448062',aq:'30/05/2024',vel:280,status:'ativo'},
  {id:'Máq. 04',nome:'Tear Omniplus-i',cat:'Tecido Lençol',fab:'Picanol',modelo:'Omniplus-i Connect-4-P 280',serie:'448065',aq:'30/05/2024',vel:280,status:'ativo'},
  {id:'Máq. 05',nome:'Tear Omniplus-i',cat:'Tecido Brim',fab:'Picanol',modelo:'Omniplus-i Connect-4-P 360',serie:'443452',aq:'30/05/2023',vel:360,status:'parado'},
  {id:'Máq. 06',nome:'Tear Omniplus-i',cat:'Tecido Lençol',fab:'Picanol',modelo:'Omniplus-i Connect-4-P 280',serie:'443451',aq:'30/05/2023',vel:280,status:'ativo'},
  {id:'Máq. 07',nome:'Tear Omniplus-i',cat:'Tecido Lençol',fab:'Picanol',modelo:'Omniplus-i Connect-4-P 280',serie:'448064',aq:'30/05/2024',vel:280,status:'ativo'},
  {id:'Máq. 08',nome:'Tear Omniplus-i',cat:'Tecido Lençol',fab:'Picanol',modelo:'Omniplus-i Connect-4-P 280',serie:'448063',aq:'30/05/2024',vel:280,status:'ativo'},
  {id:'Máq. 09',nome:'Tear Omniplus-i',cat:'Tecido Brim',fab:'Picanol',modelo:'Omniplus-i-4-P 360',serie:'427120',aq:'30/11/2021',vel:360,status:'manutencao'},
  {id:'Máq. 10',nome:'Tear Omniplus-i',cat:'Tecido Brim',fab:'Picanol',modelo:'Omniplus-i-4-P 360',serie:'427121',aq:'30/11/2021',vel:360,status:'ativo'},
  {id:'Máq. 11',nome:'Tear Omniplus-i',cat:'Tecido Lençol',fab:'Picanol',modelo:'Omniplus-i-4-P 280',serie:'427122',aq:'30/11/2021',vel:280,status:'ativo'},
  {id:'Máq. 12',nome:'Tear Omniplus-i',cat:'Tecido Lençol',fab:'Picanol',modelo:'Omniplus-i Connect-4-P 280',serie:'443450',aq:'30/05/2023',vel:280,status:'ativo'},
  {id:'Máq. 13',nome:'Tear Terryplus-i',cat:'Felpudo',fab:'Picanol',modelo:'Terryplus-i Connct-6-R 280',serie:'448060',aq:'30/05/2024',vel:280,status:'ativo'},
  {id:'Máq. 14',nome:'Tear Terryplus-i',cat:'Felpudo',fab:'Picanol',modelo:'Terryplus-i-6-R 280',serie:'427118',aq:'30/11/2021',vel:280,status:'ativo'},
  {id:'Máq. 15',nome:'Tear Terryplus-i',cat:'Felpudo',fab:'Picanol',modelo:'Terryplus-i-6-R 280',serie:'427119',aq:'30/11/2021',vel:280,status:'ativo'},
  {id:'Máq. 16',nome:'Tear Terryplus Summum',cat:'Felpudo',fab:'Picanol',modelo:'Terryplus Summum-6-R 260',serie:'415744',aq:'30/01/2020',vel:260,status:'ativo'},
  {id:'Máq. 17',nome:'Tear Terryplus-i',cat:'Felpudo',fab:'Picanol',modelo:'Terryplus-i Connct-6-D 280',serie:'448058',aq:'30/05/2024',vel:280,status:'ativo'},
  {id:'Máq. 18',nome:'Tear Terryplus Summum',cat:'Felpudo',fab:'Picanol',modelo:'Terryplus Summum-6-R 260',serie:'406970',aq:'30/10/2018',vel:260,status:'ativo'},
  {id:'Máq. 19',nome:'Tear Terryplus-i',cat:'Felpudo',fab:'Picanol',modelo:'Terryplus-i Connct-6-R 280',serie:'448061',aq:'30/05/2024',vel:280,status:'ativo'},
  {id:'Máq. 20',nome:'Tear Terryplus-i',cat:'Felpudo',fab:'Picanol',modelo:'Terryplus-i-6-R 280',serie:'427117',aq:'30/11/2021',vel:280,status:'ativo'},
  {id:'Máq. 21',nome:'Tear Terryplus Summum',cat:'Felpudo',fab:'Picanol',modelo:'Terryplus Summum-6-R 260',serie:'415743',aq:'30/01/2020',vel:260,status:'ativo'},
  {id:'Máq. 22',nome:'Tear Terryplus Summum',cat:'Felpudo',fab:'Picanol',modelo:'Terryplus Summum-6-R 260',serie:'415745',aq:'30/01/2020',vel:260,status:'ativo'},
  {id:'Máq. 23',nome:'Tear Terryplus-i',cat:'Felpudo',fab:'Picanol',modelo:'Terryplus-i Connct-6-R 280',serie:'448059',aq:'30/05/2024',vel:280,status:'ativo'},
  {id:'Máq. 24',nome:'Tear Terryplus Summum',cat:'Felpudo',fab:'Picanol',modelo:'Terryplus Summum-6-R 260',serie:'406969',aq:'30/10/2018',vel:260,status:'ativo'},
  {id:'Máq. 46',nome:'Tear Terryplus-i Jac',cat:'Felpudo Jac',fab:'Picanol',modelo:'Terryplus-i Connct-6-J 280',serie:'443420',aq:'30/05/2023',vel:280,status:'ativo'},
  {id:'Máq. 47',nome:'Tear Terryplus-i Jac',cat:'Felpudo Jac',fab:'Picanol',modelo:'Terryplus-i Connct-6-J 280',serie:'443419',aq:'30/05/2023',vel:280,status:'ativo'},
  {id:'Máq. 48',nome:'Tear Terryplus-i Jac',cat:'Felpudo Jac',fab:'Picanol',modelo:'Terryplus-i Connct-6-J 280',serie:'448056',aq:'30/05/2024',vel:280,status:'ativo'},
  {id:'Máq. 52',nome:'Tear Terryplus-i Jac',cat:'Felpudo Jac',fab:'Picanol',modelo:'Terryplus-i Connct-6-J 280',serie:'443418',aq:'30/05/2023',vel:280,status:'ativo'},
  {id:'Máq. 53',nome:'Tear Terryplus-i Jac',cat:'Felpudo Jac',fab:'Picanol',modelo:'Terryplus-i Connct-6-J 280',serie:'443417',aq:'30/05/2023',vel:280,status:'ativo'},
  {id:'Máq. 54',nome:'Tear Terryplus-i Jac',cat:'Felpudo Jac',fab:'Picanol',modelo:'Terryplus-i Connct-6-J 280',serie:'448057',aq:'30/05/2024',vel:280,status:'ativo'},
];

const SEED_SUPRIMENTOS = [
  {cod:'OL-001',nome:'Óleo Mobil Gear 600 XP 150',cat:'Óleos e Lubrificantes',qtd:2,min:10,loc:'Prat. A-1',un:'L'},
  {cod:'OL-002',nome:'Óleo Mobil SHC 629',cat:'Óleos e Lubrificantes',qtd:3.5,min:8,loc:'Prat. A-1',un:'L'},
  {cod:'OL-003',nome:'Óleo Mobil Gear 600 XP 320',cat:'Óleos e Lubrificantes',qtd:12,min:5,loc:'Prat. A-2',un:'L'},
  {cod:'PE-001',nome:'Correia Dentada Picanol 6R',cat:'Peças Mecânicas',qtd:2,min:4,loc:'Est. B-3',un:'un'},
  {cod:'PE-002',nome:'Rolamento SKF 6205',cat:'Peças Mecânicas',qtd:8,min:6,loc:'Est. B-1',un:'un'},
  {cod:'PE-003',nome:'Mangueira Estafeta 10mm',cat:'Peças Mecânicas',qtd:15,min:5,loc:'Est. C-2',un:'m'},
  {cod:'FI-001',nome:'Filtro de Ar C280',cat:'Filtros',qtd:5,min:8,loc:'Prat. D-1',un:'un'},
  {cod:'FI-002',nome:'Filtro de Óleo Picanol',cat:'Filtros',qtd:10,min:4,loc:'Prat. D-2',un:'un'},
  {cod:'EL-001',nome:'Fusível 10A Picanol',cat:'Elétrico/Eletrônico',qtd:30,min:10,loc:'Gav. E-1',un:'un'},
  {cod:'EL-002',nome:'Sensor Indutivo 12mm',cat:'Elétrico/Eletrônico',qtd:4,min:2,loc:'Gav. E-3',un:'un'},
];

const SEED_MECANICOS = [
  {nome:'José Silva',func:'Mecânico Tecelagem Sr.',turno:'Manhã',tel:'(83) 99812-3456',nivel:'supervisor',os:18,mttr:3.8,av:'JS',cor:'blue'},
  {nome:'Carlos Lima',func:'Mecânico Tecelagem',turno:'Tarde',tel:'(83) 99765-4321',nivel:'tecnico',os:14,mttr:4.5,av:'CL',cor:'green'},
  {nome:'João Nunes',func:'Mecânico Tecelagem',turno:'Manhã',tel:'(83) 99823-9988',nivel:'tecnico',os:12,mttr:4.1,av:'JN',cor:'amber'},
  {nome:'Pedro Costa',func:'Mecânico Eletricista',turno:'Noite',tel:'(83) 99911-7722',nivel:'tecnico',os:9,mttr:5.2,av:'PC',cor:'purple'},
  {nome:'Marco Ferreira',func:'Supervisor de Manutenção',turno:'Adm.',tel:'(83) 99877-5533',nivel:'administrador',os:6,mttr:2.9,av:'MF',cor:'blue'},
];

const SEED_OS = [
  {id:'#11179',maq:'Máq. 53 — Terryplus-i Jac',tipo:'preventiva',mecanico:'João Nunes',data:'25/03/2025 08:00',prior:'media',status:'exec',desc:'Manutenção preventiva completa conforme checklist padrão'},
  {id:'#11180',maq:'Máq. 14 — Terryplus-i',tipo:'preventiva',mecanico:'José Silva',data:'22/03/2025 14:00',prior:'alta',status:'pendente',desc:'Preventiva atrasada — verificar correia e óleo'},
  {id:'#11181',maq:'Máq. 05 — Omniplus-i Brim',tipo:'corretiva',mecanico:'Carlos Lima',data:'25/03/2025 11:30',prior:'critica',status:'exec',desc:'Máquina parou durante operação — barulho no cabeçote'},
  {id:'#11182',maq:'Máq. 46 — Terryplus-i Jac',tipo:'preventiva',mecanico:'João Nunes',data:'26/03/2025 08:00',prior:'baixa',status:'pendente',desc:'Preventiva trimestral programada'},
  {id:'#11183',maq:'Máq. 09 — Omniplus-i Brim',tipo:'preditiva',mecanico:'Marco Ferreira',data:'24/03/2025 09:00',prior:'media',status:'exec',desc:'Análise de vibração e temperatura no sistema de acionamento'},
  {id:'#11177',maq:'Máq. 16 — Terryplus Summum',tipo:'preventiva',mecanico:'Carlos Lima',data:'23/03/2025 08:00',prior:'baixa',status:'concluido',desc:'Preventiva geral realizada com sucesso. Troca de óleo e filtros.'},
  {id:'#11176',maq:'Máq. 01 — Omniplus Brim',tipo:'corretiva',mecanico:'Pedro Costa',data:'21/03/2025 16:00',prior:'alta',status:'concluido',desc:'Falha elétrica no quadro de comando — troca de fusível e sensor'},
];
