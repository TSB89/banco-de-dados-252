// Classe Exercicio - Representa um exercício de banco de dados
class Exercicio {
    constructor(numero, questao, resposta, codigo = null, topico = 'conceitos') {
        this.numero = numero;
        this.questao = questao;
        this.resposta = resposta;
        this.codigo = codigo;
        this.topico = topico;
    }

    // Método para renderizar o HTML do exercício
    renderizar() {
        const codigoHTML = this.codigo
            ? `
        <div class="code-block">
            <button class="copy-btn" onclick="copiarCodigo(this)">📋 Copiar</button>
            <code>${this.escapeHTML(this.codigo)}</code>
        </div>
      `
            : '';


        return `
            <section class="exercise-section" data-topico="${this.topico}">
                <div class="question">
                    <div class="question-header">
                        <span class="question-number">Questão ${this.numero}</span>
                        <span class="question-topic">${this.getTopicoNome()}</span>
                    </div>
                    <h2>${this.questao}</h2>
                </div>
                <div class="answer-card">
                    <h3>Resposta:</h3>
                    ${this.resposta}
                    ${codigoHTML}
                </div>
            </section>
        `;
    }

    // Método auxiliar para escapar HTML e evitar injeção
    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Retorna o nome formatado do tópico
    getTopicoNome() {
        const topicos = {
            'fase 1': 'Fase 1',
            'fase 2': 'Fase 2',
        };
        return topicos[this.topico] || 'Geral';
    }
}

// Classe GerenciadorExercicios - Gerencia a coleção de exercícios
class GerenciadorExercicios {
    constructor() {
        this.exercicios = [];
        this.topicoAtual = 'todos';
    }

    // Adiciona um novo exercício
    adicionarExercicio(exercicio) {
        this.exercicios.push(exercicio);
    }

    // Adiciona múltiplos exercícios
    adicionarExercicios(exercicios) {
        exercicios.forEach(ex => this.adicionarExercicio(ex));
    }

    // Filtra exercícios por tópico
    filtrarPorTopico(topico) {
        this.topicoAtual = topico;
        if (topico === 'todos') {
            return this.exercicios;
        }
        return this.exercicios.filter(ex => ex.topico === topico);
    }

    // Renderiza todos os exercícios filtrados
    renderizar(topico = 'todos') {
        const container = document.getElementById('exercicios-container');
        const exerciciosFiltrados = this.filtrarPorTopico(topico);

        if (exerciciosFiltrados.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>😕 Nenhum exercício encontrado</h3>
                    <p>Não há exercícios cadastrados para este tópico.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = exerciciosFiltrados
            .map(ex => ex.renderizar())
            .join('');
    }

    // Retorna o total de exercícios
    getTotalExercicios() {
        return this.exercicios.length;
    }
}

// Instância global do gerenciador
const gerenciador = new GerenciadorExercicios();

// Função para filtrar por tópico (chamada pelos botões)
function filtrarPorTopico(topico) {
    // Remove classe active de todos os botões
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Adiciona classe active no botão clicado
    event.target.classList.add('active');

    // Renderiza os exercícios filtrados
    gerenciador.renderizar(topico);
}

// Função para inicializar os exercícios
function inicializarExercicios() {
    // Exercícios
    const exercicios = [
        new Exercicio(
            1,
            'Selecione o nome do empregado e o nome do departamento em que ele está lotado, de todos os empregados que participam de projetos;',
            `<p>Explicação</p>

            </ul>`,
            `Resposta`,
            'fase 1'
        ),

        new Exercicio(
            2,
            'Retorne o nome e endereço dos empregados, além do nome dos departamentos nos quais eles estão lotados, dos funcionários que não estão em nenhuma projeto do departamento de Sistemas;',
            `<p>Explicação</p>

            </ul>`,
            `Resposta`,
            'fase 1'
        ),

        new Exercicio(
            3,
            'Obtenha a matrícula e o nome de todos os empregados que têm filhos, mas que não estão em nenhum projeto;',
            `<p>Explicação</p>

            </ul>`,
            `Resposta`,
            'fase 1'
        ),

        new Exercicio(
            4,
            'Selecione o nome e o salário do funcionário, além do código do departamento de todos os funcionários alocados nos projetos 10,11 ou 12; funcionam as transações em banco de dados?',
            `<p>Explicação</p>

            </ul>`,
            `Resposta`,
            'fase 1'
        )];

    // === Base de dados ===
    const basesDeDados = [
        new Exercicio(
            '1 - 25',
            'Base de Dados das questões (LiveSQL)',
            `<p></p>`,


            `CREATE TABLE departamentos (
    coddep INT PRIMARY KEY,
    nome VARCHAR(100)
);

-- LIMPEZA (pode rodar várias vezes)
--------------------------------------------------------------------------------
BEGIN EXECUTE IMMEDIATE 'DROP TABLE ALOCACAO CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE DEPENDENTE CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE PROJETO CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE EMPREGADO CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE DEPARTAMENTO CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/

--------------------------------------------------------------------------------
-- CRIAÇÃO DE TABELAS
--------------------------------------------------------------------------------

-- DEPARTAMENTO (sem FK de GERENTE por enquanto)
CREATE TABLE DEPARTAMENTO (
  CODDEP   VARCHAR2(5)   NOT NULL,
  NOME     VARCHAR2(60)  NOT NULL,
  GERENTE  NUMBER,                -- será preenchido depois
  DATAINI  DATE          NOT NULL,
  CONSTRAINT PK_DEPARTAMENTO PRIMARY KEY (CODDEP)
);

-- EMPREGADO
CREATE TABLE EMPREGADO (
  MATRICULA  NUMBER        NOT NULL,
  NOME       VARCHAR2(80)  NOT NULL,
  ENDERECO   VARCHAR2(120),
  SALARIO    NUMBER(10,2),
  SUPERVISOR NUMBER,                 -- auto-FK
  DEPTO      VARCHAR2(5),            -- FK para DEPARTAMENTO
  SEXO       CHAR(1)       NOT NULL,
  CONSTRAINT PK_EMPREGADO PRIMARY KEY (MATRICULA),
  CONSTRAINT CK_EMPREGADO_SEXO CHECK (SEXO IN ('M','F'))
);

-- PROJETO
CREATE TABLE PROJETO (
  CODPROJ NUMBER       NOT NULL,
  NOME    VARCHAR2(60) NOT NULL,
  LOCAL   VARCHAR2(60),
  DEPART  VARCHAR2(5)  NOT NULL,
  CONSTRAINT PK_PROJETO PRIMARY KEY (CODPROJ)
);

-- ALOCACAO
CREATE TABLE ALOCACAO (
  MATRIC  NUMBER     NOT NULL,
  CODIGOP NUMBER     NOT NULL,
  HORAS   NUMBER(5)  NOT NULL,
  CONSTRAINT PK_ALOCACAO PRIMARY KEY (MATRIC, CODIGOP)
);

-- DEPENDENTE
CREATE TABLE DEPENDENTE (
  CODDEPEND NUMBER       NOT NULL,
  MAT       NUMBER       NOT NULL,
  NOME      VARCHAR2(80) NOT NULL,
  SEXO      CHAR(1)      NOT NULL,
  CONSTRAINT PK_DEPENDENTE PRIMARY KEY (MAT, CODDEPEND),
  CONSTRAINT CK_DEPENDENTE_SEXO CHECK (SEXO IN ('M','F'))
);

--------------------------------------------------------------------------------
-- CHAVES ESTRANGEIRAS (somente as que não atrapalham a carga inicial)
--------------------------------------------------------------------------------

-- EMPREGADO -> DEPARTAMENTO (já pode existir)
ALTER TABLE EMPREGADO
  ADD CONSTRAINT FK_EMPREGADO_DEPTO
  FOREIGN KEY (DEPTO) REFERENCES DEPARTAMENTO (CODDEP);

-- EMPREGADO (SUPERVISOR) -> EMPREGADO (auto-referência, adia validação p/ COMMIT)
ALTER TABLE EMPREGADO
  ADD CONSTRAINT FK_EMPREGADO_SUPERVISOR
  FOREIGN KEY (SUPERVISOR) REFERENCES EMPREGADO (MATRICULA)
  DEFERRABLE INITIALLY DEFERRED;

-- PROJETO -> DEPARTAMENTO
ALTER TABLE PROJETO
  ADD CONSTRAINT FK_PROJETO_DEPART
  FOREIGN KEY (DEPART) REFERENCES DEPARTAMENTO (CODDEP);

-- ALOCACAO -> EMPREGADO / PROJETO
ALTER TABLE ALOCACAO
  ADD CONSTRAINT FK_ALOCACAO_EMP
  FOREIGN KEY (MATRIC) REFERENCES EMPREGADO (MATRICULA);

ALTER TABLE ALOCACAO
  ADD CONSTRAINT FK_ALOCACAO_PROJ
  FOREIGN KEY (CODIGOP) REFERENCES PROJETO (CODPROJ);

-- DEPENDENTE -> EMPREGADO
ALTER TABLE DEPENDENTE
  ADD CONSTRAINT FK_DEPENDENTE_EMP
  FOREIGN KEY (MAT) REFERENCES EMPREGADO (MATRICULA);

--------------------------------------------------------------------------------
-- CARGA DE DADOS
--------------------------------------------------------------------------------

-- 1) DEPARTAMENTOS (sem gerente por enquanto)
INSERT INTO DEPARTAMENTO (CODDEP, NOME, GERENTE, DATAINI) VALUES ('d1','Sistemas',   NULL, TO_DATE('01/01/2000','DD/MM/YYYY'));
INSERT INTO DEPARTAMENTO (CODDEP, NOME, GERENTE, DATAINI) VALUES ('d2','Física',     NULL, TO_DATE('01/01/2004','DD/MM/YYYY'));
INSERT INTO DEPARTAMENTO (CODDEP, NOME, GERENTE, DATAINI) VALUES ('d3','Matemática', NULL, TO_DATE('01/01/2002','DD/MM/YYYY'));

-- 2) EMPREGADOS
INSERT INTO EMPREGADO (MATRICULA,NOME,ENDERECO,SALARIO,SUPERVISOR,DEPTO,SEXO) VALUES
(100,'Ana Ananias Alves','Rua do Amarelo, n 1', 1200.00, 100,'d1','F');

INSERT INTO EMPREGADO (MATRICULA,NOME,ENDERECO,SALARIO,SUPERVISOR,DEPTO,SEXO) VALUES
(101,'Bernardo Borges Brasão','Rua do Branco, n 2', 900.00, 101,'d2','M');

INSERT INTO EMPREGADO (MATRICULA,NOME,ENDERECO,SALARIO,SUPERVISOR,DEPTO,SEXO) VALUES
(102,'Cleiton Carmelo Cruz','Praça do Cinza, n 3', 800.00, 101,'d2','M');

INSERT INTO EMPREGADO (MATRICULA,NOME,ENDERECO,SALARIO,SUPERVISOR,DEPTO,SEXO) VALUES
(103,'Diego Dorneles','Avenida do Damasco, n 4', 900.00, 100,'d1','M');

INSERT INTO EMPREGADO (MATRICULA,NOME,ENDERECO,SALARIO,SUPERVISOR,DEPTO,SEXO) VALUES
(104,'Érika Esdras','Rua do Enferrujado, n 5', 700.00, 104,'d3','F');

-- 3) Agora que EMPREGADO existe, setar GERENTE nos departamentos
UPDATE DEPARTAMENTO SET GERENTE = 100 WHERE CODDEP = 'd1';
UPDATE DEPARTAMENTO SET GERENTE = 101 WHERE CODDEP = 'd2';
UPDATE DEPARTAMENTO SET GERENTE = 104 WHERE CODDEP = 'd3';

-- 4) PROJETOS
INSERT INTO PROJETO (CODPROJ,NOME,LOCAL,DEPART) VALUES (1,'Projeto1','Campina Grande','d1');
INSERT INTO PROJETO (CODPROJ,NOME,LOCAL,DEPART) VALUES (2,'Projeto2','Patos','d3');
INSERT INTO PROJETO (CODPROJ,NOME,LOCAL,DEPART) VALUES (3,'Projeto3','Fortaleza','d2');
INSERT INTO PROJETO (CODPROJ,NOME,LOCAL,DEPART) VALUES (4,'Projeto4','Campina Grande','d1');
INSERT INTO PROJETO (CODPROJ,NOME,LOCAL,DEPART) VALUES (5,'Projeto5','Patos','d1');
INSERT INTO PROJETO (CODPROJ,NOME,LOCAL,DEPART) VALUES (6,'Projeto6','Natal','d2');
INSERT INTO PROJETO (CODPROJ,NOME,LOCAL,DEPART) VALUES (7,'Projeto7','Natal','d3');

-- 5) ALOCAÇÕES
INSERT INTO ALOCACAO (MATRIC,CODIGOP,HORAS) VALUES (100,1, 5);
INSERT INTO ALOCACAO (MATRIC,CODIGOP,HORAS) VALUES (104,7, 5);
INSERT INTO ALOCACAO (MATRIC,CODIGOP,HORAS) VALUES (100,3,10);
INSERT INTO ALOCACAO (MATRIC,CODIGOP,HORAS) VALUES (103,2, 5);
INSERT INTO ALOCACAO (MATRIC,CODIGOP,HORAS) VALUES (100,6, 2);
INSERT INTO ALOCACAO (MATRIC,CODIGOP,HORAS) VALUES (101,4, 5);
INSERT INTO ALOCACAO (MATRIC,CODIGOP,HORAS) VALUES (102,5,10);

-- 6) DEPENDENTES
INSERT INTO DEPENDENTE (CODDEPEND, MAT, NOME, SEXO) VALUES (1,101,'Bernardo Borges Brasão','M');
INSERT INTO DEPENDENTE (CODDEPEND, MAT, NOME, SEXO) VALUES (2,101,'Beatriz Borges Brasão','F');
INSERT INTO DEPENDENTE (CODDEPEND, MAT, NOME, SEXO) VALUES (1,104,'Eduardo Esdras Euler','M');
INSERT INTO DEPENDENTE (CODDEPEND, MAT, NOME, SEXO) VALUES (1,103,'Dayse Dorneles','F');

COMMIT;

--------------------------------------------------------------------------------
-- SÓ AGORA: FK DO GERENTE (já com os dados consistentes)
--------------------------------------------------------------------------------
ALTER TABLE DEPARTAMENTO
  ADD CONSTRAINT FK_DEPARTAMENTO_GERENTE
  FOREIGN KEY (GERENTE) REFERENCES EMPREGADO (MATRICULA);

-- CONSULTAS DE CHECAGEM (opcionais)
-- SELECT * FROM DEPARTAMENTO;
-- SELECT * FROM EMPREGADO;
-- SELECT * FROM PROJETO;
-- SELECT * FROM ALOCACAO;
-- SELECT * FROM DEPENDENTE;
);`,
            'base'
        ),
                new Exercicio(
            '1 - 25',
            'Base de Dados das questões (MySQL)',
            `<p></p>`,


            `-- LIMPEZA (caso já existam as tabelas)
DROP TABLE IF EXISTS ALOCACAO;
DROP TABLE IF EXISTS DEPENDENTE;
DROP TABLE IF EXISTS PROJETO;
DROP TABLE IF EXISTS EMPREGADO;
DROP TABLE IF EXISTS DEPARTAMENTO;

-- TABELA: DEPARTAMENTO
CREATE TABLE DEPARTAMENTO (
  CODDEP   VARCHAR(5)   NOT NULL,
  NOME     VARCHAR(60)  NOT NULL,
  GERENTE  INT,
  DATAINI  DATE         NOT NULL,
  PRIMARY KEY (CODDEP)
);

-- TABELA: EMPREGADO
CREATE TABLE EMPREGADO (
  MATRICULA  INT          NOT NULL,
  NOME       VARCHAR(80)  NOT NULL,
  ENDERECO   VARCHAR(120),
  SALARIO    DECIMAL(10,2),
  SUPERVISOR INT,
  DEPTO      VARCHAR(5),
  SEXO       CHAR(1)      NOT NULL,
  PRIMARY KEY (MATRICULA),
  CHECK (SEXO IN ('M','F'))
);

-- TABELA: PROJETO
CREATE TABLE PROJETO (
  CODPROJ INT         NOT NULL,
  NOME    VARCHAR(60) NOT NULL,
  LOCAL   VARCHAR(60),
  DEPART  VARCHAR(5)  NOT NULL,
  PRIMARY KEY (CODPROJ)
);

-- TABELA: ALOCACAO
CREATE TABLE ALOCACAO (
  MATRIC  INT NOT NULL,
  CODIGOP INT NOT NULL,
  HORAS   INT NOT NULL,
  PRIMARY KEY (MATRIC, CODIGOP)
);

-- TABELA: DEPENDENTE
CREATE TABLE DEPENDENTE (
  CODDEPEND INT         NOT NULL,
  MAT       INT         NOT NULL,
  NOME      VARCHAR(80) NOT NULL,
  SEXO      CHAR(1)     NOT NULL,
  PRIMARY KEY (MAT, CODDEPEND),
  CHECK (SEXO IN ('M','F'))
);

-- CHAVES ESTRANGEIRAS
ALTER TABLE EMPREGADO
  ADD CONSTRAINT FK_EMPREGADO_DEPTO
  FOREIGN KEY (DEPTO) REFERENCES DEPARTAMENTO (CODDEP);

ALTER TABLE EMPREGADO
  ADD CONSTRAINT FK_EMPREGADO_SUPERVISOR
  FOREIGN KEY (SUPERVISOR) REFERENCES EMPREGADO (MATRICULA);

ALTER TABLE PROJETO
  ADD CONSTRAINT FK_PROJETO_DEPART
  FOREIGN KEY (DEPART) REFERENCES DEPARTAMENTO (CODDEP);

ALTER TABLE ALOCACAO
  ADD CONSTRAINT FK_ALOCACAO_EMP
  FOREIGN KEY (MATRIC) REFERENCES EMPREGADO (MATRICULA);

ALTER TABLE ALOCACAO
  ADD CONSTRAINT FK_ALOCACAO_PROJ
  FOREIGN KEY (CODIGOP) REFERENCES PROJETO (CODPROJ);

ALTER TABLE DEPENDENTE
  ADD CONSTRAINT FK_DEPENDENTE_EMP
  FOREIGN KEY (MAT) REFERENCES EMPREGADO (MATRICULA);

-- INSERINDO DADOS

INSERT INTO DEPARTAMENTO (CODDEP, NOME, GERENTE, DATAINI) VALUES 
('d1','Sistemas',   NULL, '2000-01-01'),
('d2','Física',     NULL, '2004-01-01'),
('d3','Matemática', NULL, '2002-01-01');

INSERT INTO EMPREGADO (MATRICULA,NOME,ENDERECO,SALARIO,SUPERVISOR,DEPTO,SEXO) VALUES
(100,'Ana Ananias Alves','Rua do Amarelo, n 1',1200.00,100,'d1','F'),
(101,'Bernardo Borges Brasão','Rua do Branco, n 2',900.00,101,'d2','M'),
(102,'Cleiton Carmelo Cruz','Praça do Cinza, n 3',800.00,101,'d2','M'),
(103,'Diego Dorneles','Avenida do Damasco, n 4',900.00,100,'d1','M'),
(104,'Érika Esdras','Rua do Enferrujado, n 5',700.00,104,'d3','F');

UPDATE DEPARTAMENTO SET GERENTE = 100 WHERE CODDEP = 'd1';
UPDATE DEPARTAMENTO SET GERENTE = 101 WHERE CODDEP = 'd2';
UPDATE DEPARTAMENTO SET GERENTE = 104 WHERE CODDEP = 'd3';

INSERT INTO PROJETO (CODPROJ,NOME,LOCAL,DEPART) VALUES
(1,'Projeto1','Campina Grande','d1'),
(2,'Projeto2','Patos','d3'),
(3,'Projeto3','Fortaleza','d2'),
(4,'Projeto4','Campina Grande','d1'),
(5,'Projeto5','Patos','d1'),
(6,'Projeto6','Natal','d2'),
(7,'Projeto7','Natal','d3');

INSERT INTO ALOCACAO (MATRIC,CODIGOP,HORAS) VALUES
(100,1,5),
(104,7,5),
(100,3,10),
(103,2,5),
(100,6,2),
(101,4,5),
(102,5,10);

INSERT INTO DEPENDENTE (CODDEPEND, MAT, NOME, SEXO) VALUES
(1,101,'Bernardo Borges Brasão','M'),
(2,101,'Beatriz Borges Brasão','F'),
(1,104,'Eduardo Esdras Euler','M'),
(1,103,'Dayse Dorneles','F');

ALTER TABLE DEPARTAMENTO
  ADD CONSTRAINT FK_DEPARTAMENTO_GERENTE
  FOREIGN KEY (GERENTE) REFERENCES EMPREGADO (MATRICULA);
`,
            'base'
        ),
    ];

    // Adiciona tudo ao gerenciador
    gerenciador.adicionarExercicios(exercicios);
    gerenciador.adicionarExercicios(basesDeDados);

    // Renderiza os exercícios (padrão: "todos")
    gerenciador.renderizar();

    // Atualiza o total
    document.getElementById('total-exercicios').textContent =
        gerenciador.getTotalExercicios();
}

// Inicializa quando a página carregar
document.addEventListener('DOMContentLoaded', inicializarExercicios);

function copiarCodigo(botao) {
    const codeElement = botao.nextElementSibling; // o <code> que vem logo depois
    const codigo = codeElement.innerText;

    // Copia o texto para a área de transferência
    navigator.clipboard.writeText(codigo).then(() => {
        botao.textContent = "✅ Copiado!";
        setTimeout(() => {
            botao.textContent = "📋 Copiar";
        }, 2000);
    }).catch(() => {
        botao.textContent = "❌ Erro!";
    });
}