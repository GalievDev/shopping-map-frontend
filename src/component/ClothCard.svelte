<script lang="ts">
    import {Alert, Button, Card, Group, Image, Loader, Text, Grid, Modal} from '@svelteuidev/core';
    import { InfoCircled } from 'radix-icons-svelte';
    import { onMount } from "svelte";
    import type ImageDTO from "../dto/Image";

    export let image_id: number, name: string, link: string, description: string;

    let image: ImageDTO | null = null;
    let error: string | null = null;
    let opened = false;

    async function fetchImage(id: number): Promise<Image | null> {
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

    function close() {
        opened = false;
    }

    onMount(async () => {
        image = await fetchImage(image_id);
    });
</script>

<Modal {opened} on:close={close} title="Добавление одежды">
    bebra
</Modal>

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

    <Grid>
        <Grid.Col span={6}>
            <Button variant='light' color='blue' on:click={() => (opened = true)} fullSize>
                Show
            </Button>
        </Grid.Col>
        <Grid.Col span={6}>
            <Button variant='light' color='blue' href="{link}" fullSize>
                Link
            </Button>
        </Grid.Col>
    </Grid>
</Card>