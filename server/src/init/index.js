const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const databaseFile = '../../banco/database.db';

const db = new sqlite3.Database(databaseFile);

db.serialize(() => {
    db.run('DROP TABLE IF EXISTS clientes');
    db.run('DROP TABLE IF EXISTS cidades');
    db.run('DROP TABLE IF EXISTS produtos');
    db.run('DROP TABLE IF EXISTS fabricantes');
    db.run('DROP TABLE IF EXISTS vendas');
    db.run('DROP TABLE IF EXISTS items');

    db.run(`
        CREATE TABLE clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            endereco TEXT,
            telefone TEXT,
            idCidade INTEGER
        );`
    );

    db.run(`
        CREATE TABLE cidades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            estado TEXT
        );`
    );

    db.run(`
        CREATE TABLE produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descricao TEXT,
            estoque INT,
            precoCusto DECIMAL(10, 2),
            precoVenda DECIMAL(10, 2),
            idFabricante INT
        );`
    );

    db.run(`
        CREATE TABLE fabricantes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            site TEXT
        );`
    );

    db.run(`
        CREATE TABLE vendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            idCliente INT,
            dataVenda DATE,
            valorTotal DECIMAL(10, 2),
            valorPago DECIMAL(10, 2),
            desconto DECIMAL(10, 2)
        );`
    );

    db.run(`
        CREATE TABLE items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            idVenda INT,
            idProduto DATE,
            qtItem INT
        );`
    );
})


// Feche a conexão com o banco de dados ao final do programa
db.close();