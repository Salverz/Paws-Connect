<script>
import { onMount } from "svelte";
let data;
onMount(async () => {
  const response = await fetch('http://localhost:3000/account/create');
  const json = await response.json();
  
  data = json.login;
});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<p>data is {data}</p>

Enter your password: <input type="text">
<input type="submit">