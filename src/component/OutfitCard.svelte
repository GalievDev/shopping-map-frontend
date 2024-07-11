<script lang="ts">
    import { Alert, Button, Card, Group, Image, Loader, Text, Grid, Modal, Flex } from '@svelteuidev/core';
    import { InfoCircled } from 'radix-icons-svelte';
    import { onMount } from "svelte";
    import type ImageDTO from "../dto/Image";
    import type Clothes from "../dto/Clothes";
    import type Outfits from "../dto/Outfits";

    export let outfit_id: number, image_id: number, name: string, description: string, clothes_ids: number[];

    const url = 'http://10.90.136.54:5252/api/v1';
    let image: ImageDTO | null = null;
    let error: string | null = null;
    let opened = false;
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
            const response = await fetch(`${url}/outfits/${id}`);
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
        opened = true;
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
        image = await fetchImage(image_id);
    });
</script>

<Card shadow='sm' padding='lg'>
    {#if error}
        <Alert icon={InfoCircled} title="Something went wrong..." color="red">
            {error}
        </Alert>
    {:else if image}
        <Flex justify="center">
            <Image justify="center" width={460} height={200} fit='contain' src={`data:image/png;base64,${image?.bytes}`} alt={image?.name}></Image>
        </Flex>
    {:else}
        <Loader></Loader>
    {/if}
    <Flex justify="center" direction="column" gap="md">

        <Group position='apart'>
            <Text weight={500}>{name}</Text>
        </Group>

        <Modal centered {opened} on:close={() => opened = false} title={outfit?.name}
               overlayOpacity={0.55}
               overlayBlur={3}>
            <Flex direction="column" gap="md">
                {#if image}
                    <Image src={`data:image/png;base64,${image?.bytes}`} alt={image?.name}></Image>
                {/if}
                <Text size='md'>
                    Описание: {description}
                </Text>
                <Text size='md'>
                    Набор одежды:
                </Text>
                {#each clothes as cloth}
                    <Card>
                        <Image src="{`data:image/png;base64,${images[cloth.image_id]?.bytes}`}"></Image>
                        <Text>
                            {cloth.name}
                        </Text>
                    </Card>
                {/each}
            </Flex>
        </Modal>

        <Grid>
            <Grid.Col span={6}>
                <Button color="#deccb7" on:click={async () => { await fetchOutfit(outfit_id) }} fullSize>
                    Показать информацию
                </Button>
            </Grid.Col>
        </Grid>
    </Flex>
</Card>