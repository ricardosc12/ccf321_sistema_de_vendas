
import { For, Match, Switch, createSignal, onMount } from 'solid-js';
import { listarClientes } from './api/clientes';

import ClientesPage from './components/organisms/Clientes';
import ProdutosPage from './components/organisms/Produtos';
import FabricantesPage from './components/organisms/Fabricantes';
import CidadesPage from './components/organisms/Cidades';
import ShopPage from './components/organisms/Shop';
import VendasPage from './components/organisms/Vendas';

import { StorageProvider } from './storage/context';
import { HopeProvider, NotificationsProvider } from '@hope-ui/solid'


import './style/index.css'




const routes = [
	{ route: ProdutosPage, nome: "Produtos", id: "produtos" },
	{ route: ClientesPage, nome: "Clientes", id: "clientes" },
	{ route: FabricantesPage, nome: "Fabricantes", id: "fabricantes" },
	{ route: CidadesPage, nome: "Cidades", id: "cidades" },
	{ route: ShopPage, nome: "Shop", id: "shop" },
	{ route: VendasPage, nome: "Vendas", id: "vendas" },

]

function App() {

	async function requestTest() {
		const clientes = await listarClientes()
		console.log(clientes)
	}

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
					<header class='flex w-full bg-slate-600 py-2 px-10'>
						<ul class='flex space-x-10'>
							<For each={routes}>
								{(route => <li onclick={() => handleRoute(route.id)} class='text-slate-200 cursor-pointer hover:text-slate-50'>{route.nome}</li>)}
							</For>
						</ul>
					</header>
					<main class='w-full p-5'>
						<Switch fallback={<div>Não encontrado !</div>}>
							<For each={routes}>
								{(rt) => <Match when={rt.id == route()}>{rt.route()}</Match>}
							</For>
						</Switch>
					</main>
				</NotificationsProvider>
			</HopeProvider>
		</StorageProvider>
	);
}

export default App;
