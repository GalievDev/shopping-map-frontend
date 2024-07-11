<script lang="ts">
    import {onMount} from "svelte";
    import {Button, Checkbox, Flex, Grid, Input, Modal, Text} from '@svelteuidev/core';
    import {MagnifyingGlass} from 'radix-icons-svelte';
    import type Capsules from "../dto/Capsules";
    import CapsuleCard from "../component/CapsuleCard.svelte";
    import type Outfits from "../dto/Outfits";
    import type CapsuleRequest from "../dto/CapsuleRequest";

    const url = 'http://10.90.136.54:5252/api/v1';
    let capsules: Capsules[] | [] = [];
    let outfits: Outfits[] | [] = [];
    let error: string | null = null;
    let opened = false;

    let name = '';
    let description = '';
    let outfits_ids: Set<number> = new Set();
    let searchQuery = '';

    async function fetchCapsules(): Promise<Capsules[] | []> {
        try {
            const response = await fetch(`${url}/capsules`);
            if (!response.ok) {
                throw new Error('Failed to fetch capsules: ' + response.statusText);
            }
            return await response.json();
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

    async function sendCapsuleRequest() {
        const capsuleRequest: CapsuleRequest = {
            name,
            description,
            outfits: Array.from(outfits_ids)
        };

        try {
            const response = await fetch(`${url}/capsules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(capsuleRequest),
            });
            if (response.ok) {
                location.reload();
                opened = false;
            }
        } catch (error) {
            console.error('Error: ', error);
        }
    }

    function toggleSelection(clothId: number) {
        if (outfits_ids.has(clothId)) {
            outfits_ids.delete(clothId);
        } else {
            outfits_ids.add(clothId);
        }
    }

    onMount(async () => {
        outfits = await fetchOutfits();
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
    <Flex gap="md" direction="column">
        <Text>Название:</Text>
        <Input bind:value={name} required></Input>
        <Text>Описание:</Text>
        <Input bind:value={description} required></Input>
        <Text>Выберите образы для капсулы:</Text>
        {#each outfits as outfit}
            <Checkbox checked={false} label="{outfit.name}" on:change={() => toggleSelection(outfit.id)} />
        {/each}
        <Button color=#deccb7 type="submit" on:click={() => sendCapsuleRequest()}>Подтвердить</Button>
        </Flex>
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
            <CapsuleCard capsule_id="{capsule.id}" image_id="{capsule.image_id}" name={capsule.name} description={capsule.description} outfits_ids={capsule.outfits}></CapsuleCard>
        </Grid.Col>
    {/each}
</Grid>

