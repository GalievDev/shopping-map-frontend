<script lang="ts">
    import {onMount} from "svelte";
    import ClothCard from "../component/ClothCard.svelte";
    import type Clothes from "../dto/Clothes";
    import type ClothRequest from "../dto/ClothRequest";
    import {ClothType} from "../dto/ClothType";
    import {Button, Flex, Grid, Input, Modal, Text} from '@svelteuidev/core';
    import { MagnifyingGlass } from 'radix-icons-svelte';

    let clothes: Clothes[] | [] = []
    let opened = false;

    const url = 'http://10.90.136.54:5252/api/v1/clothes'
    let error: string | null = null
    let name = '';
    let link = '';
    let description = '';
    let type: ClothType = ClothType.NONE;
    let image = '';
    let searchQuery = '';


    async function fetchClothes(): Promise<Clothes[] | []> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch image: ' + response.statusText);
            }
            return await response.json();e
        } catch (err: any) {
            error = err.message;
            return [];
        }
    }

    async function sendClothRequest() {
        const clothRequest: ClothRequest = {
            name,
            link,
            description,
            type,
            image
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clothRequest),
            });
            console.log(JSON.stringify(clothRequest))
        } catch (error) {
            console.error('Error: ', error)
        }

    }

    function handleFileChange(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                image = (reader.result as string).split(',')[1]; // Remove the data URL prefix
            };
            reader.readAsDataURL(file);
        }
    }


    onMount(async () => {
        clothes = await fetchClothes()
    })


    function sortAlphabetically() {
        clothes.sort((a: any, b: any) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
    }

    function close() {
        opened = false;
    }

    async function searchClothes() {
        if (searchQuery === '') {
            // If search query is empty, show all clothes
            clothes = await fetchClothes();
        } else {
            // Filter clothes based on search query
            clothes = await fetchClothes().then(allClothes => {
                return allClothes.filter(cloth => {
                    return cloth.name.toLowerCase().includes(searchQuery.toLowerCase());
                });
            });
        }
    }
</script>

<h1>Одежда</h1>
<Modal centered {opened} on:close={() => opened = false} title="Добавление одежды"
       overlayOpacity={0.55}
       overlayBlur={3}
>
    <form on:submit={() => sendClothRequest()}>
        <Flex gap="md" direction="column">
            <Text>Название:</Text>
            <Input bind:value={name} required></Input>
            <Text>Ссылка:</Text>
            <Input bind:value={link} required></Input>
            <Text>Описание:</Text>
            <Input bind:value={description} required></Input>
            <Text>Выберите тип:</Text>
            <Input root="button">Button input</Input>
            <Input root="select" bind:value={type} required>
                {#each Object.values(ClothType) as clothType}
                    <option value={clothType}>{clothType}</option>
                {/each}
            </Input>
            <Text>Загрузите фото:</Text>
            <Input type="file" accept="image/*" on:change={handleFileChange} required></Input>
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
                on:input={searchClothes}
                icon={MagnifyingGlass}
                placeholder='Поиск'
                rightSectionWidth={70}
                styles={{ rightSection: { pointerEvents: 'none' } }}
        >
        </Input>
    </Grid.Col>
    <Grid.Col span={1} offset={2}>
        <Button on:click={() => (opened = true)} color=#deccb7 ripple radius="md" >Добавить одежду</Button>
    </Grid.Col>
</Grid>
<Grid>
    {#each clothes as cloth (cloth.id)}
        <Grid.Col span={4}>
            <ClothCard cloth_id="{cloth.id}" image_id="{cloth.image_id}" name="{cloth.name}" link="{cloth.link}" description="{cloth.description}"></ClothCard>
        </Grid.Col>
    {/each}
</Grid>