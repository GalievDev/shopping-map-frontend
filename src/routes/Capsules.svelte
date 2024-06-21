<script lang="ts">
    import { onMount } from "svelte";
    import ClothCard from "../component/ClothCard.svelte";
    import { Button, Flex, Grid, Input, Modal, Text } from '@svelteuidev/core';
    import { MagnifyingGlass } from 'radix-icons-svelte';
    import Outfits from "./Outfits.svelte";

    interface Capsule {
        id: string;
        image_id: string;
        name: string;
        description: string;
        outfits: Outfits[];
    }

    type Capsules = Capsule[];

    interface CapsuleRequest {
        name: string;
        description: string;
        outfits: Outfits[];
    }

    const url = 'http://10.90.136.54:5252/api/v1/capsules';
    let capsules: Capsules | [] = [];
    let error: string | null = null;
    let opened = false;

    let name = '';
    let description = '';
    let outfits: Outfits[] = [];
    let outfitName = '';
    let outfitDescription = '';
    let image = '';
    let searchQuery = '';

    async function fetchCapsules(): Promise<Capsule[] | []> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch image: ' + response.statusText);
            }
            return await response.json();
        } catch (err: any) {
            error = err.message;
            return [];
        }
    }

    async function searchCapsules() {
        if (searchQuery === '') {
            capsules = await fetchCapsules();
        } else {
            capsules = await fetchCapsules().then(allCapsules => {
                return allCapsules.filter(capsule => {
                    return capsule.name.toLowerCase().includes(searchQuery.toLowerCase());
                });
            });
        }
    }

    async function sendCapsuleRequest() {
        const capsuleRequest: CapsuleRequest = {
            name,
            description,
            outfits
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(capsuleRequest),
            });
            console.log(JSON.stringify(capsuleRequest));
        } catch (error) {
            console.error('Error: ', error);
        }
    }

    function handleFileChange(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                image = (reader.result as string).split(',')[1];
            };
            reader.readAsDataURL(file);
        }
    }

    function addOutfit() {
        if (outfitName && outfitDescription) {
            outfits = [...outfits, { id: Date.now().toString(), name: outfitName, description: outfitDescription }];
            outfitName = '';
            outfitDescription = '';
        }
    }

    onMount(async () => {
        capsules = await fetchCapsules();
    });

    function sortAlphabetically() {
        capsules.sort((a: Capsule, b: Capsule) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
    }

    function close() {
        opened = false;
    }
</script>

<h1>Капсулы</h1>
<Modal centered {opened} on:close={() => opened = false} title="Добавление капсулы"
       overlayOpacity={0.55}
       overlayBlur={3}
>
    <form on:submit={(e) => { e.preventDefault(); sendCapsuleRequest(); }}>
        <Flex gap="md" direction="column">
            <Text>Название:</Text>
            <Input bind:value={name} required></Input>
            <Text>Описание:</Text>
            <Input bind:value={description} required></Input>
            <Text>Загрузите фото:</Text>
            <Input type="file" accept="image/*" on:change={handleFileChange} required></Input>

            <Text>Добавить аутфиты:</Text>
            <Flex gap="sm" direction="row">
                <Input bind:value={outfitName} placeholder="Название:" required></Input>
                <Input bind:value={outfitDescription} placeholder="Описание:" required></Input>
                <Button type="button" on:click={addOutfit}>Добавить</Button>
            </Flex>

            <Text>Аутфиты:</Text>
            <ul>
                {#each outfits as outfit}
                    <li>{outfit.name}: {outfit.description}</li>
                {/each}
            </ul>

            <Button color=#deccb7 type="submit">Подтвердить</Button>
        </Flex>
    </form>
</Modal>

<Grid>
    <Grid.Col span={1} offset={2}>
        <Button color=#deccb7 ripple radius="md" on:click={sortAlphabetically}>Сортировка</Button>
    </Grid.Col>

    <Grid.Col span={2} offset={2}>
        <Input
                bind:value={searchQuery}
                on:input={searchCapsules}
                icon={MagnifyingGlass}
                placeholder='Поиск'
                rightSectionWidth={70}
                styles={{ rightSection: { pointerEvents: 'none' } }}
        >
        </Input>
    </Grid.Col>
    <Grid.Col span={1} offset={2}>
        <Button on:click={() => (opened = true)} color=#deccb7 ripple radius="md" >Добавить капсулу</Button>
    </Grid.Col>
</Grid>

<Grid>
    {#each capsules as capsule (capsule.id)}
        <Grid.Col span={4}>
            <ClothCard cloth_id="{capsule.id}" image_id="{capsule.image_id}" name="{capsule.name}" description="{capsule.description}"></ClothCard>
        </Grid.Col>
    {/each}
</Grid>
