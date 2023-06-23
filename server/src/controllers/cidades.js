const DATABASE_FILE = require('../config');

const sqlite3 = require('sqlite3').verbose();

// Função para cadastrar um novo fabricante
function cadastrarCidade(cidade) {
    return new Promise(resolve => {
        const db = new sqlite3.Database(DATABASE_FILE);

        const query = 'INSERT INTO cidades (nome, estado) VALUES (?, ?)';
        const values = [cidade.nome, cidade.estado];

        db.run(query, values, function (err) {
            if (err) {
                console.error('Erro ao cadastrar a cidade:', err);
                resolve({ status: false, message: 'Erro ao cadastrar a cidade' })
            } else {
                console.log('Cidade cadastrada com sucesso! ID:', this.lastID);
                resolve({ status: true, id: this.lastID, message: 'Cidade cadastrada com sucesso!' })
            }

            db.close();
        });
    })
}

function listarCidades() {
    return new Promise(resolve => {
        const db = new sqlite3.Database(DATABASE_FILE);

        const query = 'SELECT * FROM cidades';

        db.all(query, function (err, rows) {
            if (err) {
                console.error('Erro ao listar as cidades:', err);
                resolve({ status: false, message: 'Erro ao listar as cidades' })
            } else {
                console.log('Cidades cadastradas:');
                resolve({ status: true, message: "Listagem de cidades concluida!", dados: rows })
            }

            db.close();
        });
    })
}

// Exemplo de uso
const novaCidade = {
    nome: 'Florestal',
    estado: 'Minas Gerais'
};

// cadastrarCidade(novaCidade);

module.exports = { cadastrarCidade, listarCidades };