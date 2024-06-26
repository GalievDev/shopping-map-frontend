<script lang="ts">
    import { Button, Flex, Grid, Input, Card, Image, BackgroundImage} from '@svelteuidev/core';
    import { MagnifyingGlass } from 'radix-icons-svelte';
    export let vertical_item_and_capslue = '130px'
    export let horizontal_item_and_capslue = '230px'
</script>
<h1>Home page</h1>
<style>
    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr; /* Сетка из 3 колонок */
        gap: 50px; /* Пространство между элементами сетки */
        margin-top: 25px; /* Отступ сверху для сетки, чтобы отделить её от стека */
        margin-left: 42px;
    }
    .backgroundImage_add_item{
        background-image: url('../assets/85739d14c2689fa506bf7319efd6ae3a.jpg');
        background-size: cover;
        border-radius: 12px;
        outline: none;
        border: none;

    }
    .backgroundImage_create_new_capsule{
        background-image: url('../assets/kofe-chashka-kniga-zhurnal.jpg');
        background-size: cover;
        border-radius: 12px;
        outline: none;
        border: none;
    }
    .custom_button{
        box-shadow: 0 5px 20px rgba(0,0,0,0.4);
        color: white;
        font-size: 20px;

    }
</style>
<Grid span={10}>
    <Grid.Col span={5} offset={0.5}>
        <Input color="red"
               icon={MagnifyingGlass}
               placeholder='Поиск...'
               rightSectionWidth={70}
               styles={{ rightSection: { pointerEvents: 'none' } }}>
        </Input>
    </Grid.Col>
</Grid>
<div class="grid">
        <button class="backgroundImage_add_item custom_button" style="padding: {vertical_item_and_capslue} {horizontal_item_and_capslue};">
            Добавить предмет
        </button>
        <button class="backgroundImage_create_new_capsule custom_button" style="padding: {vertical_item_and_capslue} {horizontal_item_and_capslue};">
            Создать новую капсулу
        </button>
</div>
