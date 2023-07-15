import { createMemo, createSignal, onMount } from "solid-js"
import { adicionarProduto, criarProduto, listarProdutos, removerProduto } from "../../../api/produtos"
import { TextField } from "../../atoms/TextField"
import { Select } from "../../atoms/Select"
import { Button } from "../../atoms/Button"
import { useStorage } from "../../../storage/context"
import { getInputs } from "../../hooks/form"

import ImageProduct from '../../../assets/package.png'


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
            setState(prev => ({ ...prev, produtos: newProdutos }))
        }
    }

    const [loadingAdd, setLoadingAdd] = createSignal(false)

    async function handleAdicionar(id) {
        if (loadingAdd()) return
        setLoadingAdd(true)
        const resp = await adicionarProduto({ id })
        if (resp.status == true) {
            const newProdutos = JSON.parse(JSON.stringify(state().produtos))
            const index = newProdutos.findIndex(prod => prod.id == id)
            if (index != -1) {
                newProdutos[index].estoque += 1
                setState(prev => ({ ...prev, produtos: newProdutos }))
            }

        }
        setLoadingAdd(false)
    }

    return (
        <div>
            <form onsubmit={onSubmit} class="mb-5">
                <h2 class="mb-5 text-slate-50 font-bold text-xl">Cadastrar produto</h2>
                <div class="flex flex-wrap flex-col space-y-3">
                    <div class="flex space-x-5">
                        <TextField required invalid={form().descricao} label={"Descricao"} id="descricao" />
                        <TextField required invalid={form().estoque} label={"Estoque"} id="estoque" />
                    </div>
                    <div class="flex space-x-5">
                        <TextField required invalid={form().precoCusto} real left="R$" label={"Preço Custo"} id="precoCusto" />
                        <TextField required invalid={form().precoVenda} real left="R$" label={"Preço Venda"} id="precoVenda" />
                    </div>
                    <div>
                        <Select required invalid={form().idFabricante} id="idFabricante" label={"Fabricante"} data={fabricantes()} />
                    </div>
                </div>
                <Button onclick={onSubmit} class="w-full mt-5">Cadastrar produto</Button>
            </form>
            <div>
                <div class="flex items-center mb-5">
                    <h2 class="mr-3 text-slate-50 font-bold text-xl">Lista de Produtos</h2>
                    {state().loading ? <h4 class="text-slate-500">Carregando...</h4> : ""}
                </div>
                <div class="flex space-x-5">
                    <For each={state().produtos}>
                        {(({ id, descricao, estoque, precoCusto, precoVenda, idFabricante }) => {
                            return <ItemProduto loadingAdd={loadingAdd}
                                fabricante={fabricantes().find(item => item.value == idFabricante)?.label}
                                handleAdicionar={handleAdicionar} handleRemove={handleRemove} id={id}
                                descricao={descricao} estoque={estoque} precoCusto={precoCusto} precoVenda={precoVenda}
                            />
                        })}
                    </For>
                </div>
            </div>
        </div>
    )
}

function ItemProduto(props) {
    return (
        <div class="flex w-72 bg-slate-50 rounded-lg px-5 py-3">
            <div class="w-7">
                <img src={ImageProduct} />
            </div>
            <div class="ml-4 w-full">
                <h3 class="text-base font-bold mb-2">{props.descricao}</h3>
                <div class="text-sm mb-2">
                    <div><b>Estoque:</b> {props.estoque}</div>
                    <div><b>Fabricante:</b> {props.fabricante}</div>
                </div>
                <div class="flex justify-between w-full font-medium mb-3">
                    <div>
                        <b>Custo</b>
                        <div>R$ {props.precoCusto}</div>
                    </div>
                    <div>
                        <b>Venda</b>
                        <div>R$ {props.precoVenda}</div>
                    </div>

                </div>
                <div class="flex space-x-3">
                    <button class={`button bg-green-600 text-slate-50 hover:bg-green-500 `} onclick={() => props.handleAdicionar(props.id)}>Adicionar</button>
                    <button class="button bg-red-600 text-slate-50 hover:bg-red-500" onclick={() => props.handleRemove(props.id)}>Remover</button>
                </div>
            </div>

        </div>
    )
}