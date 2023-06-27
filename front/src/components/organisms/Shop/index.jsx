import { createMemo, createSignal, onMount } from "solid-js"
import { criarProduto, listarProdutos, removerProduto } from "../../../api/produtos"
import { notificationService } from '@hope-ui/solid'
import { Select } from "../../atoms/Select"
import { Button } from "../../atoms/Button"
import { useStorage } from "../../../storage/context"
import { getInputs } from "../../hooks/form"
import { registrarVenda } from "../../../api/vendas"

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

    const clientes = createMemo(() => {
        return dados.clientes.map(fab => ({
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
        const inputs = getInputs(["idCliente"])
        const erros = {}

        Object.entries(inputs).map(([id, value]) => {
            if (!value) erros[id] = true
        })

        setForm(erros)

        if (Object.values(erros).length) {
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
            ...inputs,
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
            return
        }
        else {
            notificationService.show({
                status: "warning",
                title: "Venda",
                description: Array.isArray(resp.mensagens)?resp.mensagens.join("-"):resp.mensagens,
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
                    <h2 class="w-2/4">Shopping</h2>
                    <div class="flex items-center w-2/4">
                        <h2 class="w-36">Logado com: </h2>
                        <Select disabledLabel defaultValue={clientes()[0]?.value} invalid={form().idCliente} id="idCliente" label={"Cliente"} data={clientes()} />
                    </div>

                </div>
                <Button onclick={onSubmit} class="w-full mt-5">Comprar</Button>
            </form>
            <div class="flex flex-col">
                <div class="flex flex-col mb-5">
                    <h2 class="mr-3">Carrinho</h2>
                    {!dados.carrinho?.length ? <h4 class="text-slate-500">Vazio</h4> : ""}
                    <div class="flex space-x-4">
                        <For each={dados.carrinho}>
                            {(item) => {
                                return (
                                    <div>
                                        <div>{item.descricao}</div>
                                        <div>{item.qt}</div>
                                    </div>
                                )
                            }}
                        </For>
                    </div>
                </div>
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
                                    <button onclick={() => addCarrinho_(id)}>adicionar</button>
                                </div>
                            )
                        })}
                    </For>
                </div>
            </div>
        </div>
    )
}
