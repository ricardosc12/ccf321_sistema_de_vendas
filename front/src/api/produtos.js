import { api } from ".";

export function listarProdutos() {
    return api.post("/produtos/listar")
}

export function criarProduto(params) {
    return api.post("/produtos/criar", params)
}

export function removerProduto(params) {
    return api.post("/produtos/remover", params)
}

export function adicionarProduto(params) {
    return api.post("/produtos/adicionar", params)
}
