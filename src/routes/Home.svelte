<script lang="ts">
    import { EnvelopeClosed } from 'radix-icons-svelte';
    import { Button, Flex, Grid, Input, SimpleGrid } from '@svelteuidev/core';
    import { MagnifyingGlass } from 'radix-icons-svelte';
    import {  AspectRatio, Image } from '@svelteuidev/core';
    export let vertical_item_and_capslue = '130px'
    export let horizontal_item_and_capslue = '230px'
    export let vertical_outfit = '70px'
    export let horizontal_outfit = '85px'
    function navigate_clothes(){
        window.location.href = 'http://localhost:5173/#/clothes';
    }
    function navigate_capsule(){
        window.location.href = 'http://localhost:5173/#/capsules';
    }
</script>
<h1>Home page</h1>
<!-- MyLayout.svelte -->
<style>
    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr; /* Сетка из 3 колонок */
        gap: 100px; /* Пространство между элементами сетки */
        margin-top: 60px; /* Отступ сверху для сетки, чтобы отделить её от стека */
    }
</style>


<div class="grid">
        <Button style="padding: {vertical_item_and_capslue} {horizontal_item_and_capslue};" color="gray" on:click={navigate_clothes}>
        Добавить предмет
    </Button>
        <Button style="padding: {vertical_outfit} {horizontal_outfit};">
        1
    </Button>
        <Button style="padding: {vertical_outfit} {horizontal_outfit};">
            2
        </Button>

        <Button style="padding: {vertical_item_and_capslue} {horizontal_item_and_capslue};" color="gray" on:click={navigate_capsule}>
        Создать новую капсулу
    </Button>
        <Button style="padding: {vertical_outfit} {horizontal_outfit};">
        3
    </Button>

        <Button style="padding: {vertical_outfit} {horizontal_outfit};">
            4</Button>
</div>

<Grid>
    <Grid.Col span={5} offset={0.7}>
        <Input color="gray"
                icon={MagnifyingGlass}
                placeholder='Поиск...'
                rightSectionWidth={70}
                styles={{ rightSection: { pointerEvents: 'none' } }}>
        </Input>
    </Grid.Col>
</Grid>
<SimpleGrid cols = {3}>










</SimpleGrid>