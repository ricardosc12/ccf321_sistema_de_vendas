import { api } from ".";

export function listarCidades() {
    return api.post("/cidades/listar")
}

export function criarCidade(params) {
    return api.post("/cidades/criar", params)
}

export function removerCidade(params) {
    return api.post("/cidades/remover", params)
}