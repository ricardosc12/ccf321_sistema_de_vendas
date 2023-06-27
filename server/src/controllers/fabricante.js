const DATABASE_FILE = require('../config');

const sqlite3 = require('sqlite3').verbose();

// Função para cadastrar um novo fabricante
function cadastrarFabricante(fabricante) {
    return new Promise(resolve => {
        const db = new sqlite3.Database(DATABASE_FILE);

        // Verificar se o fabricante já existe
        verificarDuplicidadeFabricante(fabricante.nome, function (existeDuplicidade) {
            if (existeDuplicidade) {
                console.error('Já existe um fabricante com esse nome.');
                db.close();
                resolve({ status: false, message: "Já existe fabricante com esse nome!" })
                return;
            }

            // Inserir os dados do fabricante na tabela 'fabricantes'
            const query = 'INSERT INTO fabricantes (nome, site) VALUES (?, ?)';
            const values = [fabricante.nome, fabricante.site];

            db.run(query, values, function (err) {
                if (err) {
                    console.error('Erro ao cadastrar o fabricante:', err);
                    resolve({ status: false, message: 'Erro ao cadastrar o fabricante:' })
                } else {
                    console.log('Fabricante cadastrado com sucesso! ID:', this.lastID);
                    resolve({ status: true, id: this.lastID, message: 'Fabricante cadastrado com sucesso!' })
                }

                db.close();
            });
        });
    })
}

// Função para verificar a duplicidade do nome do fabricante
function verificarDuplicidadeFabricante(nomeFabricante, callback) {
    const db = new sqlite3.Database(DATABASE_FILE);

    const query = 'SELECT COUNT(*) AS count FROM fabricantes WHERE nome = ?';
    const values = [nomeFabricante];

    db.get(query, values, function (err, row) {
        if (err) {
            console.error('Erro ao verificar duplicidade do fabricante:', err);
            callback(false);
        } else {
            const count = row.count;
            const existeDuplicidade = count > 0;
            callback(existeDuplicidade);
        }

        db.close();
    });
}

function listarFabricantes() {
    return new Promise(resolve => {
        const db = new sqlite3.Database(DATABASE_FILE);

        const query = 'SELECT * FROM fabricantes';

        db.all(query, function (err, rows) {
            if (err) {
                console.error('Erro ao listar os fabricantes:', err);
                resolve({ status: false, message: 'Erro ao listar os fabricantes' })
            } else {
                console.log('Fabricantes cadastrados:');
                resolve({ status: true, message: "Listagem de fabricantes concluida!", dados: rows })
            }

            db.close();
        });
    })
}

function removerFabricante({ id: idFabricante }) {
    return new Promise((resolve) => {
        const db = new sqlite3.Database(DATABASE_FILE);

        const query = 'DELETE FROM fabricantes WHERE id = ?';
        db.run(query, [idFabricante], function (err) {
            if (err) {
                console.error('Erro ao remover o fabricante:', err);
                resolve({ status: false, message: 'Erro ao remover o fabricante.' });
            } else if (this.changes === 0) {
                console.error(`Fabricante com ID ${idFabricante} não encontrado.`);
                resolve({ status: false, message: `Fabricante com ID ${idFabricante} não encontrado.` });
            } else {
                console.log(`Fabricante com ID ${idFabricante} removido com sucesso.`);
                resolve({ status: true, message: `Fabricante com ID ${idFabricante} removido com sucesso.` });
            }
            db.close();
        });
    });
}

// Exemplo de uso
const novoFabricante = {
    nome: 'Novo fabricante 2',
    site: 'http://www.novofabricante.com'
};

// cadastrarFabricante(novoFabricante);

module.exports = { cadastrarFabricante, listarFabricantes, removerFabricante };