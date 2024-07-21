<script lang="ts">
    import type Clothes from "../dto/Clothes";
    import {onMount} from "svelte";
    import {InfoCircled} from "radix-icons-svelte";
    import {Alert, Grid, Flex, Image, Loader, Text, Title, Button, Group} from "@svelteuidev/core";
    import type ImageDTO from "../dto/Image";
    import type ClothRequest from "../dto/ClothRequest";
    import {ClothType} from "../dto/ClothType";
    export let params: [];
    const url = 'http://10.90.136.54:5252/api/v1';
    let error: string | null = null;
    let cloth: Clothes | null = null;
    let image: ImageDTO | null = null;

    async function fetchClothId(): Promise<Clothes | null> {
        try {
            const response = await fetch(`${url}/clothes/${params.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch image: ' + response.statusText);
            }
            return await response.json();
        } catch (err: any) {
            error = err.message;
            return null;
        }
    }

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

    async function sendClothRequest() {
        try {
            const response = await fetch(`${url}/clothes/${params.id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                location.replace('/#/');
            }
        } catch (err: any) {
            error = err;
        } finally {

        }
    }

    function downloadClothData() {
        if (cloth) {
            const blob = new Blob([JSON.stringify(cloth, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${cloth.name}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    }

    function downloadImage() {
        if (image) {
            const base64Image = `data:image/png;base64,${image.bytes}`;
            const a = document.createElement('a');
            a.href = base64Image;
            a.download = `${cloth?.name}.png`;
            a.click();
        }
    }

    onMount(async () => {
        cloth = await fetchClothId();
        image = await fetchImage(cloth?.image_id!!);
    })
</script>

<main>
    <Grid gutter={40}>
        <Grid.Col span={6} override={{minHeight: 400}}>
            <Flex justify="center" direction="column" gap="xl">
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
                <Group position="center" direction="column" spacing="xs">
                    <Button color="#deccb7" ripple radius="md" on:click={() => downloadImage()}>Скачать изображение</Button>
                    <Button color="#deccb7" ripple radius="md" on:click={() => downloadClothData()}>Выгрузить .json</Button>
                    <Button variant="outline" color=#deccb7 ripple radius="md" on:click={() => sendClothRequest()}>Удалить</Button>
                </Group>
            </Flex>
        </Grid.Col>
        <Grid.Col span={4}>
            <Flex direction="column" gap="xl">
                <Title order={1} align='center'>{cloth?.name}</Title>
                <Text size="xl">
                    Тип: { cloth?.type }
                </Text>
                <Text size="xl">
                    Описание: {cloth?.description}
                </Text>
                <Flex justify="center">
                    <Button href={cloth?.link} color=#deccb7 align="center">
                        Посмотреть на странице магазина
                    </Button>
                </Flex>
            </Flex>
        </Grid.Col>
    </Grid>
</main>

<style>
    main {
        margin-top: 100px;
    }
</style>