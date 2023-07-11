CREATE TABLE test_step (
    id_test_step SERIAL PRIMARY KEY,
    nome_step VARCHAR,
    ultima_exec TIMESTAMP,
    status_ultima_exec VARCHAR,
    id_suite INTEGER,
    id_test_case INTEGER,
    status_atual VARCHAR,
    nome_executor VARCHAR,
    FOREIGN KEY (id_suite) REFERENCES suites(id_suite),
    FOREIGN KEY (id_test_case) REFERENCES teste_case(id_teste),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_edicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);