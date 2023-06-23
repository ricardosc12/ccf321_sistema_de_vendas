const DATABASE_FILE = require('../config');

const sqlite3 = require('sqlite3').verbose();

function verificarFabricanteExistente(idFabricante, callback) {
    const db = new sqlite3.Database(DATABASE_FILE);

    const query = 'SELECT COUNT(*) AS count FROM fabricantes WHERE id = ?';
    const values = [idFabricante];

    db.get(query, values, function (err, row) {
        if (err) {
            console.error(`Erro ao verificar a existência do fabricante com ID ${idFabricante}:`, err);
            callback(false);
        } else {
            const count = row.count;
            const existeFabricante = count > 0;
            callback(existeFabricante);
        }

        db.close();
    });
}

// Função para cadastrar um novo produto
function cadastrarProduto(produto) {
    return new Promise((resolve) => {
        const db = new sqlite3.Database(DATABASE_FILE);

        // Verificar se o fabricante existe
        verificarFabricanteExistente(produto.idFabricante, function (existeFabricante) {
            if (existeFabricante) {
                // Inserir os dados do produto na tabela 'produtos'
                const query = `INSERT INTO produtos (descricao, estoque, precoCusto, precoVenda, idFabricante)
                           VALUES (?, ?, ?, ?, ?)`;
                const values = [
                    produto.descricao,
                    produto.estoque,
                    produto.precoCusto,
                    produto.precoVenda,
                    produto.idFabricante
                ];

                db.run(query, values, function (err) {
                    if (err) {
                        console.error('Erro ao cadastrar o produto:', err);
                        resolve({ status: false, mensagem: err })
                    } else {
                        console.log('Produto cadastrado com sucesso! ID:', this.lastID);
                        resolve({ status: true, mensage: "Produto cadastrado com sucesso!", id: this.lastID })
                    }

                    db.close();
                });
            } else {
                console.error(`Fabricante com ID ${produto.idFabricante} não existe!`);
                resolve({ status: false, mensagem: `Fabricante com ID ${produto.idFabricante} não existe!` })
                db.close();
            }
        });
    })
}

function listarProdutos() {
    return new Promise(resolve => {
        const db = new sqlite3.Database(DATABASE_FILE);

        const query = 'SELECT * FROM produtos';

        db.all(query, function (err, rows) {
            if (err) {
                console.error('Erro ao listar os produtos:', err);
                resolve({ status: false, message: 'Erro ao listar os produtos' })
            } else {
                resolve({ status: true, message: 'Listagem concluida!', dados: rows })
            }
            db.close();
        });
    })
}

// Exemplo de uso
const novoProduto = {
    descricao: 'Produto exemplo',
    estoque: 10,
    precoCusto: 50.0,
    precoVenda: 100.0,
    idFabricante: 1
};

// cadastrarProduto(novoProduto);

module.exports = { cadastrarProduto, listarProdutos };