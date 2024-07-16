<script lang="ts">
    import {Alert, Button, Card, Group, Image, Loader, Text, Grid, Modal, Flex} from '@svelteuidev/core';
    import { InfoCircled } from 'radix-icons-svelte';
    import { onMount } from "svelte";
    import type ImageDTO from "../dto/Image";
    import type Capsules from "../dto/Capsules";
    import type Outfits from "../dto/Outfits";

    export let capsule_id: number, image_id: number, name: string, description: string, outfits_ids: number[];

    const url = 'http://10.90.136.54:5252/api/v1'
    let image: ImageDTO | null = null;
    let error: string | null = null;
    let capsule: Capsules | null = null;
    let outfits: Outfits[] = []
    let images: Record<number, ImageDTO | null> = {};

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

    async function fetchCapsuleId(id: number): Promise<Capsules | null> {
        try {
            const response = await fetch(`${url}/capsules/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch capsule: ' + response.statusText);
            }
            return await response.json();
        } catch (err: any) {
            error = err.message;
            return null;
        }
    }

    async function fetchCapsule(id: number) {
        capsule = await fetchCapsuleId(id);
        if (capsule) {
            image = await fetchImage(capsule.image_id);
        }
        const fetchedOutfits = await Promise.all(outfits_ids.map(fetchOutfit));
        outfits = fetchedOutfits.filter(Boolean);
        for (const outfit of outfits) {
            fetchImage(outfit.image_id).then(img => {
                images = { ...images, [outfit.image_id]: img };
            });
        }
    }

    onMount(async () => {
        capsule = await fetchCapsule();
        image = await fetchImage(capsule?.image_id!!);
    });
</script>

<Grid gutter={40}>
    <Grid.Col span={4}>
    {#if error}
        <Alert icon={InfoCircled} title="Something went wrong..." color="red">
            {error}
        </Alert>
    {:else if image}
        <Flex justify="center">
            <Image justify="center" width={460} height={200} fit='contain' src="{`data:image/png;base64,${image?.bytes}`}" alt="{image?.name}"></Image>
        </Flex>
    {:else}
        <Loader></Loader>
    {/if}
    </Grid.Col>

    <Grid.Col span={4}>
        <Text size="xl">
            Название:
        </Text>
        <Text size="md">
            { capsule?.name }
        </Text>
    </Grid.Col>
    <Grid.Col span={4}>
        <Flex direction="column" gap="md">
                <Image src="{`data:image/png;base64,${image?.bytes}`}" alt="{image?.name}"></Image>
                <Text size='xl'>
                    Описание:
                </Text>
                <Text sime='md'>
                     {capsule?.description}
                </Text>
                <Text size='xl'>
                    Набор аутфитов:
                </Text>
                {#each outfits as outfit}
                    <Card>
                        <Image src="{`data:image/png;base64,${images[outfit.image_id]?.bytes}`}"></Image>
                        <Text size='md'>
                            {outfit.name}
                        </Text>
                    </Card>
                {/each}
        </Flex>
    </Grid.Col>
</Grid>