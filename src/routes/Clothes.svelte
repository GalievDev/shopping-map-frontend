<script lang="ts">
    import { onMount } from "svelte";
    import ClothCard from "../component/ClothCard.svelte";
    import { Button, Flex, Grid, Input } from '@svelteuidev/core';
    import { MagnifyingGlass } from 'radix-icons-svelte';

    let clothes: any = []

    onMount(async () => {
        const response = await fetch('https://e2484b7d-baa7-4b5f-a860-cf269e3bb116.mock.pstmn.io/api/v1/clothes')
        clothes = await response.json()
    })

    function sortAlphabetically() {
        let sortedClothes: any = [];
        sortedClothes.sort((a: any, b: any) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
    }

</script>

<h1>Clothes</h1>
<Grid>
    <Grid.Col span={3} offset={2}>
        <Input
                icon={MagnifyingGlass}
                placeholder='Search'
                rightSectionWidth={70}
                styles={{ rightSection: { pointerEvents: 'none' } }}
        >
        </Input>
    </Grid.Col>

    <Grid.Col span={3} offset={3}>
        <Button color="yellow" ripple radius="md" on:click={sortAlphabetically()}>Сортировка</Button>
    </Grid.Col>
</Grid>

<Flex justify="center" gap="lg">
    {#each clothes as cloth (cloth.id)}
        <ClothCard image_id="{cloth.image_id}" name="{cloth.name}" link="{cloth.link}" description="{cloth.description}"></ClothCard>
    {/each}
</Flex>

