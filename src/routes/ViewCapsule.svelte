<script lang="ts">
    import type Outfits from "../dto/Outfits"
    import {onMount} from "svelte";
    import {InfoCircled} from "radix-icons-svelte";
    import {Alert, Grid, Flex, Image, Loader, Text, Title, Button, Card, Group} from "@svelteuidev/core";
    import type ImageDTO from "../dto/Image";
    import type Capsules from "../dto/Capsules";
    import type Clothes from "../dto/Clothes";

    type Params = {
        id: number;
    };
    export let params: Params;

    const url = 'http://51.250.36.103:5252/api/v1'

    let error: string | null = null;
    let capsule: Capsules | null = null;
    let image: ImageDTO | null = null;
    let outfits: Outfits[] = []
    let images: Record<number, ImageDTO | null> = {};
    let clothes: Clothes[] = []

    async function fetchCapsuleId(): Promise<Capsules | null> {
        try {
            const response = await fetch(`${url}/capsules/${params.id}`);
            if (!response.ok) {
                console.log('Failed to fetch capsule: ' + response.statusText);
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

    async function fetchOutfit(id: number): Promise<Outfits | null> {
        try {
            const response = await fetch(`${url}/outfits/${id}`);
            if (!response.ok) {
                console.log('Failed to fetch outfit: ' + response.statusText);
            }
            return await response.json();
        } catch (err: any) {
            error = err.message;
            console.error('Fetch error:', err);
            return null;
        }
    }

    async function fetchCapsule() {
        capsule = await fetchCapsuleId();
        if (capsule) {
            image = await fetchImage(capsule.image_id);
        }
        for (const outfitId of capsule?.outfits ?? []) {
            const cloth = await fetchOutfit(outfitId);
            if (cloth) {
                outfits.push(cloth);
            }
        }
        for (const outfit of outfits) {
            const fetchedClothes = await Promise.all(outfit?.clothes!!.map(fetchClothId));
            for (const cloth of fetchedClothes) {
                clothes.push(cloth);
                fetchImage(cloth.image_id).then(img => {
                    images[cloth.image_id] = img;
                    images = { ...images, [cloth.image_id]: img };
                });
            }

            fetchImage(outfit.image_id).then(img => {
                images = { ...images, [outfit.image_id]: img };
            });
        }
    }


    async function sendOutfitRequest(outfit_id: number) {
        try {
            const response = await fetch(`${url}/capsules/${params.id}/${outfit_id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                location.reload()
            }
        } catch (err: any) {
            error = err;
        } finally {

        }
    }

    async function sendCapsuleRequest() {
        try {
            await fetch(`${url}/capsules/${params.id}`, {
                method: 'DELETE'
            });
            location.replace("/#/capsules/")
        } catch (err: any) {
            error = err;
        }
    }

    function downloadCapsuleData() {
        if (!capsule) {
            console.error('Capsule data is not available');
            return;
        }

        const capsuleData = {
            id: capsule.id,
            name: capsule.name,
            description: capsule.description,
            outfits: outfits.map(outfit => ({
                id: outfit.id,
                name: outfit.name,
                description: outfit.description,
                image_id: outfit.image_id,
                clothes: outfit.clothes.map(cloth => (cloth))
            })),
            image_id: capsule.image_id
        };

        const blob = new Blob([JSON.stringify(capsuleData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${capsule.name}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function downloadImage() {
        if (image) {
            const base64Image = `data:image/png;base64,${image.bytes}`;
            const a = document.createElement('a');
            a.href = base64Image;
            a.download = `${capsule?.name}.png`;
            a.click();
        }
    }

    function downloadAllClothImages() {
        if (clothes.length === 0) {
            console.error('No clothes available to download images.');
            return;
        }

        clothes.forEach(cloth => {
            const base64Image = `data:image/png;base64,${images[cloth.image_id]?.bytes}`;
            const a = document.createElement('a');
            a.href = base64Image;
            a.download = `${cloth.name}.png`;
            a.click();
        });
    }

    onMount(async () => {
        await fetchCapsule()
        image = await fetchImage(capsule?.image_id!!);
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
                    <Button color="#deccb7" ripple radius="md" on:click={() => downloadCapsuleData()}>Выгрузить .json</Button>
                    <Button variant="outline" color=#deccb7 ripple radius="md" on:click={() => sendCapsuleRequest()}>Удалить</Button>
                </Group>
            </Flex>
        </Grid.Col>
        <Grid.Col span={4}>
            <Flex direction="column" gap="xl">
                <Title order={1} align='center'>{capsule?.name}</Title>
                <Text size="xl">
                    Описание: {capsule?.description}
                </Text>
                <Text size="xl">
                    Образы из этой капсулы:
                </Text>
                <Grid>
                    {#each outfits as outfit}
                        <Grid.Col span={6}>
                                <Card>
                                    <Card.Section firstpadding="lg">
                                    {#if error}
                                        <Alert icon={InfoCircled} title="Something went wrong..." color="red">
                                            {error}
                                        </Alert>
                                    {:else if image}
                                        <Flex justify="center">
                                            <Image justify="center" width={460} height={200} fit='contain' src="{`data:image/png;base64,${images[outfit.image_id]?.bytes}`}"></Image>
                                        </Flex>
                                    {:else}
                                        <Loader></Loader>
                                    {/if}
                                </Card.Section>
                                    <Group position="center" direction="column" spacing="xs">
                                        <Button color=#deccb7 href="/#/outfits/{outfit.id}" fullSize>
                                            Перейти к {outfit.name}
                                        </Button>
                                        <Button color=#deccb7 on:click={() => sendOutfitRequest(outfit.id)} fullSize>
                                            Удалить {outfit.name} из данной капсулы
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