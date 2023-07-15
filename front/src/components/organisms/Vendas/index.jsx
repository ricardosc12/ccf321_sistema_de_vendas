import { createSignal, onMount, createMemo } from "solid-js"
import { relatorioVendas } from "../../../api/vendas"


export default function VendasPage() {

    const [state, setState] = createSignal({
        loading: true,
        vendas: []
    })

    const totais = createMemo(() => {
        let totalValor = 0

        state().vendas.forEach(venda => {
            totalValor += venda.valorPago
        })

        return { totalValor, totalVendas: state().vendas.length }
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
                <div class="flex items-start justify-between w-full">
                    <div>
                        <h2 class="mr-3 text-slate-50 font-bold text-xl">Relatório de vendas</h2>
                        {state().loading ? <h4 class="text-slate-500">Carregando...</h4> : ""}
                    </div>
                    <div class="text-slate-50 font-bold text-lg">
                        <h2>Total: R$ {parseFloat(totais().totalValor).toFixed(2)}</h2>
                        <h2>Vendas: {totais().totalVendas}</h2>
                    </div>
                </div>
            </div>
            <div class="flex flex-col text-slate-50 font-bold">
                <For each={state().vendas}>
                    {(({ idVenda, dataVenda, produtos, endereco, nomeCliente, valorPago, valorTotal }) => {
                        return (
                            <div class="w-full bg-slate-300 text-slate-900 mb-7 rounded p-2 px-4">
                                <table class="w-full">
                                    <thead>
                                        <tr>
                                            <th class="text-left">Id: {idVenda}</th>
                                            <th class="text-left">Data: {dataVenda}</th>
                                        </tr>
                                    </thead>
                                </table>
                                <table class="w-full">
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
                                <table class="w-full">
                                    <thead>
                                        <tr>
                                            <th class="text-left">Cliente: {nomeCliente}</th>
                                            <th class="text-left">Endereco: {endereco}</th>
                                            <th class="text-left">Valor total: {valorTotal}</th>
                                            <th class="text-left">Valor Pago: {valorPago}</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
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