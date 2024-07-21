<script lang="ts">
    import {Alert, Button, Card, Group, Image, Loader, Text, Grid, Modal, Flex} from '@svelteuidev/core';
    import { InfoCircled } from 'radix-icons-svelte';
    import { onMount } from "svelte";
    import type ImageDTO from "../dto/Image";
    import type Clothes from "../dto/Clothes";

    export let cloth_id: number, image_id: number, name: string, link: string;

    const url = 'http://51.250.36.103:5252/api/v1'
    let image: ImageDTO | null = null;
    let error: string | null = null;
    let opened = false;
    let cloth: Clothes | null = null;

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
            <Image justify="center" width={460} height={200} fit='contain' src="{`data:image/png;base64,${image?.bytes}`}" alt="{image?.name}"></Image>
        </Flex>
    {:else}
        <Loader></Loader>
    {/if}
    <Flex justify="center" direction="column" gap="md">

        <Group position='apart'>
            <Text weight={500}>{name}</Text>
        </Group>

        <Modal centered {opened} on:close={() => opened = false} title={cloth?.name}
               overlayOpacity={0.55}
               overlayBlur={3}>
            <Flex direction="column" gap="md">
                <Image src="{`data:image/png;base64,${image?.bytes}`}" alt="{image?.name}"></Image>
                <Text size='md'>
                    Тип: {cloth?.type}
                </Text>
                <Text size='md'>
                    Описание: {cloth?.description}
                </Text>

                <Button color=#deccb7 href="{cloth?.link}" fullSize>
                    Показать на странице магазина
                </Button>
            </Flex>
        </Modal>
        <Grid>
            <Grid.Col span={6}>
                <Button color=#deccb7 href="/#/clothes/{cloth_id}" fullSize>
                    Показать информацию
                </Button>
            </Grid.Col>
            <Grid.Col span={6}>
                <Button color=#deccb7 href="{link}" fullSize>
                    Ссылка
                </Button>
            </Grid.Col>
        </Grid>
    </Flex>
</Card>
