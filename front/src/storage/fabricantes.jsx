import { produce } from "solid-js/store"

export const fabricantesStorage = (set) => ({
    fabricantes: [],
    dispatch: {
        addFabricante: (payload) => set(produce((state) => {
            state.dados.fabricantes.push(payload)
        })),
        setFabricantes: (payload) => set(produce((state) => {
            state.dados.fabricantes = payload
        })),
        removerFabricante: (id) => set(produce((state) => {
            state.dados.fabricantes = state.dados.fabricantes.filter(item => item.id != id)
        })),
    }
})