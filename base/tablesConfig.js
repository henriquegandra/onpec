const tables = [
  { name: 'Sync Apps', model: 'SyncApps', db: 'tbl_sync_apps', exec: false },
  { name: 'Gado Pesagem Queued', model: 'GadoPesagemQueued', db: 'tbl_gado_pesagem_queued', exec: false },
  { name: 'Gado Pesagem', model: 'GadoPesagem', db: 'tbl_gado_pesagem', exec: false },
  { name: 'Gado Raça', model: 'GadoRaca', db: 'tbl_gado_raca', exec: true },
  { name: 'Gado Lote', model: 'GadoLote', db: 'tbl_gado_lote', exec: true },
  { name: 'Gado Pasto', model: 'GadoPasto', db: 'tbl_gado_pasto', exec: true },
  { name: 'Gado Fase', model: 'GadoFase', db: 'tbl_gado_fase', exec: true },
];

module.exports = tables;
