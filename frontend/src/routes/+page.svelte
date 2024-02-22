<script>
import { onMount } from "svelte";
import { apiData} from './store.js';

onMount(async () => {
  fetch("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Bourbon")
  .then(response => response.json())
  .then(data => {
		console.log(data);
    apiData.set(data);
  }).catch(error => {
    console.log(error);
    return [];
  });
});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
