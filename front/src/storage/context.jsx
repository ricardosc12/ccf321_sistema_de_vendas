import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { carrinhoStorage } from "./carrinho";

const CounterContext = createContext();

export const useStorage = () => useContext(CounterContext);

export function StorageProvider(props) {

    const [state, setState] = createStore({
        dados: {
            tarefas: carrinhoStorage().tarefas,
        }
    });

    const counter = {
        dados: state.dados,
        dispatch: {
            ...carrinhoStorage(setState).dispatch,
        }
    }

    return (
        <CounterContext.Provider value={counter}>
            {props.children}
        </CounterContext.Provider>
    );
}