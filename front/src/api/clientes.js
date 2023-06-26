import { api } from ".";

export function listarClientes(){
    return api.post("/clientes/listar") 
}