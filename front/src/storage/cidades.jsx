import { produce } from "solid-js/store"

export const cidadesStorage = (set) => ({
    cidades: [],
    dispatch: {
        addCidade: (payload) => set(produce((state) => {
            state.dados.cidades.push(payload)
        })),
        setCidades: (payload) => set(produce((state) => {
            state.dados.cidades = payload
        })),
        removerCidade: (id) => set(produce((state) => {
            state.dados.cidades = state.dados.cidades.filter(item => item.id != id)
        })),
    }
})