import { batch, createSignal, onMount } from "solid-js"
import { TextField } from "../../atoms/TextField"
import { Button } from "../../atoms/Button"
import { listarFabricantes } from "@/api/fabricantes"
import { useStorage } from "../../../storage/context"
import { getInputs } from "../../hooks/form"
import { criarFabricantes, removerFabricante as removerFabricanteApi } from "../../../api/fabricantes"

export default function FabricantesPage() {

    const [state, setState] = createSignal({
        loading: true
    })

    const [form, setForm] = createSignal({
        nome: false,
        site: false
    })

    const { dados, dispatch: { setFabricantes, addFabricante, removerFabricante } } = useStorage()

    onMount(() => {
        (async () => {
            const resp = await listarFabricantes()
            if (resp.status == false) {
                setState(prev => ({ ...prev, loading: false }))
                return
            }
            batch(() => {
                setState(prev => ({ ...prev, loading: false }))
                setFabricantes(resp.dados)
            })
        })()
    })

    const onSubmit = async (e) => {
        const { nome, site } = getInputs(["nome", "site"])
        if (!(nome && site)) {
            setForm({
                nome: !nome,
                site: !site
            })
            return
        }
        const resp = await criarFabricantes({
            nome: nome,
            site: site
        })

        if (resp.status == true) {
            addFabricante({ id: resp.id, nome, site })
        }
    };

    async function handleRemove(id) {
        const resp = await removerFabricanteApi({ id })
        if (resp.status == true) {
            removerFabricante(id)
        }
    }

    return (
        <div>
            <form onsubmit={onSubmit} class="mb-5">
                <h2 class="mb-5">Cadastrar fabricante</h2>
                <div class="flex flex-wrap flex-col space-y-3">
                    <div class="flex space-x-5">
                        <TextField invalid={form().nome} label={"Nome"} id="nome" />
                        <TextField invalid={form().site} label={"Site"} id="site" />
                    </div>
                </div>
                <Button onclick={onSubmit} class="w-full mt-5">Cadastrar fabricante</Button>
            </form>
            <div>
                <div class="flex items-center mb-5">
                    <h2 class="mr-3">Lista de fabricantes</h2>
                    {state().loading ? <h4 class="text-slate-500">Carregando...</h4> : ""}
                </div>
                <div class="flex space-x-5">
                    <For each={dados.fabricantes}>
                        {(({ id, nome, site }) => {
                            return (
                                <div>
                                    <div>{nome}</div>
                                    <div>{site}</div>
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
