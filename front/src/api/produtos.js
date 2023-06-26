import { api } from ".";

export function listarProdutos(){
    return api.post("/produtos/listar") 
}