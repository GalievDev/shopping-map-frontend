<script lang="ts">
    import {onMount} from "svelte";
    import {Button, Checkbox, Flex, Grid, Input, Modal, Text} from '@svelteuidev/core';
    import {MagnifyingGlass} from 'radix-icons-svelte';
    import type Outfits from "../dto/Outfits";
    import OutfitCard from "../component/OutfitCard.svelte";
    import type Clothes from "../dto/Clothes";

    const url = 'http://51.250.36.103:5252/api/v1';
    let clothes: Clothes[] | [] = [];
    let outfits: Outfits[] | [] = [];
    let error: string | null = null;

    let name = '';
    let description = '';
    let searchQuery = '';

    async function fetchOutfits(): Promise<Outfits[] | []> {
        try {
            const response = await fetch(`${url}/outfits`);
            if (!response.ok) {
                throw new Error('Failed to fetch outfits: ' + response.statusText);
            }
            return await response.json();
        } catch (err: any) {
            error = err.message;
            console.error('Fetch error:', err);
            return [];
        }
    }

    async function searchOutfits() {
        if (searchQuery === '') {
            outfits = await fetchOutfits();
        } else {
            outfits = await fetchOutfits().then(allOutfits => {
                return allOutfits.filter(outfit => {
                    return outfit.name.toLowerCase().includes(searchQuery.toLowerCase());
                });
            });
        }
    }

    async function fetchClothes(): Promise<Clothes[] | []> {
        try {
            const response = await fetch(`${url}/clothes`);
            if (!response.ok) {
                throw new Error('Failed to fetch image: ' + response.statusText);
            }
            return await response.json();
        } catch (err: any) {
            error = err.message;
            return [];
        }
    }

    onMount(async () => {
        clothes = await fetchClothes();
        outfits = await fetchOutfits();
    });

    function sortAlphabetically() {
        outfits.sort((a: Outfits, b: Outfits) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
    }
</script>

<h1>Каталог аутфитов</h1>

<Grid>
    <Grid.Col span={1} offset={2}>
        <Button color=#deccb7 ripple radius="md" on:click={sortAlphabetically}>Сортировка</Button>
    </Grid.Col>

    <Grid.Col span={2} offset={2}>
        <Input
                bind:value={searchQuery}
                on:input={searchOutfits()}
                icon={MagnifyingGlass}
                placeholder='Поиск'
                rightSectionWidth={70}
                styles={{ rightSection: { pointerEvents: 'none' } }}
        >
        </Input>
    </Grid.Col>
    <Grid.Col span={1} offset={2}>
        <Button href="/#/create_outfit" color=#deccb7 ripple radius="md" >Добавить аутфит</Button>
    </Grid.Col>
</Grid>

<Grid>
    {#each outfits as outfit (outfit.id)}
        <Grid.Col span={4}>
            <OutfitCard outfit_id="{outfit.id}" image_id="{outfit.image_id}" name="{outfit.name}" description={outfit.description} clothes_ids={outfit.clothes}></OutfitCard>
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
