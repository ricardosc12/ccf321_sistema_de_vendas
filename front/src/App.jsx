
import { For, Match, Switch, createSignal } from 'solid-js';
import { listarClientes } from './api/clientes';
import ClientesPage from './components/organisms/Clientes';
import ProdutosPage from './components/organisms/Produtos';
import { StorageProvider } from './storage/context';
import './style/index.css'

const routes = [
	{ route: ProdutosPage, nome: "Produtos", id: "produtos" },
	{ route: ClientesPage, nome: "Clientes", id: "clientes" }
]

function App() {

	async function requestTest() {
		const clientes = await listarClientes()
		console.log(clientes)
	}

	const [route, setRoute] = createSignal("produtos")

	return (
		<StorageProvider>
			<header class='flex w-full bg-slate-600 py-2 px-5'>
				<ul class='flex space-x-5'>
					<For each={routes}>
						{(route => <li onclick={()=>setRoute(route.id)} class='text-slate-200 cursor-pointer hover:text-slate-50'>{route.nome}</li>)}
					</For>
				</ul>
			</header>
			<main class='w-full p-5'>
				<Switch fallback={<div>Não encontrado !</div>}>
					<For each={routes}>
						{(rt)=><Match when={rt.id == route()}>{rt.route()}</Match>}
					</For>
				</Switch>
			</main>
		</StorageProvider>
	);
}

export default App;
