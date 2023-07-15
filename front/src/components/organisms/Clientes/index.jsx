import { batch, createMemo, createSignal, onMount } from "solid-js"
import { removerProduto } from "../../../api/produtos"
import { TextField } from "../../atoms/TextField"
import { Button } from "../../atoms/Button"
import { useStorage } from "../../../storage/context"
import { getInputs } from "../../hooks/form"
import { Select } from "../../atoms/Select"
import { criarCliente, listarClientes, removerCliente as removerClienteApi } from "../../../api/clientes"

import ImageCliente from '../../../assets/client.png'


export default function ClientesPage() {

    const [state, setState] = createSignal({
        loading: true
    })

    const [form, setForm] = createSignal({
        nome: false,
        estado: false,
    })

    const { dados, dispatch: { setClientes, addCliente, removerCliente } } = useStorage()

    const cidades = createMemo(() => {
        return dados.cidades.map(city => ({
            value: city.id,
            label: city.nome
        }))
    })

    onMount(() => {
        (async () => {
            const resp = await listarClientes()
            if (resp.status == false) {
                setState(prev => ({ ...prev, loading: false }))
                return
            }
            batch(() => {
                setState(prev => ({ ...prev, loading: false }))
                setClientes(resp.dados)
            })
        })()
    })


    async function onSubmit() {
        const inputs = getInputs(["nome", "telefone", "endereco", "idCidade"])
        const erros = {}

        Object.entries(inputs).map(([id, value]) => {
            if (!value) erros[id] = true
        })
        setForm(erros)

        if (Object.values(erros).length) {
            return
        }

        const resp = await criarCliente(inputs)

        if (resp.status == true) {
            addCliente({
                id: resp.id,
                ...inputs
            })
        }
    };

    async function handleRemove(id) {
        const resp = await removerClienteApi({ id })
        if (resp.status == true) {
            removerCliente(id)
        }
    }

    return (
        <div>
            <form onsubmit={onSubmit} class="mb-5">
                <h2 class="mb-5 text-slate-50 font-bold text-xl">Cadastrar cliente</h2>
                <div class="flex flex-wrap flex-col space-y-3">
                    <div class="flex space-x-5">
                        <TextField required invalid={form().nome} label={"Nome"} id="nome" />
                        <TextField invalid={form().estado} label={"Telefone"} id="telefone" />
                    </div>
                    <div class="flex space-x-5">
                        <TextField required invalid={form().endereco} label={"Endereco"} id="endereco" />
                    </div>
                    <div>
                        <Select required invalid={form().idCidade} id="idCidade" label={"Cidade"} data={cidades()} />
                    </div>
                </div>
                <Button onclick={onSubmit} class="w-full mt-5">Cadastrar cliente</Button>
            </form>
            <div>
                <div class="flex items-center mb-5">
                    <h2 class="mr-3 text-slate-50 font-bold text-xl">Lista de clientes</h2>
                    {state().loading ? <h4 class="text-slate-500">Carregando...</h4> : ""}
                </div>
                <div class="flex flex-wrap">
                    <For each={dados.clientes}>
                        {(({ id, nome, endereco, telefone, idCidade, }) => {
                            return <ItemCliente nome={nome}
                                endereco={endereco} telefone={telefone}
                                cidade={dados.cidades.find(city => city.id == idCidade)?.nome}
                            />
                        })}
                    </For>
                </div>
            </div>
        </div>
    )
}

function ItemCliente(props) {
    return (
        <div class="flex w-72 bg-slate-50 rounded-lg px-5 py-3 mr-4 mb-4">
            <div class="w-7">
                <img src={ImageCliente} />
            </div>
            <div class="ml-4 w-full">
                <h3 class="text-base font-bold mb-2">{props.nome}</h3>
                <div class="text-sm mb-3">
                    <div><b>Endereço:</b> {props.endereco}</div>
                    <div><b>Telefone:</b> {props.telefone}</div>
                    <div><b>Cidade:</b> {props.cidade}</div>
                </div>
                <div class="flex space-x-3">
                    <button class="button bg-red-600 text-slate-50 hover:bg-red-500" onclick={() => handleRemove(id)}>Remover</button>
                </div>
            </div>

        </div>
    )
}