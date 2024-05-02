import { goto } from "$app/navigation";

export async function checkAuthenticated() {
	const token = localStorage.getItem("token");

	const response = await fetch("http://localhost:3000/account/auth", {
		headers : {
			"Authorization": `Bearer ${token}`
		}
	})

	if (response.status != 200) {
		goto('/account/login');
		return;
	}

	return token;
}

export async function checkNotAuthenticated() {
	const token = localStorage.getItem("token");

	const response = await fetch("http://localhost:3000/account/auth", {
		headers : {
			"Authorization": `Bearer ${token}`
		}
	})

	if (response.status == 200) {
		goto('/feed');
		return;
	}
}
