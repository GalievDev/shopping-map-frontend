<script lang="ts">
    import {onMount} from "svelte";
    import ClothCard from "../component/ClothCard.svelte";
    import type Outfits from "../dto/Outfits";
    import type OutfitRequest from "../dto/OutfitRequest";
    import {ClothType} from "../dto/ClothType";
    import {Button, Flex, Grid, Input, Modal, Text} from '@svelteuidev/core';
    import { MagnifyingGlass } from 'radix-icons-svelte';
    import Clothes from "./Clothes.svelte";

    let outfits: Outfits[] | [] = []
    let opened = false;

    const url = 'http://10.90.136.54:5252/api/v1/outfits'
    let error: string | null = null
    let name = '';
    let description = '';
    let image = '';
    let clothes = Array;
    let searchQuery = '';


    async function fetchOutfits(): Promise<Outfits[] | []> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch image: ' + response.statusText);
            }
            return await response.json();
        } catch (err: any) {
            error = err.message;
            return [];
        }
    }

    async function sendOutfitRequest() {
        const outfitRequest: OutfitRequest = {
            name,
            description,
            clothes,
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(outfitRequest),
            });
            console.log(JSON.stringify(outfitRequest))
        } catch (error) {
            console.error('Error: ', error)
        }

    }

    function handleFileChange(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                image = (reader.result as string).split(',')[1]; // Remove the data URL prefix
            };
            reader.readAsDataURL(file);
        }
    }


    onMount(async () => {
        outfits = await fetchOutfits()
    })


    function sortAlphabetically() {
        outfits.sort((a: any, b: any) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
    }

    function close() {
        opened = false;
    }

    async function searchClothes() {
        if (searchQuery === '') {
            // If search query is empty, show all clothes
            outfits = await fetchOutfits();
        } else {
            // Filter clothes based on search query
            outfits = await fetchOutfits().then(allOutfits => {
                return allOutfits.filter(outfit => {
                    return outfit.name.toLowerCase().includes(searchQuery.toLowerCase());
                });
            });
        }
    }
</script>

<h1>Аутфиты</h1>
<Modal centered {opened} on:close={() => opened = false} title="Добавление аутфита"
       overlayOpacity={0.55}
       overlayBlur={3}
>
    <form on:submit={() => sendOutfitRequest()}>
        <Flex gap="md" direction="column">
            <Text>Название:</Text>
            <Input bind:value={name} required></Input>
            <Text>Описание:</Text>
            <Input bind:value={description} required></Input>
            <Text>Выберите одежду:</Text>
            <Input root="button">Button input</Input>
            <Input root="select">
                {#each Object.values(Clothes) as clothes}
                    <option value={clothes}>{clothes}</option>
                {/each}
            </Input>
        </Flex>
    </form>
</Modal>


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
        <Button on:click={() => (opened = true)} color=#deccb7 ripple radius="md" >Добавить аутфит</Button>
    </Grid.Col>
</Grid>
<Grid>
    {#each outfits as cloth (cloth.id)}
        <Grid.Col span={4}>
            <ClothCard cloth_id="{cloth.id}" image_id="{cloth.image_id}" name="{cloth.name}" link="{cloth.link}" description="{cloth.description}"></ClothCard>
        </Grid.Col>
    {/each}
</Grid>
