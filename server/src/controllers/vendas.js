const DATABASE_FILE = require('../config');
const { getProduto } = require('./produtos');

const sqlite3 = require('sqlite3').verbose();

function verificarProdutoExistente(idProduto) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DATABASE_FILE);

        const query = 'SELECT COUNT(*) AS count FROM produtos WHERE id = ?';
        const values = [idProduto];

        db.get(query, values, function (err, row) {
            if (err) {
                console.error('Erro ao verificar produto existente:', err);
                reject(err);
            } else {
                const count = row.count;
                resolve(count > 0);
            }

            db.close();
        });
    });
}

function verificaEstoque(item) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DATABASE_FILE);

        const query = 'SELECT estoque FROM produtos WHERE id = ?';
        const values = [item.idProduto];

        db.get(query, values, function (err, row) {
            if (err) {
                console.error(`Erro ao verificar estoque do produto com ID ${item.idProduto}:`, err);
                resolve(false)
            } else {
                const estoqueAtual = row.estoque;
                if (estoqueAtual < item.qtItem) {
                    console.error(`Estoque insuficiente para o produto com ID ${item.idProduto}. Estoque atual: ${estoqueAtual}`);
                    resolve(false)
                }
            }
            resolve(true);
        })
    })
}

function updateEstoque(item) {

    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DATABASE_FILE);

        const query = 'UPDATE produtos SET estoque = estoque - ? WHERE id = ?';
        const values = [item.qtItem, item.idProduto];

        db.run(query, values, function (err) {
            if (err) {
                console.error(`Erro ao atualizar o estoque do produto com ID ${item.idProduto}:`, err);
                resolve(false)
            }
            resolve(true)
        });
    })
}

// Função para registrar uma venda
function registrarVenda(venda) {
    return new Promise(async (resolve) => {
        // Conectar ao banco de dados
        const db = new sqlite3.Database(DATABASE_FILE);

        let error = false;
        let messages = []

        // Iniciar uma transação
        db.run('BEGIN TRANSACTION');

        for (const item of venda.itens) {
            const existeProduto = await verificarProdutoExistente(item.idProduto);
            if (!existeProduto) {
                error = true
                console.error(`Produto com ID ${item.idProduto} não existe!`);
                messages.push(`Produto com ID ${item.idProduto} não existe!`)
            }
        }
        if (!error) {
            for (const item of venda.itens) {
                const isEstoque = await verificaEstoque(item)
                if (!isEstoque) {
                    error = true
                    console.error(`Produto com ID ${item.idProduto} sem estoque !`);
                    messages.push(`Produto com ID ${item.idProduto} sem estoque !`)
                }
            }
        }

        if (!error) {
            for (const item of venda.itens) {
                const isValidUpdate = await updateEstoque(item)
                if (!isValidUpdate) {
                    error = true
                    console.error(`Erro ao atulizar produto com ID ${item.idProduto} !`)
                    messages.push(`Erro ao atulizar produto com ID ${item.idProduto} !`)
                }
            }
        }

        if (error) {
            console.log("Encerrando transação !")
            try {
                db.run('ROLLBACK');
                db.close();
            } catch { }
            resolve({ status: false, mensagens: messages });
            return
        }

        let valorTotal = 0;

        for (const item of venda.itens) {
            const produto = await getProduto(item.idProduto);
            if (produto) {
                valorTotal += produto.precoVenda * item.qtItem;
            }
        }

        const valorPago = valorTotal - venda.desconto;

        // Inserir os dados da venda na tabela 'vendas'
        const queryVenda = `INSERT INTO vendas (idCliente, dataVenda, valorTotal, valorPago, desconto)
                   VALUES (?, ?, ?, ?, ?)`;

        const valuesVenda = [
            venda.idCliente,
            venda.dataVenda,
            valorTotal,
            valorPago,
            venda.desconto
        ];

        db.run(queryVenda, valuesVenda, function (err) {
            if (err) {
                console.error('Erro ao registrar a venda:', err);
                db.run('ROLLBACK'); // Desfazer a transação em caso de erro
                db.close();
                resolve({ status: false, message: "Erro ao registrar venda!" });
                return;
            }

            const vendaId = this.lastID; // Obter o ID da venda recém-inserida

            // Inserir os itens da venda na tabela 'items'
            const queryItems = `INSERT INTO items (idVenda, idProduto, qtItem)
                     VALUES (?, ?, ?)`;

            venda.itens.forEach(item => {
                const valuesItems = [vendaId, item.idProduto, item.qtItem];
                db.run(queryItems, valuesItems, function (err) {
                    if (err) {
                        console.error('Erro ao registrar o item da venda:', err);
                        db.run('ROLLBACK'); // Desfazer a transação em caso de erro
                        db.close();
                        resolve({ status: false, message: 'Erro ao registrar o item da venda:' });
                        return;
                    }
                });
            });

            // Finalizar a transação
            db.run('COMMIT', function (err) {
                if (err) {
                    console.error('Erro ao finalizar a transação:', err);
                    resolve({ status: false, message: 'Erro ao finalizar a transação:' });
                } else {
                    resolve({ status: true, message: "Venda registrada com sucesso!" })
                    console.log('Venda registrada com sucesso!');
                }
                db.close();
            });
        });
    })
}

function gerarRelatorioVendas() {
    return new Promise(resolve => {
        const db = new sqlite3.Database(DATABASE_FILE);

        const query = `
            SELECT v.id AS idVenda, v.dataVenda, v.valorTotal, v.valorPago, c.nome AS nomeCliente, c.endereco, c.telefone,
                p.descricao AS nomeProduto, i.qtItem, p.precoVenda, p.id as idProduto
            FROM vendas v
            INNER JOIN clientes c ON c.id = v.idCliente
            INNER JOIN items i ON i.idVenda = v.id
            INNER JOIN produtos p ON p.id = i.idProduto
        `;

        db.all(query, function (err, rows) {
            if (err) {
                console.error('Erro ao gerar o relatório de vendas:', err);
                resolve({ status: false, message: 'Erro ao gerar o relatório de vendas' })
            } else {
                const vendas = {}
                rows.forEach((row, index) => {
                    if (vendas[row.idVenda]) {
                        vendas[row.idVenda].produtos.push({
                            nome: row.nomeProduto,
                            id: row.idProduto,
                            preco: row.precoVenda,
                            qt: row.qtItem,
                            total: row.qtItem * row.precoVenda
                        })
                    }
                    else {
                        vendas[row.idVenda] = {
                            idVenda: row.idVenda,
                            dataVenda: row.dataVenda,
                            valorPago: row.valorPago,
                            valorTotal: row.valorTotal,
                            nomeCliente: row.nomeCliente,
                            endereco: row.endereco,
                            telefone: row.telefone,
                            produtos: [
                                {
                                    id: row.idProduto,
                                    nome: row.nomeProduto,
                                    preco: row.precoVenda,
                                    qt: row.qtItem,
                                    total: row.qtItem * row.precoVenda
                                }
                            ]
                        }
                    }
                })
                console.log('Relatório de Vendas:');
                resolve({ status: true, message: "Relatório gerado com sucesso!", dados: Object.values(vendas) })
                // resolve({ status: true, message: "Relatório gerado com sucesso!", dados: rows })
            }

            db.close();
        });
    })
}

// Exemplo de uso
const novaVenda = {
    idCliente: 123,
    dataVenda: '2023-06-22',
    valorTotal: 100.0,
    valorPago: 90.0,
    desconto: 10.0,
    itens: [
        { id: 1, idProduto: 1, qtItem: 2 },
        { id: 2, idProduto: 2, qtItem: 3 }
    ]
};

// registrarVenda(novaVenda);

module.exports = { registrarVenda, gerarRelatorioVendas };