<script>
    import AccountCreationForm from "./components/AccountCreationForm.svelte"
	import ProfileCreationForm from "./components/ProfileCreationForm.svelte";
    import NavBar from "$lib/components/NavBar.svelte";
    import SiteHeader from "$lib/components/SiteHeader.svelte";
	import { checkNotAuthenticated } from "$lib/functions/authentication"
    import { onMount } from 'svelte';

	onMount(async () => {
		await checkNotAuthenticated();
	});

	// Switch from create account view to create profile view
	let currentComponent = AccountCreationForm;
	function handleButtonClick() {
		currentComponent = ProfileCreationForm
	}
</script>

<section>
    <SiteHeader/>
	<NavBar/>
	<!-- <a href="/account/edit">Edit an existing account</a> -->
    <div class="login-box">
		{#if currentComponent}
			<svelte:component this={currentComponent} onButtonClick={handleButtonClick} />
		{/if}
    </div>
</section>

<style>
    section {
        background-color: rgb(158, 233, 247);
        min-height: 100vh;
    } 
    
    .login-box {
        /* Flexbox */
        display: flex;
        align-items: center;
        justify-content: center;

		width: 100%;
		/* margin: 50px; */
    }
</style>
