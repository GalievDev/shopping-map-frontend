<script lang="ts">
    import type Clothes from "../dto/Clothes";
    import type Outfits from "../dto/Outfits"
    import {onMount} from "svelte";
    import {InfoCircled} from "radix-icons-svelte";
    import {Alert, Grid, Flex, Image, Loader, Text, Title, Button, Card, Group} from "@svelteuidev/core";
    import type ImageDTO from "../dto/Image";

    type Params = {
        id: number;
    };
    export let params: Params;

    const url = 'http://51.250.36.103:5252/api/v1'

    let error: string | null = null;
    let outfit: Outfits | null = null;
    let image: ImageDTO | null = null;
    let clothes: Clothes[] = [];
    let images: Record<number, ImageDTO | null> = {};

    async function fetchOutfitId(): Promise<Outfits | null> {
        try {
            const response = await fetch(`${url}/outfits/${params.id}`);
            if (!response.ok) {
                console.log('Failed to fetch outfit: ' + response.statusText);
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
                console.log('Failed to fetch image: ' + response.statusText);
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
                console.log('Failed to fetch cloth: ' + response.statusText);
            }
            return await response.json();
        } catch (err: any) {
            error = err.message;
            return null;
        }
    }

    async function fetchOutfit() {
        outfit = await fetchOutfitId();
        if (outfit) {
            image = await fetchImage(outfit.image_id);
        }
        for (const clothId of outfit?.clothes ?? []) {
            const cloth = await fetchClothId(clothId);
            if (cloth) {
                clothes.push(cloth);
            }
        }
        for (const cloth of clothes) {
            fetchImage(cloth.image_id).then(img => {
                images = { ...images, [cloth.image_id]: img };
            });
        }
    }

    async function sendOutfitRequest() {
        try {
            await fetch(`${url}/outfits/${params.id}`, {
                method: 'DELETE'
            });
            location.replace("/#/outfits/")
        } catch (err: any) {
            error = err;
        } finally {

        }
    }

    async function sendClothRequest(cloth_id: number) {
        try {
            const response = await fetch(`${url}/outfits/${params.id}/${cloth_id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                location.reload();
            }
        } catch (err: any) {
            error = err;
        } finally {

        }
    }
    function downloadOutfitData() {
        if (!outfit) {
            console.error('Outfit data is not available');
            return;
        }

        const outfitData = {
            id: outfit.id,
            name: outfit.name,
            description: outfit.description,
            clothes: clothes.map(cloth => ({
                id: cloth.id,
                name: cloth.name,
                link: cloth.link,
                type: cloth.type,
                description: cloth.description,
                image_id: cloth.image_id
            })),
            image_id: outfit.image_id
        };

        const blob = new Blob([JSON.stringify(outfitData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${outfit.name}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function downloadImage() {
        if (image) {
            const base64Image = `data:image/png;base64,${image.bytes}`;
            const a = document.createElement('a');
            a.href = base64Image;
            a.download = `${outfit?.name}.png`;
            a.click();
        }
    }

    function downloadAllClothImages() {
        if (clothes.length === 0) {
            console.error('No clothes available to download images.');
            return;
        }

        clothes.forEach(cloth => {
            if (images[cloth.image_id]) {
                const base64Image = `data:image/png;base64,${images[cloth.image_id]?.bytes}`;
                const a = document.createElement('a');
                a.href = base64Image;
                a.download = `${cloth.name}.png`;
                a.click();
            } else {
                console.error(`Image for cloth ID ${cloth.id} not found.`);
            }
        });
    }

    onMount(async () => {
        await fetchOutfit();
        image = await fetchImage(outfit?.image_id!!);
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
                        <Image justify="center" width={460} height={800} fit='contain' src="{`data:image/png;base64,${image?.bytes}`}" alt="{image?.name}"></Image>
                    </Flex>
                {:else}
                    <Loader></Loader>
                {/if}
                <Group position="center" direction="column" spacing="xs">
                    <Button color="#deccb7" ripple radius="md" on:click={() => downloadImage()}>Скачать изображение</Button>
                    <Button color="#deccb7" ripple radius="md" on:click={() => downloadAllClothImages()}>Скачать изображения всех вещей</Button>
                    <Button color="#deccb7" ripple radius="md" on:click={() => downloadOutfitData()}>Выгрузить .json</Button>
                    <Button variant="outline" color=#deccb7 ripple radius="md" on:click={() => sendOutfitRequest()}>Удалить</Button>
                </Group>
            </Flex>
        </Grid.Col>
        <Grid.Col span={4}>
            <Flex direction="column" gap="xl">
                <Title order={1} align='center'>{outfit?.name}</Title>
                <Text size="xl">
                    Описание: {outfit?.description}
                </Text>
                <Text size="xl">
                    Элементы одежды:
                </Text>
                <Grid>
                    {#each clothes as cloth}
                        <Grid.Col span={6}>
                            <Card>
                                <Card.Section firstpadding="lg">
                                    {#if error}
                                        <Alert icon={InfoCircled} title="Something went wrong..." color="red">
                                            {error}
                                        </Alert>
                                    {:else if image}
                                        <Flex justify="center">
                                            <Image justify="center" width={460} height={200} fit='contain' src="{`data:image/png;base64,${images[cloth.image_id]?.bytes}`}"></Image>
                                        </Flex>
                                    {:else}
                                        <Loader></Loader>
                                    {/if}
                                </Card.Section>
                                <Group position="center" direction="column" spacing="xs">
                                    <Button color=#deccb7 href="/#/clothes/{cloth.id}" fullSize>
                                        Перейти к {cloth.name}
                                    </Button>
                                    <Button color=#deccb7 on:click={() => sendClothRequest(cloth.id)} fullSize>
                                        Удалить {cloth.name} из данного аутфита
                                    </Button>
                                </Group>
                            </Card>
                        </Grid.Col>
                    {/each}
                </Grid>
            </Flex>
        </Grid.Col>
    </Grid>
</main>

<style>
    main {
        margin-top: 100px;
    }
</style>