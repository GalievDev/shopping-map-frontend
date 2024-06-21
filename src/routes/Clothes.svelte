<script lang="ts">
    import { onMount } from "svelte";
    import ClothCard from "../component/ClothCard.svelte";
    import {Button, Flex, Grid, Input, Modal} from '@svelteuidev/core';
    import { MagnifyingGlass } from 'radix-icons-svelte';
    import {ClothType} from "../dto/ClothType";
    import type ClothRequest from "../dto/ClothRequest";
    import type Clothes from "../dto/Clothes";

    let clothes: Clothes[] | [] = []
    let opened = false;

    const url = 'http://10.90.136.54:5252/api/v1/clothes'
    let error: string | null = null
    let name = '';
    let link = '';
    let description = '';
    let type: ClothType = ClothType.NONE;
    let image = '';


    async function fetchClothes(): Promise<Clothes[] | []> {
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
        const response = await fetch('https://e2484b7d-baa7-4b5f-a860-cf269e3bb116.mock.pstmn.io/api/v1/clothes')
        clothes = await response.json()
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
</script>

<h1>Одежда</h1>
<Modal centered {opened} on:close={() => opened = false} title="Create cloth"
       overlayOpacity={0.55}
       overlayBlur={3}
>
    <form on:submit={() => sendClothRequest()}>
        <label>
            Name:
            <input type="text" bind:value={name} required />
        </label>
        <br />
        <label>
            Link:
            <input type="url" bind:value={link} required />
        </label>
        <br />
        <label>
            Description:
            <textarea bind:value={description} required></textarea>
        </label>
        <br />
        <label>
            Type:
            <select bind:value={type}>
                {#each Object.values(ClothType) as clothType}
                    <option value={clothType}>{clothType}</option>
                {/each}
            </select>
        </label>
        <br />
        <label>
            Image:
            <input type="file" accept="image/*" on:change={handleFileChange} required />
        </label>
        <br />
        <button type="submit">Submit</button>
    </form>
</Modal>


<Grid>
    <Grid.Col span={1} offset={2}>
        <Input
                icon={MagnifyingGlass}
                placeholder='Поиск'
                rightSectionWidth={70}
                styles={{ rightSection: { pointerEvents: 'none' } }}
        >
        </Input>
    </Grid.Col>

    <Grid.Col span={1} offset={2.5}>
        <Button color="yellow" ripple radius="md" on:click={sortAlphabetically}>Сортировка</Button>
    </Grid.Col>
    <Grid.Col span={1} offset={2.5}>
        <Button on:click={() => (opened = true)} color="yellow" ripple radius="md" >Добавить одежду</Button>
    </Grid.Col>
</Grid>
 <Flex justify="center" gap="lg">
     {#each clothes as cloth (cloth.id)}
         <ClothCard image_id="{cloth.image_id}" name="{cloth.name}" link="{cloth.link}" description="{cloth.description}"></ClothCard>
     {/each}
 </Flex>