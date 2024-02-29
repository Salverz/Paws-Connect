<script>
// import { onMount } from "svelte";
// let data;
// onMount(async () => {
//   const response = await fetch('http://localhost:3000/account/create');
//   const json = await response.json();
  
//   data = json.login;
// });
  // export let data;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<form action="http://localhost:3000/account/create?">
  Enter your password: <input name="password" type="text">
  <input type="submit">
</form>
<p>from page.js: {data.setup}</p>

<a href="/account/create">Go to account create</a>

<h1>updated</h1>

<style>
  h1 {
    color: red;
  }
</style>