<script lang="ts">
    import type Outfits from "../dto/Outfits"
    import {onMount} from "svelte";
    import {InfoCircled} from "radix-icons-svelte";
    import {Alert, Grid, Flex, Image, Loader, Text, Title, Button, Card} from "@svelteuidev/core";
    import type ImageDTO from "../dto/Image";
    import type Capsules from "../dto/Capsules";

    type Params = {
        id: number;
    };
    export let params: Params;

    const url = 'http://10.90.136.54:5252/api/v1';

    let error: string | null = null;
    let capsule: Capsules | null = null;
    let image: ImageDTO | null = null;
    let outfits: Outfits[] = []
    let images: Record<number, ImageDTO | null> = {};

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
            fetchImage(outfit.image_id).then(img => {
                images = { ...images, [outfit.image_id]: img };
            });
        }
    }

    async function sendCapsuleRequest() {
        try {
            await fetch(`${url}/capsules/${params.id}`, {
                method: 'DELETE'
            });
        } catch (err: any) {
            error = err;
        }
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
                <Flex justify="center">
                    <Button color=#deccb7 ripple radius="md" on:click={() => sendCapsuleRequest()}>Удалить</Button>
                </Flex>
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
                                            <Image justify="center" width={460} height={400} fit='contain' src="{`data:image/png;base64,${images[outfit.image_id]?.bytes}`}"></Image>
                                        </Flex>
                                    {:else}
                                        <Loader></Loader>
                                    {/if}
                                </Card.Section>
                                <Button color=#deccb7 href="/#/outfits/{outfit.id}" fullSize>
                                    Перейти к {outfit.name}
                                </Button>
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