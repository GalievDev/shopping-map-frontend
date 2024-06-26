<script lang="ts">
    import {Alert, Button, Card, Group, Image, Loader, Text, Grid, Modal, Flex} from '@svelteuidev/core';
    import { InfoCircled } from 'radix-icons-svelte';
    import { onMount } from "svelte";
    import type ImageDTO from "../dto/Image";
    import type Capsules from "../dto/Capsules";
    import type Outfits from "../dto/Outfits";

    export let id: number, image_id: number, name: string, description: string, outfits_ids: number[];

    const url = 'http://10.90.136.54:5252/api/v1'
    let image: ImageDTO | null = null;
    let error: string | null = null;
    let opened = false;
    let capsule: Capsules | null = null;
    let outfits: Outfits[] = []

    async function fetchImage(id: number): Promise<ImageDTO | null> {
        try {
            const response = await fetch(`${url}/images/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch image: ' + response.statusText);
            }
            return await response.json();
        } catch (err: any) {
            error = err.message;
            return null;
        }
    }

    async function fetchOutfit(id: number): Promise<Outfits | null> {
        try {
            const response = await fetch(`${url}/outfits/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch outfit: ' + response.statusText);
            }
            return await response.json();
        } catch (err: any) {
            error = err.message;
            console.error('Fetch error:', err);
            return null;
        }
    }

    function onClose() {
        opened = false;
        outfits = []
    }

    onMount(async () => {
        image = await fetchImage(image_id);
    });
</script>

<Card shadow='sm' padding='lg'>
    {#if error}
        <Alert icon={InfoCircled} title="Something went wrong..." color="red">
            {error}
        </Alert>
    {:else if image}
        <Image justify="center" width={460} height={200} fit='contain' src="{`data:image/png;base64,${image?.bytes}`}" alt="{image?.name}"></Image>
    {:else}
        <Loader></Loader>
    {/if}
    <Flex justify="center" direction="column" gap="md">

        <Group position='apart'>
            <Text weight={500}>{name}</Text>
        </Group>

        <Modal centered {opened} on:close={() => onClose()} title={capsule?.name}
               overlayOpacity={0.55}
               overlayBlur={3}>
            <Flex direction="column" gap="md">
                <Image src="{`data:image/png;base64,${image?.bytes}`}" alt="{image?.name}"></Image>
                <Text size='md'>
                    Описание: {description}
                </Text>
                {#each outfits as outfit}
                    <Card>
                        <Text>
                            {outfit.name}
                        </Text>
                    </Card>
                {/each}
            </Flex>
        </Modal>

        <Grid>
            <Grid.Col span={6}>
                <Button color=#deccb7 on:click={async () => { await fetchOutfit(id) }} fullSize>
                    Показать информацию
                </Button>
            </Grid.Col>
        </Grid>
    </Flex>
</Card>