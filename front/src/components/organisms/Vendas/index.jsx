import { createSignal, onMount } from "solid-js"
import { relatorioVendas } from "../../../api/vendas"


export default function VendasPage() {

    const [state, setState] = createSignal({
        loading: true,
        vendas: []
    })

    onMount(() => {
        (async () => {
            const resp = await relatorioVendas()
            if (resp.status == false) {
                setState(prev => ({ ...prev, loading: false }))
                return
            }
            setState(prev => ({ ...prev, loading: false, vendas: resp.dados }))
        })()
    })

    return (
        <div>
            <div class="flex items-center mb-5">
                <h2 class="mr-3">Relatório de vendas</h2>
                {state().loading ? <h4 class="text-slate-500">Carregando...</h4> : ""}
            </div>
            <div class="flex flex-col">
                <For each={state().vendas}>
                    {(({ idVenda, dataVenda, produtos, endereco, nomeCliente, valorPago, valorTotal }) => {
                        return (
                            <>
                                <table>
                                    <thead>
                                        <tr>
                                            <th class="text-left">Id: {idVenda}</th>
                                            <th class="text-left">Data: {dataVenda}</th>
                                        </tr>
                                    </thead>
                                </table>
                                <table>
                                    <thead>
                                        <tr>
                                            <th class="text-left">Nome</th>
                                            <th class="text-left">Preço</th>
                                            <th class="text-left">Quantidade</th>
                                            <th class="text-left">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <For each={produtos}>
                                            {(item) => {
                                                return (
                                                    <tr>
                                                        <td>{item.nome}</td>
                                                        <td>{item.preco}</td>
                                                        <td>{item.qt}</td>
                                                        <td>{item.total}</td>
                                                    </tr>
                                                )
                                            }}
                                        </For>
                                    </tbody>
                                </table>
                                <table class="mb-7">
                                    <thead>
                                        <tr>
                                            <th class="text-left">Cliente: {nomeCliente}</th>
                                            <th class="text-left">Endereco: {endereco}</th>
                                            <th class="text-left">Valor total: {valorTotal}</th>
                                            <th class="text-left">Valor Pago: {valorPago}</th>
                                        </tr>
                                    </thead>
                                </table>
                            </>
                        )
                    })}
                </For>
            </div>
        </div>
    )
}


function Table() {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Data</th>
                    <th>Nome</th>
                    <th>Preço</th>
                    <th>Quantidade</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>2023-06-25</td>
                    <td>Item 1</td>
                    <td>R$ 10.00</td>
                    <td>5</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>2023-06-25</td>
                    <td>Item 2</td>
                    <td>R$ 15.00</td>
                    <td>3</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>2023-06-26</td>
                    <td>Item 3</td>
                    <td>R$ 20.00</td>
                    <td>2</td>
                </tr>
            </tbody>
        </table>
    )
}