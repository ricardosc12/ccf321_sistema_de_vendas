import { createContext, onMount, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { carrinhoStorage } from "./carrinho";
import { fabricantesStorage } from "./fabricantes";
import { listarFabricantes } from "../api/fabricantes";
import { cidadesStorage } from "./cidades";
import { listarCidades } from "../api/cidades";
import { clientesStorage } from "./clientes";
import { listarClientes } from "../api/clientes";

const CounterContext = createContext();

export const useStorage = () => useContext(CounterContext);

export function StorageProvider(props) {

    const [state, setState] = createStore({
        dados: {
            carrinho: carrinhoStorage().carrinho,
            fabricantes: fabricantesStorage().fabricantes,
            cidades: cidadesStorage().cidades,
            clientes: clientesStorage().clientes
        }
    });

    const counter = {
        dados: state.dados,
        dispatch: {
            ...carrinhoStorage(setState).dispatch,
            ...fabricantesStorage(setState).dispatch,
            ...cidadesStorage(setState).dispatch,
            ...clientesStorage(setState).dispatch,
            
        }
    }

    onMount(() => {
        (async () => {
            const resp = await listarFabricantes()
            if (resp.status == false) {
                return
            }
            counter.dispatch.setFabricantes(resp.dados)
        })();

        (async () => {
            const resp = await listarCidades()
            if (resp.status == false) {
                return
            }
            counter.dispatch.setCidades(resp.dados)
        })();

        (async () => {
            const resp = await listarClientes()
            if (resp.status == false) {
                return
            }
            counter.dispatch.setClientes(resp.dados)
        })();
    })

    return (
        <CounterContext.Provider value={counter}>
            {props.children}
        </CounterContext.Provider>
    );
}