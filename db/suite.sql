CREATE TABLE suites (
  id_suite SERIAL PRIMARY KEY,
  nome_suite VARCHAR(255) NOT NULL,
  status_ultima_exec VARCHAR(50),
  status_atual VARCHAR(50),
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_edicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
