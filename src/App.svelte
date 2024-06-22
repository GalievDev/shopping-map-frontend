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

    let year = new Date().getFullYear();

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



<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="column">
                <p><a href="Информация">Информация</a></p>
            </div>
            <div class="column">
                <p><a href="Контактная информация">Контактная информация</a></p>
                <ul>
                    <li style="margin-top: 1rem;">
                        <a href="tel:+79887777777">+7(988) 777 77-77</a>
                    </li>
                    <li>
                        <a href="mailto:InnoStyle@mail.ru">InnoStyle@mail.ru</a>
                    </li>
                </ul>
            </div>
            <div class="column">
                <p><a href="Помошь">Помощь</a></p>
            </div>
            <div class="column">
                <p><a href="Партнеры">Партнеры</a></p>
            </div>
            <div class="column">
                <p><a href="О нас">О нас</a></p>
            </div>
        </div>
    </div>
</footer>

<style>
    main {
        padding-bottom: 5rem;
    }

    .footer {
        background-color: #f0f0f0;
        padding: 0.1rem 0;
        display: flex;
        align-items: stretch;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
    }

    .container {
        max-width: 1650px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    .footer-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        width: 100%;
    }

    .column {
        flex: 1;
        text-align: center;
        flex-direction: column;
        justify-content: center;
        padding: 2rem;
    }
    .column ul li {
        margin-bottom: 0.5rem;
    }

    .column ul li:last-child {
        margin-bottom: 0;
    }
</style>