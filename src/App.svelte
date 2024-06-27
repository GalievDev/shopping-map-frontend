<script lang="ts">
    import Router from "svelte-spa-router";
    import Home from "./routes/Home.svelte";
    import NotFound from "./routes/NotFound.svelte";
    import Clothes from "./routes/Clothes.svelte";
    import Outfits from "./routes/Outfits.svelte";
    import Capsules from "./routes/Capsules.svelte";
    import {Grid, SvelteUIProvider, Text} from '@svelteuidev/core';

    let routes = {
        "/": Home,
        "/clothes": Clothes,
        "/outfits": Outfits,
        "/capsules": Capsules,

        "*": NotFound
    }

</script>

<SvelteUIProvider>
    <Grid cols={36}>
        <Grid.Col span={12}>InnoStyle</Grid.Col>
        <Grid.Col span={6}>
            <Text
                    variant='link'
                    root='a'
                    size='md'
                    href="/#/"
                    color="black"
                    transform='uppercase'
            >
                Главная
            </Text>
        </Grid.Col>
        <Grid.Col span={6}>
            <Text
                    variant='link'
                    root='a'
                    size='md'
                    href="/#/clothes"
                    color="black"
                    transform='uppercase'
            >
                Одежда
            </Text>
        </Grid.Col>
        <Grid.Col span={6}>
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
        </Grid.Col>
        <Grid.Col span={6}>
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
        </Grid.Col>
    </Grid>



    <main>
        <Router {routes}></Router>
    </main>



    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="column">
                    <p>
                        <Text
                                variant='link'
                                root='a'
                                size='md'
                                href='https://something.com/'
                                color="white"
                        >
                            Информация
                        </Text>
                    </p>
                </div>
                <div class="column">
                    <p>
                        <Text
                                variant='link'
                                root='a'
                                size='md'
                                href='https://something.com/'
                                color="white"
                        >
                            Контактная информация
                        </Text>
                    </p>
                    <ul>
                        <li style="margin-top: 1rem;">
                            <Text
                                    variant='link'
                                    root='a'
                                    size='md'
                                    href='https://something.com/'
                                    color="white"
                            >
                                +7(988) 777-77-77
                            </Text>
                        </li>
                        <li>
                            <Text
                                    variant='link'
                                    root='a'
                                    size='md'
                                    href='https://something.com/'
                                    color="white"
                            >
                                InnoStyle@mail.ru
                            </Text>
                        </li>
                    </ul>
                </div>
                <div class="column">
                    <p>
                        <Text
                                variant='link'
                                root='a'
                                size='md'
                                href='https://something.com/'
                                color="white"
                        >
                            Помощь
                        </Text>
                    </p>
                </div>
                <div class="column">
                    <p>
                        <Text
                                variant='link'
                                root='a'
                                size='md'
                                href='https://something.com/'
                                color="white"
                        >
                            Партнеры
                        </Text>
                    </p>
                </div>
                <div class="column">
                    <p>
                        <Text
                                variant='link'
                                root='a'
                                size='md'
                                href='https://something.com/'
                                color="white"
                        >
                            О нас
                        </Text>
                    </p>
                </div>
            </div>
        </div>
    </footer>
</SvelteUIProvider>

<style>
    main {
        padding-bottom: 5rem;
    }

    .header {
        font-family: "Garamond", serif;
        margin-top: 27px;
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

    .footer {
        background-color: black;
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