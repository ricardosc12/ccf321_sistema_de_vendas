const DATABASE_FILE = require('../config');

const sqlite3 = require('sqlite3').verbose();

function verificarCidadeExistente(idCidade, callback) {
    const db = new sqlite3.Database(DATABASE_FILE);

    const query = 'SELECT COUNT(*) AS count FROM cidades WHERE id = ?';
    const values = [idCidade];

    db.get(query, values, function (err, row) {
        if (err) {
            console.error(`Erro ao verificar a existência da cidade com ID ${idCidade}:`, err);
            callback(false);
        } else {
            const count = row.count;
            const existeCidade = count > 0;
            callback(existeCidade);
        }

        db.close();
    });
}

// Função para cadastrar um novo produto
function cadastrarCliente(cliente) {

    return new Promise(resolve => {
        const db = new sqlite3.Database(DATABASE_FILE);

        verificarCidadeExistente(cliente.idCidade, function (existeCidade) {
            if (existeCidade) {
                // Inserir os dados do cliente na tabela 'clientes'
                const query = 'INSERT INTO clientes (nome, endereco, telefone, idCidade) VALUES (?, ?, ?, ?)';
                const values = [cliente.nome, cliente.endereco, cliente.telefone, cliente.idCidade];

                db.run(query, values, function (err) {
                    if (err) {
                        console.error('Erro ao cadastrar o cliente:', err);
                        resolve({ status: false, message: 'Erro ao cadastrar o cliente' })
                    } else {
                        console.log('Cliente cadastrado com sucesso! ID:', this.lastID);
                        resolve({ status: true, id: this.lastID, message: 'Cliente cadastrado com sucesso!' })
                    }

                    db.close();
                });
            } else {
                console.error(`Cidade com ID ${cliente.idCidade} não cadastrada !`);
                resolve({ status: false, message: `Cidade com ID ${cliente.idCidade} não cadastrada !` })
                db.close();
            }
        })
    })
}

function listarClientes() {
    return new Promise(resolve => {
        const db = new sqlite3.Database(DATABASE_FILE);

        const query = 'SELECT * FROM clientes';

        db.all(query, function (err, rows) {
            if (err) {
                console.error('Erro ao listar os clientes:', err);
                resolve({ status: false, message: 'Erro ao listar os clientes' })
            } else {
                console.log('Clientes cadastrados:');
                resolve({ status: true, message: "Listagem de clientes concluida!", dados: rows })
            }
            db.close();
        });
    })
}

function removerCliente({ id: idCliente }) {
    return new Promise((resolve) => {
        const db = new sqlite3.Database(DATABASE_FILE);

        const query = 'DELETE FROM clientes WHERE id = ?';
        db.run(query, [idCliente], function (err) {
            if (err) {
                console.error('Erro ao remover o cliente:', err);
                resolve({ status: false, message: 'Erro ao remover o cliente.' });
            } else if (this.changes === 0) {
                console.error(`Cliente com ID ${idCliente} não encontrado.`);
                resolve({ status: false, message: `Cliente com ID ${idCliente} não encontrado.` });
            } else {
                console.log(`Cliente com ID ${idCliente} removido com sucesso.`);
                resolve({ status: true, message: `Cliente com ID ${idCliente} removido com sucesso.` });
            }
            db.close();
        });
    });
}

// Exemplo de uso
const novoCliente = {
    nome: 'Novo cliente',
    endereco: 'Endereço do cliente',
    telefone: '123456789',
    idCidade: 1
};

// cadastrarCliente(novoCliente);

module.exports = { cadastrarCliente, listarClientes, removerCliente };
