const { cadastrarCidade, listarCidades, removerCidade } = require("./controllers/cidades");
const { cadastrarCliente, listarClientes, removerCliente } = require("./controllers/clientes");
const { cadastrarFabricante, listarFabricantes, removerFabricante } = require("./controllers/fabricante");
const { cadastrarProduto, listarProdutos, removerProduto } = require("./controllers/produtos");
const {registrarVenda, gerarRelatorioVendas} = require("./controllers/vendas");

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

app.use(bodyParser.json()); // Suporte a JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Rota de produtos
app.post('/produtos/:acao', async (req, res) => {
    const acao = req.params.acao;
    if (acao == "criar") {
        const resp = await cadastrarProduto(req.body)
        res.json(resp)
    }
    else if (acao == "listar") {
        const resp = await listarProdutos()
        res.json(resp)
    }
    else if (acao == "remover") {
        const resp = await removerProduto(req.body)
        res.json(resp)
    }
});

// Rota de fabricantes
app.post('/fabricantes/:acao', async (req, res) => {
    const acao = req.params.acao;
    if (acao == "criar") {
        const resp = await cadastrarFabricante(req.body)
        res.json(resp)
    }
    else if (acao == "listar") {
        const resp = await listarFabricantes()
        res.json(resp)
    }
    else if (acao == "remover") {
        const resp = await removerFabricante(req.body)
        res.json(resp)
    }
});

app.post('/cidades/:acao', async (req, res) => {
    const acao = req.params.acao;
    if (acao == "criar") {
        const resp = await cadastrarCidade(req.body)
        res.json(resp)
    }
    else if (acao == "listar") {
        const resp = await listarCidades()
        res.json(resp)
    }
    else if (acao == "remover") {
        const resp = await removerCidade(req.body)
        res.json(resp)
    }
});

app.post('/vendas/:acao', async (req, res) => {
    const acao = req.params.acao;
    if (acao == "registrar") {
        const resp = await registrarVenda(req.body)
        res.json(resp)
    }
    else if (acao == "relatorio") {
        const resp = await gerarRelatorioVendas()
        res.json(resp)
    }
});

// Rota de clientes
app.post('/clientes/:acao', async (req, res) => {
    const acao = req.params.acao;
    if (acao === "criar") {
        const resp = await cadastrarCliente(req.body)
        res.json(resp)
    }
    else if (acao == "listar") {
        const resp = await listarClientes()
        res.json(resp)
    }
    else if (acao == "remover") {
        const resp = await removerCliente(req.body)
        res.json(resp)
    }
});

// Porta em que o servidor irá escutar
const port = 3005;

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor escutando na porta ${port}`);
});