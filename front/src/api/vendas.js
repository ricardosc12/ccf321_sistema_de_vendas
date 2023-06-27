import { api } from ".";

export function registrarVenda(params) {
    return api.post("/vendas/registrar", params)
}

export function relatorioVendas() {
    return api.post("/vendas/relatorio")
}
