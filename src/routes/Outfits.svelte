<script lang="ts">
    import {onMount} from "svelte";
    import {Button, Flex, Grid, Input, Modal, Text} from '@svelteuidev/core';
    import {MagnifyingGlass} from 'radix-icons-svelte';
    import type Outfits from "../dto/Outfits";
    import OutfitCard from "../component/OutfitCard.svelte";

    interface OutfitRequest {
        name: string,
        description: string,
        clothes: number[]
    }

    const url = 'http://10.90.136.54:5252/api/v1/outfits';
    let outfits: Outfits[] | [] = [];
    let error: string | null = null;
    let opened = false;

    let name = '';
    let description = '';
    let clothes: number[] | [] = [];
    let clothName = '';
    let clothDescription = '';
    let image_id: number
    let searchQuery = '';

    async function fetchOutfits(): Promise<Outfits[] | []> {
        try {
            const response = await fetch(url);
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
            clothes
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(outfitRequest),
            });
            console.log(JSON.stringify(outfitRequest));
        } catch (error) {
            console.error('Error: ', error);
        }
    }

    function addCloth() {

    }


    onMount(async () => {
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
<!--<Modal centered {opened} on:close={() => opened = false} title="Добавление аутфита"-->
<!--       overlayOpacity={0.55}-->
<!--       overlayBlur={3}-->
<!--&gt;-->
<!--    <form on:submit={(e) => { e.preventDefault(); sendOutfitRequest(); }}>-->
<!--        <Flex gap="md" direction="column">-->
<!--            <Text>Название:</Text>-->
<!--            <Input bind:value={name} required></Input>-->
<!--            <Text>Описание:</Text>-->
<!--            <Input bind:value={description} required></Input>-->
<!--            <Text>Добавить одежду:</Text>-->
<!--            <Flex gap="sm" direction="row">-->
<!--                <Input bind:value={clothName} placeholder="Найти по названию" required></Input>-->
<!--                <Button color=#deccb7 type="button" on:click={addCloth}>Добавить</Button>-->
<!--            </Flex>-->

<!--            <Text>Одежда:</Text>-->

<!--            <Button color=#deccb7 type="submit">Подтвердить</Button>-->
<!--        </Flex>-->
<!--    </form>-->
<!--</Modal>-->

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


