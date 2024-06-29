<script lang="ts">
    import { Button, Flex, Grid, Input, Card, Image, BackgroundImage} from '@svelteuidev/core';
    import { MagnifyingGlass } from 'radix-icons-svelte';
    export let vertical_item_and_capslue = '130px'
    export let horizontal_item_and_capslue = '230px'
</script>
<h1>Главная</h1>
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
    <h1 class="grid">Аутфиты</h1>
</Grid>
<div class="grid">
    <Button style="padding: {vertical_item_and_capslue} {horizontal_item_and_capslue};" color="gray">
        Добавить предмет
    </Button>
    <Button style="padding: {vertical_outfit} {horizontal_outfit};" >
        1
    </Button>
    <Button style="padding: {vertical_outfit} {horizontal_outfit};">
        2
    </Button>
    <Button style="padding: {vertical_item_and_capslue} {horizontal_item_and_capslue};" color="gray">
        Создать новую капсулу
    </Button>
    <Button style="padding: {vertical_outfit} {horizontal_outfit};">
        3
    </Button>
    <Button style="padding: {vertical_outfit} {horizontal_outfit};">
        4</Button>
</div>
