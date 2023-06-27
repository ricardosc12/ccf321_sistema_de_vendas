import { produce } from "solid-js/store"

export const carrinhoStorage = (set) => ({
    carrinho: [],
    dispatch: {
        addCarrinho: (payload) => set(produce((state) => {
            state.dados.carrinho.push(payload)
        })),
        increaseCarrinho: (id) => set(produce((state) => {
            const index = state.dados.carrinho.findIndex(item=>item.id == id)
            if(index>=0) {
                state.dados.carrinho[index].qt = state.dados.carrinho[index].qt+1
            }
        })),
        setCarrinho: (payload) => set(produce((state) => {
            state.dados.carrinho = payload
        })),
        removerCarrinho: (id) => set(produce((state) => {
            state.dados.carrinho = state.dados.carrinho.filter(item => item.id != id)
        })),
    }
})