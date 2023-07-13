
import { For, Match, Switch, createMemo, createSignal, onMount, createEffect } from 'solid-js';
import { listarClientes } from './api/clientes';

import ClientesPage from './components/organisms/Clientes';
import ProdutosPage from './components/organisms/Produtos';
import FabricantesPage from './components/organisms/Fabricantes';
import CidadesPage from './components/organisms/Cidades';
import ShopPage from './components/organisms/Shop';
import VendasPage from './components/organisms/Vendas';

import { StorageProvider, useStorage } from './storage/context';
import { HopeProvider, NotificationsProvider } from '@hope-ui/solid'

import './style/index.css'
import { Select } from './components/atoms/Select';

import ImageBack from './assets/background.jpg'


const routes = [
	{ route: ProdutosPage, nome: "Produtos", id: "produtos" },
	{ route: ClientesPage, nome: "Clientes", id: "clientes" },
	{ route: FabricantesPage, nome: "Fabricantes", id: "fabricantes" },
	{ route: CidadesPage, nome: "Cidades", id: "cidades" },
	{ route: ShopPage, nome: "Shop", id: "shop" },
	{ route: VendasPage, nome: "Vendas", id: "vendas" },
]

function ClienteSelector() {

	const { dados, dispatch: { setCliente } } = useStorage()

	const clientes = createMemo(() => {
		return dados.clientes.map(fab => ({
			value: fab.id,
			label: fab.nome
		}))
	})

	createEffect(()=>{
		if(clientes()[0]) {
			setCliente(clientes()[0].value)
		}
	})

	return (
		<div class='mt-5 flex flex-col w-full px-5 pr-14'>
			Cliente logado
			<Select disabledLabel onChange={setCliente} defaultValue={clientes()[0]?.value} id="clientAtivo" label={"Cliente"} data={clientes()} />
		</div>
	)
}

function App() {

	onMount(() => {
		const url = location.pathname.replace("/", "")
		setRoute(url)
	})

	const [route, setRoute] = createSignal("produtos")

	function handleRoute(id) {
		setRoute(id)
		window.history.pushState("", id, "/" + id);
	}

	return (
		<StorageProvider>
			<HopeProvider>
				<NotificationsProvider>
					<div class='flex bg-[#F2AE30]'>
						<header class='flex flex-col h-screen w-80 bg-[#F2AE30] py-2 z-10'>
							<div class='flex w-full h-32 justify-center items-center'>E-Commerce</div>
							<ul class='flex flex-col'>
								<For each={routes}>
									{(rt => <div onclick={() => handleRoute(rt.id)}
										class={`flex px-5 items-center w-full h-11 text-[#333333] cursor-pointer hover:text-slate-50 hover:bg-[#024959]
										${rt.id == route() ? "text-slate-50 bg-[#024959]" : ""}
										`}>
										<b>{rt.nome}</b>
									</div>)}
								</For>
							</ul>

							<ClienteSelector />

						</header>
						<main class='w-full back'>
							<div class='page-header z-20'>
								<h1 class='text-6xl text-slate-50'>{routes.find(item => item.id == route())?.nome || "Página não encontrada"}</h1>
							</div>
							<div class='main-page relative z-20'>
								<Switch fallback={<div>Não encontrado !</div>}>
									<For each={routes}>
										{(rt) => <Match when={rt.id == route()}>{rt.route()}</Match>}
									</For>
								</Switch>
							</div>
						</main>
					</div>
				</NotificationsProvider>
			</HopeProvider>
		</StorageProvider>
	);
}

export default App;
