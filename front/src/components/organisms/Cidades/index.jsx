import { batch, createSignal, onMount } from "solid-js"
import { removerProduto } from "../../../api/produtos"
import { TextField } from "../../atoms/TextField"
import { Button } from "../../atoms/Button"
import { useStorage } from "../../../storage/context"
import { getInputs } from "../../hooks/form"
import { criarCidade, listarCidades, removerCidade as removerCidadeApi } from "../../../api/cidades"


export default function CidadesPage() {

    const [state, setState] = createSignal({
        loading: true
    })

    const [form, setForm] = createSignal({
        nome: false,
        estado: false,
    })

    const { dados, dispatch: { setCidades, addCidade, removerCidade } } = useStorage()

    onMount(() => {
        (async () => {
            const resp = await listarCidades()
            if (resp.status == false) {
                setState(prev => ({ ...prev, loading: false }))
                return
            }
            batch(() => {
                setState(prev => ({ ...prev, loading: false }))
                setCidades(resp.dados)
            })
        })()
    })


    async function onSubmit() {
        const inputs = getInputs(["nome", "estado"])
        const erros = {}

        Object.entries(inputs).map(([id, value]) => {
            if (!value) erros[id] = true
        })
        setForm(erros)

        if (Object.values(erros).length) {
            return
        }

        const resp = await criarCidade(inputs)

        if (resp.status == true) {
            addCidade({
                id: resp.id,
                ...inputs
            })
        }
    };

    async function handleRemove(id) {
        const resp = await removerCidadeApi({ id })
        if (resp.status == true) {
            removerCidade(id)
        }
    }

    return (
        <div>
            <form onsubmit={onSubmit} class="mb-5">
                <h2 class="mb-5">Cadastrar produto</h2>
                <div class="flex flex-wrap flex-col space-y-3">
                    <div class="flex space-x-5">
                        <TextField invalid={form().nome} label={"Nome"} id="nome" />
                        <TextField invalid={form().estado} label={"Estado"} id="estado" />
                    </div>
                </div>
                <Button onclick={onSubmit} class="w-full mt-5">Cadastrar cidade</Button>
            </form>
            <div>
                <div class="flex items-center mb-5">
                    <h2 class="mr-3">Lista de Produtos</h2>
                    {state().loading ? <h4 class="text-slate-500">Carregando...</h4> : ""}
                </div>
                <div class="flex space-x-5">
                    <For each={dados.cidades}>
                        {(({ id, nome, estado }) => {
                            return (
                                <div>
                                    <div>{nome}</div>
                                    <div>{estado}</div>
                                    <button onclick={() => handleRemove(id)}>remover</button>
                                </div>
                            )
                        })}
                    </For>
                </div>
            </div>
        </div>
    )
}
