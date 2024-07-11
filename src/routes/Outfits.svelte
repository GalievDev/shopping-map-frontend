<script lang="ts">
    import {onMount} from "svelte";
    import {Button, Checkbox, Flex, Grid, Input, Modal, Text} from '@svelteuidev/core';
    import {MagnifyingGlass} from 'radix-icons-svelte';
    import type Outfits from "../dto/Outfits";
    import OutfitCard from "../component/OutfitCard.svelte";
    import type Clothes from "../dto/Clothes";
    import type {OutfitRequest} from "../dto/OutfitRequest";

    const url = 'http://10.90.136.54:5252/api/v1';
    let clothes: Clothes[] | [] = [];
    let outfits: Outfits[] | [] = [];
    let error: string | null = null;
    let opened = false;

    let name = '';
    let description = '';
    let clothes_ids: Set<number> = new Set();
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

    async function sendOutfitRequest() {
        const outfitRequest: OutfitRequest = {
            name,
            description,
            clothes: Array.from(clothes_ids)
        };
        try {
            const response = await fetch(`${url}/outfits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(outfitRequest),
            });
            if (response.ok) {
                location.reload();
                opened = false;
            }
        } catch (error) {
            console.error('Error: ', error);
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

    function toggleSelection(clothId: number) {
        if (clothes_ids.has(clothId)) {
            clothes_ids.delete(clothId);
        } else {
            clothes_ids.add(clothId);
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
<Modal centered {opened} on:close={() => opened = false} title="Добавление аутфита"
       overlayOpacity={0.55}
       overlayBlur={3}
>
    <Flex gap="md" direction="column">
        <Text>Название:</Text>
        <Input bind:value={name} required></Input>
        <Text>Описание:</Text>
        <Input bind:value={description} required></Input>

        <Text>Выберите одежду в образ: </Text>
        {#each clothes as cloth}
            <Checkbox checked={false} label="{cloth.name}" on:change={() => toggleSelection(cloth.id)} />
        {/each}
        <Button color=#deccb7 on:click={() => sendOutfitRequest()}>Подтвердить</Button>
    </Flex>
</Modal>

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
        <Button on:click={() => (opened = true)} color=#deccb7 ripple radius="md" >Добавить аутфит</Button>
    </Grid.Col>
</Grid>

<Grid>
    {#each outfits as outfit (outfit.id)}
        <Grid.Col span={4}>
            <OutfitCard outfit_id="{outfit.id}" image_id="{outfit.image_id}" name="{outfit.name}" description={outfit.description} clothes_ids={outfit.clothes}></OutfitCard>
        </Grid.Col>
    {/each}
</Grid>


