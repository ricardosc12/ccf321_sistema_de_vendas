import { createSignal, onMount } from "solid-js"
import { listarProdutos } from "../../../api/produtos"
import { TextField } from "../../atoms/TextField"
import { Select } from "../../atoms/Select"


export default function ProdutosPage() {

    const [state, setState] = createSignal({
        loading: true,
        produtos: []
    })

    onMount(() => {
        (async () => {
            const resp = await listarProdutos()
            if (resp.status == false) {
                setState(prev => ({ ...prev, loading: false }))
                return
            }
            setState(prev => ({ ...prev, loading: false, produtos: resp.dados }))
        })()
    })

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target);
        const formProps = Object.fromEntries(formData);
        console.log(formProps)
        // handle form submission.
    };

    return (
        <div>
            <form onsubmit={onSubmit} class="mb-5">
                <h2 class="mb-5">Cadastrar produto</h2>
                <div class="flex flex-wrap">
                    <TextField label={"Descricao"} id="descricao" />
                    <TextField label={"Descricao"} id="descricao" />
                    <TextField label={"Descricao"} id="descricao" />
                    <TextField label={"Descricao"} id="descricao" />
                    <Select id="fabricante" label={"Fabricante"} data={[{ value: "nome1", label: "Nome 1" }, { value: "nome2", label: "Nome 2" }]} />
                </div>
                <button class="mt-3">CREATE</button>
            </form>
            <div>
                <div class="flex items-center mb-5">
                    <h2 class="mr-3">Lista de Produtos</h2>
                    {state().loading ? <h4 class="text-slate-500">Carregando...</h4> : ""}
                </div>
                <div class="flex space-x-5">
                    <For each={state().produtos}>
                        {(({ descricao, estoque, precoCusto, precoVenda }) => {
                            return (
                                <div>
                                    <div>{descricao}</div>
                                    <div>{estoque}</div>
                                    <div>{precoCusto}</div>
                                    <div>{precoVenda}</div>
                                </div>
                            )
                        })}
                    </For>
                </div>
            </div>
        </div>
    )
}
