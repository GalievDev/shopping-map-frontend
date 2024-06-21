<script lang="ts">
    import {Alert, Button, Card, Group, Image, Loader, Modal, Text} from '@svelteuidev/core';
    import { InfoCircled } from 'radix-icons-svelte';
    import { onMount } from "svelte";
    import type ImageDTO from "../dto/Image";
    import type Clothes from "../dto/Clothes";

    export let cloth_id: number, image_id: number, name: string, link: string, description: string;

    let opened = false;
    let image: ImageDTO | null = null;
    let cloth: Clothes | null = null;
    let error: string | null = null;

    async function fetchImage(id: number): Promise<ImageDTO | null> {
        try {
            const response = await fetch(`http://0.0.0.0:8080/api/v1/images/${id}`);
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
            const response = await fetch(`http://0.0.0.0:8080/api/v1/clothes/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch image: ' + response.statusText);
            }
            return await response.json();
        } catch (err: any) {
            error = err.message;
            return null;
        }
    }

    async function fetchCloth(id: number) {
        opened = true;
        cloth = await fetchClothId(id);
        image = await fetchImage(cloth?.id!!)
    }

    onMount(async () => {
        image = await fetchImage(image_id);
    });
</script>
<Card shadow='sm' padding='lg'>
    {#if error}
        <Alert icon={InfoCircled}  title="Oopsie!" color="red">
            {error}
        </Alert>
    {:else if image}
        <Card.Section first padding='lg'>
            <Image src={`data:image/png;base64,${image.bytes}`} height={160} alt={image.name} id="img"/>
        </Card.Section>
    {:else}
        <Loader />
    {/if}

    <Group position='apart'>
        <Text weight={500}>{name}</Text>
    </Group>

    <Text size='sm'>
        {description}
    </Text>

    <Modal centered {opened} on:close={() => opened = false} title="{cloth?.name}"
           overlayOpacity={0.55}
           overlayBlur={3}
    >
        <Image src="{`data:image/png;base64,${image?.bytes}`}" alt="{image?.name}"></Image>
        <Text size="xl">
            <p> Description: {cloth?.description} </p>
            <p> Type: {cloth?.type.toString()} </p>
            <p> Link: <a href="{cloth?.link}">{cloth?.link}</a> </p>
        </Text>
    </Modal>
    <Button variant='light' color='blue' on:click={async () => { await fetchCloth(cloth_id) }} fullSize>
        Show
    </Button>
</Card>