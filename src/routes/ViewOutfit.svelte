<script lang="ts">
    import {Alert, Button, Card, Group, Image, Loader, Text, Grid, Modal, Flex, Title} from '@svelteuidev/core';
    import { InfoCircled } from 'radix-icons-svelte';
    import { onMount } from "svelte";
    import type ImageDTO from "../dto/Image";
    import type Clothes from "../dto/Clothes";
    import type Outfits from "../dto/Outfits";
    export let params: [];

    const url = 'http://10.90.136.54:5252/api/v1';
    let image: ImageDTO | null = null;
    let error: string | null = null;
    let outfit: Outfits | null = null;
    let clothes: Clothes[] = [];
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

    async function fetchClothId(id: number): Promise<Clothes | null> {
        try {
            const response = await fetch(`${url}/clothes/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch cloth: ' + response.statusText);
            }
            return await response.json();
        } catch (err: any) {
            error = err.message;
            console.error('Fetch error:', err);
            return null;
        }
    }

    async function fetchOutfitId(id: number): Promise<Outfits | null> {
        try {
            const response = await fetch(`${url}/outfits/${params.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch outfit: ' + response.statusText);
            }
            return await response.json();
        } catch (err: any) {
            error = err.message;
            return null;
        }
    }

    async function fetchOutfit(id: number) {
        outfit = await fetchOutfitId(id);
        if (outfit) {
            image = await fetchImage(outfit.image_id);
        }
        const fetchedClothes = await Promise.all(clothes_ids.map(fetchClothId));
        clothes = fetchedClothes.filter(Boolean);
        for (const cloth of clothes) {
            fetchImage(cloth.image_id).then(img => {
                images = { ...images, [cloth.image_id]: img };
            });
        }
    }

    onMount(async () => {
        outfit = await fetchOutfit(fetchOutfitId(outfit_id));
        image = await fetchImage(outfit?.image_id!!);
    });
</script>

<Grid gutter={40}>
    <Grid.Col span={6} override={{minHeight: 400}}>
        {#if error}
            <Alert icon={InfoCircled} title="Something went wrong..." color="red">
                {error}
            </Alert>
        {:else if image}
            <Flex justify="center">
                <Image justify="center" width={460} height={400} fit='contain' src="{`data:image/png;base64,${image?.bytes}`}" alt="{image?.name}"></Image>
            </Flex>
        {:else}
            <Loader></Loader>
        {/if}
    </Grid.Col>
    <Grid.Col span={4}>
        <Flex direction="column" gap="xl">
            <Title order={1} align='center'>{outfit?.name}</Title>
            <Text size="xl">
                Описание: {outfit?.description}
            </Text>
        </Flex>
    </Grid.Col>
</Grid>