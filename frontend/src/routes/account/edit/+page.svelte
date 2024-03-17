<script>
import NavBar from "$lib/components/NavBar.svelte";
import EditProfileForm from "./components/EditProfileForm.svelte";
import SiteHeader from "$lib/components/SiteHeader.svelte";

let username;
</script>

<SiteHeader/>
<div class="page-layout">
    <EditProfileForm/>
    <NavBar/>
</div>

<style>
    .page-layout {
        /* Flexbox */
        display: flex;
        justify-content: right;
    }
</style>

<!-- TYPE "npm run dev" IN THE CONSOLE TO RUN THE WEBSITE -->
<!-- WHEN YOU SAVE A FILE, YOUR CHANGES SHOULD SHOW ON THE WEBSITE -->