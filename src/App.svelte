<script lang="ts">
    import Router from "svelte-spa-router";
    import Home from "./routes/Home.svelte";
    import NotFound from "./routes/NotFound.svelte";
    import Clothes from "./routes/Clothes.svelte";
    import Outfits from "./routes/Outfits.svelte";
    import Capsules from "./routes/Capsules.svelte";
    import { createStyles, Tabs } from '@svelteuidev/core';
    import { Grid } from '@svelteuidev/core';
    import { Badge, Input } from '@svelteuidev/core';
    import { MagnifyingGlass } from 'radix-icons-svelte';



    let routes = {
        "/": Home,
        "/clothes": Clothes,
        "/outfits": Outfits,
        "/capsules": Capsules,

        "*": NotFound
    }

</script>

<Grid cols={36}>
    <Grid.Col span={12}>InnoStyle</Grid.Col>
    <Grid.Col span={6}><a href="/#/">Home</a></Grid.Col>
    <Grid.Col span={6}><a href="/#/clothes">Clothes</a></Grid.Col>
    <Grid.Col span={6}><a href="/#/outfits">Outfits</a></Grid.Col>
    <Grid.Col span={6}><a href="/#/capsules">Capsules</a></Grid.Col>
</Grid>



<main>
    <Router {routes}></Router>
</main>
