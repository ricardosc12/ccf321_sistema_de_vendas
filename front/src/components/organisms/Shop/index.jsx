import { createMemo, createSignal, onMount } from "solid-js"
import { criarProduto, listarProdutos, removerProduto } from "../../../api/produtos"
import { notificationService } from '@hope-ui/solid'
import { Select } from "../../atoms/Select"
import { Button } from "../../atoms/Button"
import { useStorage } from "../../../storage/context"
import { getInputs } from "../../hooks/form"
import { registrarVenda } from "../../../api/vendas"

import ImageProduct from '../../../assets/package.png'
import ImageCart from '../../../assets/cart.png'

function formatDate() {
    const time = new Date()
    return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
}

export default function ShopPage() {

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

    const { dados, dispatch: { addCarrinho, increaseCarrinho, setCarrinho } } = useStorage()

    const fabricantes = createMemo(() => {
        return dados.fabricantes.map(fab => ({
            value: fab.id,
            label: fab.nome
        }))
    })

    async function getProdutos() {
        const resp = await listarProdutos()
        if (resp.status == false) {
            setState(prev => ({ ...prev, loading: false }))
            return
        }
        setState(prev => ({ ...prev, loading: false, produtos: resp.dados }))
    }

    onMount(() => {
        getProdutos()
    })

    async function onSubmit() {
        const cliente = dados.clienteAtivo

        if (cliente === undefined || cliente === null || cliente === false) {
            notificationService.show({
                status: "info",
                title: "Venda não registrada",
                description: "Selecione um cliente ou crie um para começar.",
                duration: 2_000,
            });

            return
        }

        if (!dados.carrinho.length) {
            notificationService.show({
                status: "info",
                title: "Venda não registrada",
                description: "Adicione itens ao carrinho",
                duration: 2_000,
            });
            return
        }

        const request = {
            idCliente: cliente,
            dataVenda: formatDate(),
            desconto: 10,
            itens: dados.carrinho.map(item => ({
                idProduto: item.id,
                qtItem: item.qt
            }))
        }

        const resp = await registrarVenda(request)

        if (resp.status == true) {
            notificationService.show({
                status: "success",
                title: "Venda",
                description: resp.message,
                duration: 2_000,
            });
            setCarrinho([])
            getProdutos()
            return
        }
        else {
            notificationService.show({
                status: "warning",
                title: "Venda",
                description: Array.isArray(resp.mensagens) ? resp.mensagens.join("-") : resp.mensagens,
                duration: 4_000,
            });
        }
    };

    async function addCarrinho_(id) {
        let produto = state().produtos.find(item => item.id == id)
        const prodCarrinho = dados.carrinho.find(item => item.id == id)
        if (!prodCarrinho) {
            addCarrinho({
                qt: 1,
                ...produto
            })
        }
        else {
            increaseCarrinho(id)
        }
    }

    return (
        <div>
            <form onsubmit={onSubmit} class="mb-5">
                <div class="flex w-full justify-between items-center">
                    <h2 class="w-2/4 text-slate-50 font-bold text-xl">Shopping</h2>
                </div>
                <Button onclick={onSubmit} class="w-full mt-5">Comprar</Button>
            </form>
            <div class="flex flex-col">
                <div class="flex flex-col mb-5">
                    <h2 class="mr-3 text-slate-50 font-bold text-xl">Carrinho</h2>
                    {!dados.carrinho?.length ? <h4 class="text-slate-500">Vazio</h4> : ""}
                    <div class="flex space-x-4">
                        <For each={dados.carrinho}>
                            {(item) => {
                                return <ItemCarrinho descricao={item.descricao} qt={item.qt} />
                            }}
                        </For>
                    </div>
                </div>
                <div class="flex items-center mb-5">
                    <h2 class="mr-3 text-slate-50 font-bold text-xl">Lista de Produtos</h2>
                    {state().loading ? <h4 class="text-slate-500">Carregando...</h4> : ""}
                </div>
                <div class="flex space-x-5">
                    <For each={state().produtos}>
                        {(({ id, descricao, estoque, precoCusto, precoVenda, idFabricante }) => {
                            return <ItemProduto fabricante={fabricantes().find(item => item.value == idFabricante)?.label} addCarrinho_={addCarrinho_} id={id}
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
                    <button class="button bg-green-600 text-slate-50 hover:bg-green-500" onclick={() => props.addCarrinho_(props.id)}>Adicionar ao carrinho</button>
                </div>
            </div>

        </div>
    )
}

function ItemCarrinho(props) {
    return (
        <div class="flex w-72 bg-slate-50 rounded-lg px-5 py-3">
            <div class="w-7">
                <img src={ImageCart} />
            </div>
            <div class="ml-4 w-full">
                <h3 class="text-base font-bold mb-2">{props.descricao}</h3>
                <div class="text-sm mb-2">
                    <div><b>Quantidade:</b> {props.qt}</div>
                </div>
                <div class="flex space-x-3">
                    <button class="button bg-red-600 text-slate-50 hover:bg-red-500" onclick={() => { }}>Remover</button>
                </div>
            </div>
        </div>
    )

}