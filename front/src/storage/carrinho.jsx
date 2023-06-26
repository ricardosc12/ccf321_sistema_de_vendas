import { produce } from "solid-js/store"

export const carrinhoStorage = (set) => ({
    carrinho: [],
    dispatch: {
        addTarefa: (payload) => set(produce((state) => {
            state.dados.carrinho.push(payload)
        })),
        removeTarefa: (id) => set(produce((state) => {
            state.dados.carrinho = state.dados.carrinho.filter(item => item.id != id)
        })),
    }
})