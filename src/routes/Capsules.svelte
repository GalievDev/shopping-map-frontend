<script lang="ts">
    import {onMount} from "svelte";
    import {Alert, Button, Grid, Input, Loader} from '@svelteuidev/core';
    import {InfoCircled, MagnifyingGlass} from 'radix-icons-svelte';
    import type Capsules from "../dto/Capsules";
    import CapsuleCard from "../component/CapsuleCard.svelte";

    const url = 'http://10.90.136.54:5252/api/v1';
    let capsules: Capsules[] | [] = [];
    let error: string | null = null;
    let searchQuery = '';

    async function fetchCapsules(): Promise<Capsules[] | []> {
        try {
            const response = await fetch(`${url}/capsules`);
            if (!response.ok) {
                console.log('Failed to fetch capsules: ' + response.statusText);
            }
            return await response.json();
        } catch (err: any) {
            error = err.message;
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
        <Button href="/#/create_capsule" color=#deccb7 ripple radius="md" >Добавить капсулу</Button>
    </Grid.Col>
</Grid>

<Grid>
    {#each capsules as capsule (capsule.id)}
        <Grid.Col span={4}>
            {#if error}
                <Alert icon={InfoCircled} title="Something went wrong..." color="red">
                    {error}
                </Alert>
            {:else if capsule}
                <CapsuleCard capsule_id="{capsule.id}" image_id="{capsule.image_id}" name={capsule.name}></CapsuleCard>
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

