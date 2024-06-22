<script lang="ts">
    import Router from "svelte-spa-router";
    import Home from "./routes/Home.svelte";
    import NotFound from "./routes/NotFound.svelte";
    import Clothes from "./routes/Clothes.svelte";
    import Outfits from "./routes/Outfits.svelte";
    import Capsules from "./routes/Capsules.svelte";
    import {SvelteUIProvider} from "@svelteuidev/core";

    let routes = {
        "/": Home,
        "/clothes": Clothes,
        "/outfits": Outfits,
        "/capsules": Capsules,

        "*": NotFound
    }
</script>
<SvelteUIProvider>
    <nav>
        <a href="/#/">Home</a>
        <a href="/#/clothes">Clothes</a>
        <a href="/#/outfits">Outfits</a>
        <a href="/#/capsules">Capsules</a>
    </nav>

    <main>
        <Router {routes}></Router>
    </main>
</SvelteUIProvider>

