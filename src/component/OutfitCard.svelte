<script lang="ts">
    import { Alert, Button, Card, Group, Image, Loader, Text, Flex } from '@svelteuidev/core';
    import { InfoCircled } from 'radix-icons-svelte';
    import { onMount } from "svelte";
    import type ImageDTO from "../dto/Image";

    export let outfit_id: number, image_id: number, name: string;

    const url = 'http://51.250.36.103:5252/api/v1';
    let image: ImageDTO | null = null;
    let error: string | null = null;

    async function fetchImage(id: number): Promise<ImageDTO | null> {
        try {
            const response = await fetch(`${url}/images/${id}`);
            if (!response.ok) {
                console.log('Failed to fetch image: ' + response.statusText);
            }
            return await response.json();
        } catch (err: any) {
            error = err.message;
            return null;
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
            <Image justify="center" width={360} height={400} fit='contain' src={`data:image/png;base64,${image?.bytes}`} alt={image?.name}></Image>
        </Flex>
    {:else}
        <Loader></Loader>
    {/if}
    <Flex justify="center" direction="column" gap="md">

        <Group position='apart'>
            <Text weight={500}>{name}</Text>
        </Group>

        <Button color="#deccb7" href="/#/outfits/{outfit_id}" fullSize>
            Показать информацию
        </Button>
    </Flex>
</Card>