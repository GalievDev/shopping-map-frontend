<script lang="ts">
    import type Clothes from "../dto/Clothes";
    import {onMount} from "svelte";
    import {InfoCircled} from "radix-icons-svelte";
    import {Alert, Grid, Flex, Image, Loader, Text} from "@svelteuidev/core";
    import type ImageDTO from "../dto/Image";

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

    onMount(async () => {
        cloth = await fetchClothId();
        image = await fetchImage(cloth?.image_id!!);
    })

</script>

<Grid gutter={40}>
    <Grid.Col span={4}>
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
    </Grid.Col>
    <Grid.Col span={4}>
        <Text size="xl">
            Название:
        </Text>
        <Text size="md">
            { cloth?.name }
        </Text>
        <Text size="xl">
            Тип:
        </Text>
        <Text size="md">
            { cloth?.type }
        </Text>
    </Grid.Col>
    <Grid.Col span={4}>
        <Text size="xl">
            Описание:
        </Text>
        <Text size="md">
            { cloth?.description}
        </Text>
        <Text size="xl">
            Ссылка:
        </Text>
        <Text size="md">
            { cloth?.link }
        </Text>
    </Grid.Col>
</Grid>