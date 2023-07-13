import { produce } from "solid-js/store"

export const clientesStorage = (set) => ({
    clientes: [],
    clienteAtivo: undefined,
    dispatch: {
        addCliente: (payload) => set(produce((state) => {
            state.dados.clientes.push(payload)
        })),
        setClientes: (payload) => set(produce((state) => {
            state.dados.clientes = payload
        })),
        setCliente: (payload) => set(produce((state) => {
            state.dados.clienteAtivo = payload
        })),
        removerCliente: (id) => set(produce((state) => {
            state.dados.clientes = state.dados.clientes.filter(item => item.id != id)
        })),

    }
})