<script lang="ts">
    import Router from "svelte-spa-router";
    import NotFound from "./routes/NotFound.svelte";
    import Clothes from "./routes/Clothes.svelte";
    import Outfits from "./routes/Outfits.svelte";
    import Capsules from "./routes/Capsules.svelte";
    import {Grid, SvelteUIProvider, Text} from '@svelteuidev/core';
    import CreateCloth from "./routes/CreateCloth.svelte";
    import CreateOutfit from "./routes/CreateOutfit.svelte";
    import CreateCapsule from "./routes/CreateCapsule.svelte";

    let routes = {
        "/": Clothes,
        "/create_cloth": CreateCloth,
        "/outfits": Outfits,
        "/create_outfit": CreateOutfit,
        "/capsules": Capsules,
        "/create_capsule": CreateCapsule,

        "*": NotFound
    }

</script>

<SvelteUIProvider>
    <div class="header">
            <Grid cols={36}>
        <Grid.Col span={12}><div class="name">InnoStyle</div></Grid.Col>
        <Grid.Col span={6}>
            <div class="navi">
                <Text
                    variant='link'
                    root='a'
                    size='md'
                    href="/#/"
                    color="black"
                    transform='uppercase'
                    >
                    Одежда
                </Text>
            </div>
        </Grid.Col>
        <Grid.Col span={6}>
            <div class="navi">
            <Text
                    variant='link'
                    root='a'
                    size='md'
                    href="/#/outfits"
                    color="black"
                    transform='uppercase'
            >
                Аутфиты
            </Text>
            </div>
        </Grid.Col>
        <Grid.Col span={6}>
            <div class="navi">
            <Text
                    variant='link'
                    root='a'
                    size='md'
                    href="/#/capsules"
                    color="black"
                    transform='uppercase'
            >
                Капсулы
            </Text>
            </div>
        </Grid.Col>
    </Grid>
    </div>


    <main>
        <Router {routes}></Router>
    </main>

</SvelteUIProvider>


<style>
    main {
        padding-bottom: 5rem;
    }

    .header {
        font-family: "Garamond", serif;
        margin-top: 30px;
        margin-bottom: 35px;
    }

    .name {
        margin-left: 60px;
        font-size: 50px;
        font-weight: 549.9;
    }

    .navi {
        margin-top: 24px;
    }

    .column ul li {
        margin-bottom: 0.5rem;
    }

    .column ul li:last-child {
        margin-bottom: 0;
    }
</style>