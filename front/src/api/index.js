export const base_url = "http://localhost:3005"

export const api = {
	post: async (endpoint, params) => {
		try {
			const response = await fetch(base_url + endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(params),
			});

			if (!response.ok) {
				throw new Error("Erro na chamada da API");
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Erro na chamada da API:", error);
			throw error;
		}
	},
};