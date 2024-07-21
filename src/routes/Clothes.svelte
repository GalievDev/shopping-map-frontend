<script lang="ts">
    import { onMount } from "svelte";
    import ClothCard from "../component/ClothCard.svelte";
    import type Clothes from "../dto/Clothes";
    import {Alert, Button, Grid, Input, Loader} from '@svelteuidev/core';
    import {InfoCircled, MagnifyingGlass} from 'radix-icons-svelte';

    let clothes: Clothes[] | [] = [];

    const url = 'http://51.250.36.103:5252/api/v1/clothes';
    let error: string | null = null;
    let searchQuery = '';

    async function fetchClothes(): Promise<Clothes[] | []> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.log('Failed to fetch image: ' + response.statusText);
            }
            return await response.json();
        } catch (err: any) {
            error = err.message;
            return [];
        }
    }

    onMount(async () => {
        clothes = await fetchClothes();
    });

    function sortAlphabetically() {
        clothes.sort((a: any, b: any) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
    }

    async function searchClothes() {
        if (searchQuery === '') {
            clothes = await fetchClothes();
        } else {
            clothes = await fetchClothes().then(allClothes => {
                return allClothes.filter(cloth => {
                    return cloth.name.toLowerCase().includes(searchQuery.toLowerCase());
                });
            });
        }
    }

</script>

<h1>Каталог одежды</h1>

<Grid>
    <Grid.Col span={1} offset={2}>
        <Button color=#deccb7 ripple radius="md" on:click={sortAlphabetically}>Сортировка</Button>
    </Grid.Col>


    <Grid.Col span={2} offset={2}>
        <Input
                bind:value={searchQuery}
                on:input={searchClothes}
                icon={MagnifyingGlass}
                placeholder='Поиск'
                rightSectionWidth={70}
                styles={{ rightSection: { pointerEvents: 'none' } }}
        >
        </Input>
    </Grid.Col>
    <Grid.Col span={1} offset={2}>
        <Button href="/#/create_cloth" color=#deccb7 ripple radius="md" >Добавить одежду</Button>
    </Grid.Col>
</Grid>
<Grid>
    {#each clothes as cloth (cloth.id)}
        <Grid.Col span={4}>
            {#if error}
                <Alert icon={InfoCircled} title="Something went wrong..." color="red">
                    {error}
                </Alert>
            {:else if cloth}
                <ClothCard cloth_id="{cloth.id}" image_id="{cloth.image_id}" name="{cloth.name}" link="{cloth.link}"></ClothCard>
            {:else}
                <Loader></Loader>
            {/if}
        </Grid.Col>
    {/each}
</Grid>

<style>
    h1 {
        font-family: "Garamond", serif;
        margin-top: 50px;
        margin-bottom: 30px;
        margin-left: 60px;
    }
</style>