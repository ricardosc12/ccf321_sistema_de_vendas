import { createMemo, createSignal, onMount } from "solid-js"
import { criarProduto, listarProdutos, removerProduto } from "../../../api/produtos"
import { TextField } from "../../atoms/TextField"
import { Select } from "../../atoms/Select"
import { Button } from "../../atoms/Button"
import { useStorage } from "../../../storage/context"
import { getInputs } from "../../hooks/form"


export default function ProdutosPage() {

    const [state, setState] = createSignal({
        loading: true,
        produtos: []
    })

    const [form, setForm] = createSignal({
        descricao: false,
        estoque: false,
        precoCusto: false,
        precoVenda: false,
        idFabricante: false
    })

    const { dados } = useStorage()

    const fabricantes = createMemo(() => {
        return dados.fabricantes.map(fab => ({
            value: fab.id,
            label: fab.nome
        }))
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

    async function onSubmit() {
        const inputs = getInputs(["descricao", "estoque", "precoCusto", "precoVenda", "idFabricante"])
        const erros = {}

        Object.entries(inputs).map(([id, value]) => {
            if (!value) erros[id] = true
        })
        setForm(erros)

        if (Object.values(erros).length) {
            return
        }

        const resp = await criarProduto({
            ...inputs,
            precoVenda: parseFloat(inputs.precoVenda),
            precoCusto: parseFloat(inputs.precoCusto),
        })

        if (resp.status == true) {
            setState(prev => ({
                ...prev, produtos: [...prev.produtos, {
                    id: resp.id,
                    ...inputs,
                    precoVenda: parseFloat(inputs.precoVenda),
                    precoCusto: parseFloat(inputs.precoCusto),
                }]
            }))
        }
    };

    async function handleRemove(id) {
        const resp = await removerProduto({ id })
        if (resp.status == true) {
            const newProdutos = state().produtos.filter(prod => prod.id != id)
            setState(prev=>({...prev, produtos: newProdutos}))
        }
    }

    return (
        <div>
            <form onsubmit={onSubmit} class="mb-5">
                <h2 class="mb-5">Cadastrar produto</h2>
                <div class="flex flex-wrap flex-col space-y-3">
                    <div class="flex space-x-5">
                        <TextField invalid={form().descricao} label={"Descricao"} id="descricao" />
                        <TextField invalid={form().estoque} label={"Estoque"} id="estoque" />
                    </div>
                    <div class="flex space-x-5">
                        <TextField invalid={form().precoCusto} real left="R$" label={"Preço Custo"} id="precoCusto" />
                        <TextField invalid={form().precoVenda} real left="R$" label={"Preço Venda"} id="precoVenda" />
                    </div>
                    <div>
                        <Select invalid={form().idFabricante} id="idFabricante" label={"Fabricante"} data={fabricantes()} />
                    </div>
                </div>
                <Button onclick={onSubmit} class="w-full mt-5">Cadastrar produto</Button>
            </form>
            <div>
                <div class="flex items-center mb-5">
                    <h2 class="mr-3">Lista de Produtos</h2>
                    {state().loading ? <h4 class="text-slate-500">Carregando...</h4> : ""}
                </div>
                <div class="flex space-x-5">
                    <For each={state().produtos}>
                        {(({ id, descricao, estoque, precoCusto, precoVenda }) => {
                            return (
                                <div>
                                    <div>{descricao}</div>
                                    <div>{estoque}</div>
                                    <div>{precoCusto}</div>
                                    <div>{precoVenda}</div>
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
