<script lang="ts">
    import { EnvelopeClosed } from 'radix-icons-svelte';
    import { Button, Flex, Grid, Input, Card, Image} from '@svelteuidev/core';
    import { MagnifyingGlass } from 'radix-icons-svelte';
    export let vertical_item_and_capslue = '130px'
    export let horizontal_item_and_capslue = '230px'
    export let vertical_outfit = '100px'
    export let horizontal_outfit = '110px'
</script>
<h1>Home page</h1>
<style>
    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr; /* Сетка из 3 колонок */
        gap: 50px; /* Пространство между элементами сетки */
        margin-top: 15px; /* Отступ сверху для сетки, чтобы отделить её от стека */
        margin-left: 60px;
    }
    .outfits{
        margin-left: 200px;
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
    <h1 class="grid">Outfuts</h1>
</Grid>
<div class="grid">
        <Button style="padding: {vertical_item_and_capslue} {horizontal_item_and_capslue};" color="gray" href="http://localhost:5173/#/clothes">
        Добавить предмет
    </Button>
        <Button style="padding: {vertical_outfit} {horizontal_outfit};" >
        1
    </Button>
        <Button style="padding: {vertical_outfit} {horizontal_outfit};">
            2
        </Button>
        <Button style="padding: {vertical_item_and_capslue} {horizontal_item_and_capslue};" color="gray" href="http://localhost:5173/#/capsules">
        Создать новую капсулу
    </Button>
        <Button style="padding: {vertical_outfit} {horizontal_outfit};">
        3
    </Button>
        <Button style="padding: {vertical_outfit} {horizontal_outfit};">
            4</Button>
</div>