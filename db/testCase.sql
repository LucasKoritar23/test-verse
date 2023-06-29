CREATE TABLE teste_case (
  id_teste SERIAL PRIMARY KEY,
  nome_teste VARCHAR(255),
  ultima_exec TIMESTAMP,
  status_ultima_exec VARCHAR(25),
  id_suite INT,
  status_atual VARCHAR(25),
  zip_evidencia VARCHAR,
  nome_executor VARCHAR(255),
  FOREIGN KEY (id_suite) REFERENCES suites(id_suite),
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_edicao TIMESTAMP
);
