<script lang="ts">
    import { onMount } from "svelte";
    import ClothCard from "../component/ClothCard.svelte";
    import { Button, Flex, Grid, Input, Modal, Text } from '@svelteuidev/core';
    import { MagnifyingGlass } from 'radix-icons-svelte';
    import type Capsules from "../dto/Capsules";
    import type CapsuleRequest from "../dto/CapsuleRequest";

    const url = 'http://10.90.136.54:5252/api/v1/capsules';
    let capsules: Capsules[] | [] = [];
    let error: string | null = null;
    let opened = false;

    let name = '';
    let description = '';
    let outfits: number[] | [] = [];
    let outfitName = '';
    let outfitDescription = '';
    let image_id: number
    let searchQuery = '';

    async function fetchCapsules(): Promise<Capsules[] | []> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch capsules: ' + response.statusText);
            }
            const data = await response.json();
            console.log('Fetched capsules:', data);
            return data;
        } catch (err: any) {
            error = err.message;
            console.error('Fetch error:', err);
            return [];
        }
    }

    async function searchCapsules() {
        if (searchQuery === '') {
            capsules = await fetchCapsules();
        } else {
            capsules = await fetchCapsules().then(allCapsules => {
                return allCapsules.filter(capsule => {
                    return capsule.name.toLowerCase().includes(searchQuery.toLowerCase());
                });
            });
        }
    }

    async function sendCapsuleRequest() {
        const capsuleRequest: CapsuleRequest = {
            name,
            description,
            outfits
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(capsuleRequest),
            });
            console.log(JSON.stringify(capsuleRequest));
        } catch (error) {
            console.error('Error: ', error);
        }
    }

    function addOutfit() {

    }


    onMount(async () => {
        capsules = await fetchCapsules();
    });

    function sortAlphabetically() {
        capsules.sort((a: Capsules, b: Capsules) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
    }
</script>

<h1>Каталог капсул</h1>
<Modal centered {opened} on:close={() => opened = false} title="Добавление капсулы"
       overlayOpacity={0.55}
       overlayBlur={3}
>
    <form on:submit={(e) => { e.preventDefault(); sendCapsuleRequest(); }}>
        <Flex gap="md" direction="column">
            <Text>Название:</Text>
            <Input bind:value={name} required></Input>
            <Text>Описание:</Text>
            <Input bind:value={description} required></Input>
            <Text>Добавить аутфиты:</Text>
            <Flex gap="sm" direction="row">
                <Input bind:value={outfitName} placeholder="Название" required></Input>
                <Input bind:value={outfitDescription} placeholder="Описание" required></Input>
                <Button type="button" on:click={addOutfit}>Добавить</Button>
            </Flex>

            <Text>Аутфиты:</Text>
            <ul>
                {#each outfits as outfit}
                    <li>{outfit.name}: {outfit.description}</li>
                {/each}
            </ul>

            <Button color=#deccb7 type="submit">Подтвердить</Button>
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
                on:input={searchCapsules}
                icon={MagnifyingGlass}
                placeholder='Поиск'
                rightSectionWidth={70}
                styles={{ rightSection: { pointerEvents: 'none' } }}
        >
        </Input>
    </Grid.Col>
    <Grid.Col span={1} offset={2}>
        <Button on:click={() => (opened = true)} color=#deccb7 ripple radius="md" >Добавить капсулу</Button>
    </Grid.Col>
</Grid>

<Grid>
    {#each capsules as capsule (capsule.id)}
        <Grid.Col span={4}>
            <ClothCard name={capsule.name} description={capsule.description} outfits={capsule.outfits}></ClothCard>
        </Grid.Col>
    {/each}
</Grid>

