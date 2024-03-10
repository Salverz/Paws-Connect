<script>
    import AccountCreationForm from "./components/AccountCreationForm.svelte"
</script>

<a href="/account/edit">Edit an existing account</a>
<br>
<br>

<h1>Create a new account</h1>
<div class="login-box">
    <AccountCreationForm/>
</div>

<style>
    /* Flexbox */
    .login-box {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>

<!-- TYPE "npm run dev" IN THE CONSOLE TO RUN THE WEBSITE -->
<!-- WHEN YOU SAVE A FILE, YOUR CHANGES SHOULD SHOW ON THE WEBSITE -->