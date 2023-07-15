import { batch, createSignal, onMount } from "solid-js"
import { TextField } from "../../atoms/TextField"
import { Button } from "../../atoms/Button"
import { listarFabricantes } from "@/api/fabricantes"
import { useStorage } from "../../../storage/context"
import { getInputs } from "../../hooks/form"
import { criarFabricantes, removerFabricante as removerFabricanteApi } from "../../../api/fabricantes"

import ImagemFactory from '../../../assets/factory.png'

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
                <h2 class="mb-5 text-slate-50 font-bold text-xl">Cadastrar fabricante</h2>
                <div class="flex flex-wrap flex-col space-y-3">
                    <div class="flex space-x-5">
                        <TextField required invalid={form().nome} label={"Nome"} id="nome" />
                        <TextField required invalid={form().site} label={"Site"} id="site" />
                    </div>
                </div>
                <Button onclick={onSubmit} class="w-full mt-5">Cadastrar fabricante</Button>
            </form>
            <div>
                <div class="flex items-center mb-5">
                    <h2 class="mr-3 text-slate-50 font-bold text-xl">Lista de fabricantes</h2>
                    {state().loading ? <h4 class="text-slate-500">Carregando...</h4> : ""}
                </div>
                <div class="flex flex-wrap">
                    <For each={dados.fabricantes}>
                        {(({ id, nome, site }) => {
                            return <ItemFabricante nome={nome} site={site}/>
                        })}
                    </For>
                </div>
            </div>
        </div>
    )
}

function ItemFabricante(props) {
    return (
        <div class="flex w-72 bg-slate-50 rounded-lg px-5 py-3 mr-4 mb-4">
            <div class="w-7">
                <img src={ImagemFactory} />
            </div>
            <div class="ml-4 w-full">
                <h3 class="text-base font-bold mb-2">{props.nome}</h3>
                <div class="text-sm mb-3">
                    <div><b>Site:</b> {props.site}</div>
                </div>
                <div class="flex space-x-3">
                    <button class="button bg-red-600 text-slate-50 hover:bg-red-500" onclick={() => handleRemove(id)}>Remover</button>
                </div>
            </div>

        </div>
    )
}