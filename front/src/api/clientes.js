import { api } from ".";

export function listarClientes() {
    return api.post("/clientes/listar")
}

export function criarCliente(params) {
    return api.post("/clientes/criar", params)
}

export function removerCliente(params) {
    return api.post("/clientes/remover", params)
}