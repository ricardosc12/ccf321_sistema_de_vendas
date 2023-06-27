import { api } from ".";

export function listarFabricantes(){
    return api.post("/fabricantes/listar") 
}

export function criarFabricantes(params){
    return api.post("/fabricantes/criar", params) 
}

export function removerFabricante(params) {
    return api.post("/fabricantes/remover", params)
}