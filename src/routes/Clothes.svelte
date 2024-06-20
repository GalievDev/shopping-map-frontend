<script lang="ts">
    import { onMount } from "svelte";
    import ClothCard from "../component/ClothCard.svelte";
    import {Button, Flex, Grid, Input, Modal, SvelteUIProvider} from '@svelteuidev/core';
    import { MagnifyingGlass } from 'radix-icons-svelte';

    let clothes: any = []
    let opened = false;

    onMount(async () => {
        const response = await fetch('https://e2484b7d-baa7-4b5f-a860-cf269e3bb116.mock.pstmn.io/api/v1/clothes')
        clothes = await response.json()
    })

    function sortAlphabetically() {
        clothes.sort((a: any, b: any) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
    }

    function close() {
        opened = false;
    }
</script>

<SvelteUIProvider>

    <h1>Одежда</h1>
    <Modal {opened} on:close={close} title="Добавление одежды">
        bebra
    </Modal>

    <Grid>
        <Grid.Col span={1} offset={2}>
            <Input
                    icon={MagnifyingGlass}
                    placeholder='Поиск'
                    rightSectionWidth={70}
                    styles={{ rightSection: { pointerEvents: 'none' } }}
            >
            </Input>
        </Grid.Col>

        <Grid.Col span={1} offset={2.5}>
            <Button color="yellow" ripple radius="md" on:click={sortAlphabetically}>Сортировка</Button>
        </Grid.Col>
        <Grid.Col span={1} offset={2.5}>
            <Button on:click={() => (opened = true)} color="yellow" ripple radius="md" >Добавить одежду</Button>
        </Grid.Col>
    </Grid>

    <Flex justify="center" gap="lg">
        {#each clothes as cloth (cloth.id)}
            <ClothCard image_id="{cloth.image_id}" name="{cloth.name}" link="{cloth.link}" description="{cloth.description}"></ClothCard>
        {/each}
    </Flex>
</SvelteUIProvider>