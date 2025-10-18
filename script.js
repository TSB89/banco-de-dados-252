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
    <button class="toggle-btn" onclick="toggleResposta(this)">
        ➕ Mostrar Resposta
    </button>
    <div class="resposta-conteudo" style="display:none;">
        <h3>Resposta:</h3>
        ${this.resposta}
        ${codigoHTML}
    </div>
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
      'Liste o nome de todos os empregados.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>SELECT nome</strong><br>
      Indica que queremos exibir apenas a coluna <code>nome</code> da tabela.</li>
    <li><strong>FROM empregado</strong><br>
      Especifica a tabela fonte dos dados: <code>empregado</code>.</li>
  </ul>`,
      `
  SELECT nome
  FROM empregado;
  `,
      'fase 1'
    ),

    new Exercicio(
      2,
      'Liste o nome e o salário de todos os empregados.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>SELECT nome, salario</strong><br>
      Lista as duas colunas que queremos visualizar: <code>nome</code> e <code>salario</code>.</li>
    <li><strong>FROM empregado</strong><br>
      Define a tabela onde essas colunas existem: <code>empregado</code>.</li>
  </ul>`,
      `
  SELECT nome, salario
  FROM empregado;
  `,
      'fase 1'
    ),

    new Exercicio(
      3,
      'Liste o nome e o salário dos empregados que trabalham no departamento “d1”.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>SELECT nome, salario</strong><br>
      Seleciona as colunas que serão exibidas.</li>
    <li><strong>FROM empregado</strong><br>
      Indica a tabela fonte: <code>empregado</code>.</li>
    <li><strong>WHERE depto = 'd1'</strong><br>
      Aplica um filtro para incluir somente linhas cujo campo <code>depto</code> seja 'd1'.</li>
  </ul>`,
      `
  SELECT nome, salario
  FROM empregado
  WHERE depto = 'd1';
  `,
      'fase 1'
    ),

    new Exercicio(
      4,
      'Liste o nome do empregado e o salário, mostrando os títulos das colunas como “Empregado” e “Salário Mensal”.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>SELECT nome AS "Empregado", salario AS "Salário Mensal"</strong><br>
      Usa <code>AS</code> para renomear as colunas no resultado: <code>nome</code> vira "Empregado" e <code>salario</code> vira "Salário Mensal".</li>
    <li><strong>FROM empregado</strong><br>
      Indica de que tabela os dados virão.</li>
  </ul>`,
      `
  SELECT nome AS "Empregado",
         salario AS "Salário Mensal"
  FROM empregado;
  `,
      'fase 1'
    ),

    new Exercicio(
      5,
      'Liste o nome e o salário de todos os empregados, ordenados pelo salário de forma decrescente.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>SELECT nome, salario</strong><br>
      Seleciona colunas a mostrar.</li>
    <li><strong>FROM empregado</strong><br>
      Define a tabela base.</li>
    <li><strong>ORDER BY salario DESC</strong><br>
      Ordena os resultados pelo campo <code>salario</code> em ordem decrescente (do maior para o menor).</li>
  </ul>`,
      `
  SELECT nome, salario
  FROM empregado
  ORDER BY salario DESC;
  `,
      'fase 1'
    ),

    new Exercicio(
      6,
      'Liste o nome e o salário dos empregados que são do sexo feminino (F) e têm salário maior que 800.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>SELECT nome, salario</strong><br>
      Define as colunas a exibir: <code>nome</code> e <code>salario</code>.</li>
    <li><strong>FROM empregado</strong><br>
      Indica a tabela de onde os dados virão.</li>
    <li><strong>WHERE sexo = 'F'</strong><br>
      Primeiro filtro: apenas empregados cujo sexo seja 'F'.</li>
    <li><strong>AND salario > 800</strong><br>
      Segundo filtro aplicado conjuntamente: salário deve ser maior que 800. As duas condições são combinadas com <code>AND</code>.</li>
  </ul>`,
      `
  SELECT nome, salario
  FROM empregado
  WHERE sexo = 'F'
    AND salario > 800;
  `,
      'fase 1'
    ),

    new Exercicio(
      7,
      'Liste o nome do empregado, o nome do departamento e o salário de todos os empregados.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>SELECT e.nome AS "Empregado", d.nome AS "Departamento", e.salario</strong><br>
      Seleciona o nome do empregado (apelidado de "Empregado"), o nome do departamento (apelidado de "Departamento") e o salário.</li>
    <li><strong>FROM empregado e</strong><br>
      Usa a tabela <code>empregado</code> com o alias <code>e</code> para facilitar referências.</li>
    <li><strong>JOIN departamento d ON e.depto = d.coddep</strong><br>
      Faz um <em>INNER JOIN</em> com a tabela <code>departamento</code> (alias <code>d</code>) ligando <code>e.depto</code> a <code>d.coddep</code> — isso traz o nome do departamento correspondente a cada empregado.</li>
  </ul>`,
      `
  SELECT e.nome AS "Empregado",
         d.nome AS "Departamento",
         e.salario
  FROM empregado e
  JOIN departamento d
    ON e.depto = d.coddep;
  `,
      'fase 1'
    ),

    new Exercicio(
      8,
      'Liste o nome do empregado, o nome do projeto e o local onde ele está alocado.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>SELECT e.nome AS "Empregado", p.nome AS "Projeto", p.local AS "Local"</strong><br>
      Escolhe as colunas: nome do empregado, nome do projeto e cidade/local do projeto.</li>
    <li><strong>FROM empregado e</strong><br>
      Tabela inicial com alias <code>e</code>.</li>
    <li><strong>JOIN alocacao a ON e.matricula = a.matric</strong><br>
      Junta a tabela <code>alocacao</code> (alias <code>a</code>) para relacionar empregados às alocações (projetos).</li>
    <li><strong>JOIN projeto p ON a.codigop = p.codproj</strong><br>
      Junta a tabela <code>projeto</code> (alias <code>p</code>) para obter o nome e o local do projeto correspondente à alocação.</li>
  </ul>`,
      `
  SELECT e.nome AS "Empregado",
         p.nome AS "Projeto",
         p.local AS "Local"
  FROM empregado e
  JOIN alocacao a
    ON e.matricula = a.matric
  JOIN projeto p
    ON a.codigop = p.codproj;
  `,
      'fase 1'
    ),

    new Exercicio(
      9,
      'Mostre o código do departamento e a quantidade de empregados em cada um deles.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>SELECT depto AS "Departamento", COUNT(*) AS "Qtd_Empregados"</strong><br>
      Mostra o código do departamento e usa <code>COUNT(*)</code> para contar quantos empregados existem por grupo.</li>
    <li><strong>FROM empregado</strong><br>
      Base dos dados: tabela <code>empregado</code>.</li>
    <li><strong>GROUP BY depto</strong><br>
      Agrupa as linhas por <code>depto</code>, permitindo calcular a contagem por departamento.</li>
  </ul>`,
      `
  SELECT depto AS "Departamento",
         COUNT(*) AS "Qtd_Empregados"
  FROM empregado
  GROUP BY depto;
  `,
      'fase 1'
    ),

    new Exercicio(
      10,
      'Mostre o nome do departamento, a média salarial dos empregados e exiba somente os departamentos com média superior a 800.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>SELECT d.nome AS "Departamento", AVG(e.salario) AS "Média_Salarial"</strong><br>
      Seleciona o nome do departamento e calcula a média salarial com <code>AVG</code>.</li>
    <li><strong>FROM empregado e JOIN departamento d ON e.depto = d.coddep</strong><br>
      Junta <code>empregado</code> e <code>departamento</code> para relacionar empregados ao nome do departamento.</li>
    <li><strong>GROUP BY d.nome</strong><br>
      Agrupa por nome do departamento para calcular a média por grupo.</li>
    <li><strong>HAVING AVG(e.salario) > 800</strong><br>
      Filtra resultados agrupados para exibir apenas departamentos cuja média salarial seja maior que 800.</li>
  </ul>`,
      `
  SELECT d.nome AS "Departamento",
         AVG(e.salario) AS "Média_Salarial"
  FROM empregado e
  JOIN departamento d
    ON e.depto = d.coddep
  GROUP BY d.nome
  HAVING AVG(e.salario) > 800;
  `,
      'fase 1'
    ),

    new Exercicio(
      11,
      'Liste o nome dos empregados cujo nome começa com a letra “A”.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>SELECT nome</strong><br>
      Seleciona a coluna <code>nome</code>.</li>
    <li><strong>FROM empregado</strong><br>
      Fonte de dados: tabela <code>empregado</code>.</li>
    <li><strong>WHERE nome LIKE 'A%'</strong><br>
      Filtra nomes que começam com 'A' usando o padrão <code>'A%'</code> onde <code>%</code> representa qualquer sequência de caracteres.</li>
  </ul>`,
      `
  SELECT nome
  FROM empregado
  WHERE nome LIKE 'A%';
  `,
      'fase 1'
    ),

    new Exercicio(
      12,
      'Liste o nome e o salário dos empregados com salário entre 800 e 1200.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>SELECT nome, salario</strong><br>
      Seleciona as colunas a exibir.</li>
    <li><strong>FROM empregado</strong><br>
      Indica a tabela fonte.</li>
    <li><strong>WHERE salario BETWEEN 800 AND 1200</strong><br>
      Aplica filtro de intervalo: inclui salários maiores ou iguais a 800 e menores ou iguais a 1200.</li>
  </ul>`,
      `
  SELECT nome, salario
  FROM empregado
  WHERE salario BETWEEN 800 AND 1200;
  `,
      'fase 1'
    ),

    new Exercicio(
      13,
      'Liste o nome e o salário dos empregados que trabalham nos departamentos “d1” ou “d3”.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>SELECT nome, salario</strong><br>
      Colunas de saída desejadas.</li>
    <li><strong>FROM empregado</strong><br>
      Tabela onde os dados residem.</li>
    <li><strong>WHERE depto IN ('d1', 'd3')</strong><br>
      Usa <code>IN</code> para filtrar registros cujo campo <code>depto</code> esteja na lista ('d1', 'd3').</li>
  </ul>`,
      `
  SELECT nome, salario
  FROM empregado
  WHERE depto IN ('d1', 'd3');
  `,
      'fase 1'
    ),

    new Exercicio(
      14,
      'Liste os locais dos projetos, sem repetir valores.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>SELECT DISTINCT local</strong><br>
      <code>DISTINCT</code> remove duplicatas, retornando cada local apenas uma vez.</li>
    <li><strong>FROM projeto</strong><br>
      Define a tabela fonte: <code>projeto</code>.</li>
  </ul>`,
      `
  SELECT DISTINCT local
  FROM projeto;
  `,
      'fase 1'
    ),

    new Exercicio(
      15,
      'Liste o nome, o departamento e o salário dos empregados, ordenando primeiro pelo departamento e depois pelo salário em ordem decrescente.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>SELECT nome, depto, salario</strong><br>
      Seleciona as colunas a mostrar.</li>
    <li><strong>FROM empregado</strong><br>
      Indica a tabela base.</li>
    <li><strong>ORDER BY depto ASC, salario DESC</strong><br>
      Ordena os resultados por departamento (crescente) e, dentro do mesmo departamento, por salário (decrescente).</li>
  </ul>`,
      `
  SELECT nome, depto, salario
  FROM empregado
  ORDER BY depto ASC, salario DESC;
  `,
      'fase 1'
    ),

    new Exercicio(
      16,
      'Liste o nome dos empregados que estão alocados em algum projeto localizado em “Natal”.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>SELECT nome</strong><br>
      Seleciona a coluna de interesse: <code>nome</code>.</li>
    <li><strong>FROM empregado</strong><br>
      Tabela principal.</li>
    <li><strong>WHERE matricula IN ( ... )</strong><br>
      Usa uma subconsulta para filtrar empregados cujas matrículas aparecem no conjunto retornado pela subconsulta.</li>
    <li><strong>Subconsulta: SELECT a.matric FROM alocacao a JOIN projeto p ON a.codigop = p.codproj WHERE p.local = 'Natal'</strong><br>
      A subconsulta obtém as matrículas (campo <code>a.matric</code>) das alocações que estejam ligadas a projetos cujo <code>local</code> é 'Natal'. O <code>JOIN</code> conecta <code>alocacao</code> e <code>projeto</code> pela chave do projeto.</li>
  </ul>`,
      `
  SELECT nome
  FROM empregado
  WHERE matricula IN (
      SELECT a.matric
      FROM alocacao a
      JOIN projeto p
        ON a.codigop = p.codproj
      WHERE p.local = 'Natal'
  );
  `,
      'fase 1'
    ),

    new Exercicio(
      17,
      'Liste o nome e o salário dos empregados que ganham acima da média salarial geral.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>SELECT nome, salario</strong><br>
      Define as colunas de saída.</li>
    <li><strong>FROM empregado</strong><br>
      Indica a tabela fonte.</li>
    <li><strong>WHERE salario &gt; (SELECT AVG(salario) FROM empregado)</strong><br>
      Compara cada salário com a média calculada por uma subconsulta que usa <code>AVG(salario)</code> em toda a tabela <code>empregado</code>. Apenas empregados com salário maior que essa média são retornados.</li>
  </ul>`,
      `
  SELECT nome, salario
  FROM empregado
  WHERE salario > (
      SELECT AVG(salario)
      FROM empregado
  );
  `,
      'fase 1'
    ),

    new Exercicio(
      18,
      'Liste o nome dos empregados que têm dependentes cadastrados.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>SELECT e.nome FROM empregado e</strong><br>
      Seleciona o nome dos empregados usando o alias <code>e</code>.</li>
    <li><strong>WHERE EXISTS (SELECT 1 FROM dependente d WHERE d.mat = e.matricula)</strong><br>
      Usa <code>EXISTS</code> para verificar a existência de pelo menos um registro correspondente na tabela <code>dependente</code> onde <code>d.mat</code> (matrícula do empregado no dependente) coincide com <code>e.matricula</code>. Se existir ao menos um dependente, o empregado é incluído.</li>
  </ul>`,
      `
  SELECT e.nome
  FROM empregado e
  WHERE EXISTS (
      SELECT 1
      FROM dependente d
      WHERE d.mat = e.matricula
  );
  `,
      'fase 1'
    ),

    new Exercicio(
      19,
      'Mostre o nome do departamento e a média salarial dos empregados, ordenando pela média em ordem decrescente.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>SELECT d.nome AS "Departamento", AVG(e.salario) AS "Média_Salarial"</strong><br>
      Seleciona o nome do departamento e calcula a média salarial do grupo.</li>
    <li><strong>FROM empregado e JOIN departamento d ON e.depto = d.coddep</strong><br>
      Junta as tabelas para relacionar empregados aos nomes dos departamentos.</li>
    <li><strong>GROUP BY d.nome</strong><br>
      Agrupa por nome do departamento para cálculo da média por departamento.</li>
    <li><strong>ORDER BY AVG(e.salario) DESC</strong><br>
      Ordena os grupos pela média salarial em ordem decrescente (do maior para o menor).</li>
  </ul>`,
      `
  SELECT d.nome AS "Departamento",
         AVG(e.salario) AS "Média_Salarial"
  FROM empregado e
  JOIN departamento d
    ON e.depto = d.coddep
  GROUP BY d.nome
  ORDER BY AVG(e.salario) DESC;
  `,
      'fase 1'
    ),

    new Exercicio(
      20,
      'Liste o nome do empregado, o nome do projeto e o nome do departamento, apenas para os empregados que trabalham em “Campina Grande”.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>SELECT e.nome AS "Empregado", p.nome AS "Projeto", d.nome AS "Departamento"</strong><br>
      Define as colunas de saída: nome do empregado, nome do projeto e nome do departamento.</li>
    <li><strong>FROM empregado e</strong><br>
      Tabela principal, com alias <code>e</code>.</li>
    <li><strong>JOIN alocacao a ON e.matricula = a.matric</strong><br>
      Conecta empregados às suas alocações (tabela <code>alocacao</code>).</li>
    <li><strong>JOIN projeto p ON a.codigop = p.codproj</strong><br>
      Conecta alocações aos projetos para obter o nome do projeto e o local.</li>
    <li><strong>JOIN departamento d ON e.depto = d.coddep</strong><br>
      Conecta empregado ao departamento para obter o nome do departamento.</li>
    <li><strong>WHERE p.local = 'Campina Grande'</strong><br>
      Filtra para incluir apenas alocações cujo projeto está em 'Campina Grande'.</li>
  </ul>`,
      `
  SELECT e.nome AS "Empregado",
         p.nome AS "Projeto",
         d.nome AS "Departamento"
  FROM empregado e
  JOIN alocacao a
    ON e.matricula = a.matric
  JOIN projeto p
    ON a.codigop = p.codproj
  JOIN departamento d
    ON e.depto = d.coddep
  WHERE p.local = 'Campina Grande';
  `,
      'fase 1'
    ),

    new Exercicio(
      21,
      'Crie uma VIEW chamada vw_empregados_departamentos que mostre o nome do empregado e o nome do departamento onde ele trabalha.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>CREATE VIEW vw_empregados_departamentos AS</strong><br>
      Inicia a criação de uma view (visão) persistente chamada <code>vw_empregados_departamentos</code>.</li>
    <li><strong>SELECT e.nome AS empregado, d.nome AS departamento</strong><br>
      Define o conteúdo da view: nome do empregado e nome do departamento, com aliases para clareza.</li>
    <li><strong>FROM empregado e JOIN departamento d ON e.depto = d.coddep</strong><br>
      Junta as tabelas para relacionar cada empregado ao seu departamento; o resultado dessa query será o corpo da view.</li>
    <li><strong>SELECT * FROM vw_empregados_departamentos;</strong><br>
      Use o comando acima para acessar a view criada.</li>
  </ul>`,
      `
  CREATE VIEW vw_empregados_departamentos AS
  SELECT e.nome AS empregado,
         d.nome AS departamento
  FROM empregado e
  JOIN departamento d
    ON e.depto = d.coddep;
  `,
      'fase 1'
    ),

    new Exercicio(
      22,
      'Crie uma VIEW chamada vw_salario_departamento que mostre o nome do departamento e a média salarial dos empregados de cada departamento.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>CREATE VIEW vw_salario_departamento AS</strong><br>
      Inicia a criação da view <code>vw_salario_departamento</code>.</li>
    <li><strong>SELECT d.nome AS departamento, AVG(e.salario) AS media_salarial</strong><br>
      Seleciona o nome do departamento e calcula a média salarial usando <code>AVG</code>, renomeando a coluna resultante para <code>media_salarial</code>.</li>
    <li><strong>FROM empregado e JOIN departamento d ON e.depto = d.coddep</strong><br>
      Junta as tabelas necessárias para que o cálculo da média seja feito por departamento.</li>
    <li><strong>GROUP BY d.nome</strong><br>
      Agrupa por nome do departamento para que a função agregada <code>AVG</code> faça o cálculo por grupo.</li>
    <li><strong>SELECT * FROM vw_salario_departamento;</strong><br>
      Use o comando acima para acessar a view criada.</li>
    </ul>`,
      `
  CREATE VIEW vw_salario_departamento AS
  SELECT d.nome AS departamento,
         AVG(e.salario) AS media_salarial
  FROM empregado e
  JOIN departamento d
    ON e.depto = d.coddep
  GROUP BY d.nome;
  `,
      'fase 1'
    ),

    new Exercicio(
      23,
      'Crie uma VIEW chamada vw_empregados_projetos que mostre o nome do empregado, o nome do projeto e o local do projeto, somente para projetos realizados em “Natal”.',
      `
  <p>💡 <strong>Leitura passo a passo do código:</strong></p>
  <ul>
    <li><strong>CREATE VIEW vw_empregados_projetos AS</strong><br>
      Inicia a criação da view chamada <code>vw_empregados_projetos</code>.</li>
    <li><strong>SELECT e.nome AS empregado, p.nome AS projeto, p.local AS local_projeto</strong><br>
      Define as colunas da view: nome do empregado, nome do projeto e o local do projeto (renomeado como <code>local_projeto</code>).</li>
    <li><strong>FROM empregado e JOIN alocacao a ON e.matricula = a.matric</strong><br>
      Junta <code>empregado</code> com <code>alocacao</code> para relacionar empregados às suas alocações.</li>
    <li><strong>JOIN projeto p ON a.codigop = p.codproj</strong><br>
      Junta <code>projeto</code> para obter o nome e o local do projeto da alocação.</li>
    <li><strong>WHERE p.local = 'Natal'</strong><br>
      Filtra as linhas para incluir apenas projetos cujo <code>local</code> seja exatamente 'Natal'.</li>
    <li><strong>SELECT * FROM vw_empregados_projetos;</strong><br>
      Use o comando acima para acessar a view criada.</li>
    </ul>`,
      `
  CREATE VIEW vw_empregados_projetos AS
  SELECT e.nome AS empregado,
         p.nome AS projeto,
         p.local AS local_projeto
  FROM empregado e
  JOIN alocacao a
    ON e.matricula = a.matric
  JOIN projeto p
    ON a.codigop = p.codproj
  WHERE p.local = 'Natal';
  `,
      'fase 1'
    )];

  // === Base de dados ===
  const basesDeDados = [
    new Exercicio(
      '1 - 23',
      'Base de Dados das questões (Oracle Live SQL)',
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
      '1 - 23',
      'Base de Dados das questões (Postgre Live SQL ou MySQL)',
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

function toggleResposta(botao) {
  const conteudo = botao.nextElementSibling;
  const visivel = conteudo.style.display === "block";

  conteudo.style.display = visivel ? "none" : "block";
  botao.textContent = visivel ? "➕ Mostrar Resposta" : "➖ Ocultar Resposta";
}
