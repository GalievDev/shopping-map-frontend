<script lang="ts">
    import {onMount} from "svelte";
    import {Alert, Button, Checkbox, Flex, Input, Loader, Text} from '@svelteuidev/core';
    import type Clothes from "../dto/Clothes";
    import type {OutfitRequest} from "../dto/OutfitRequest";
    import {InfoCircled} from "radix-icons-svelte";

    const url = 'http://51.250.36.103:5252/api/v1';
    let clothes: Clothes[] | [] = [];
    let error: string | null = null;

    let name = '';
    let description = '';
    let clothes_ids: Set<number> = new Set();

    async function sendOutfitRequest() {
        const outfitRequest: OutfitRequest = {
            name,
            description,
            clothes: Array.from(clothes_ids)
        };
        try {
            const response = await fetch(`${url}/outfits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(outfitRequest),
            });
            if (response.ok) {
                location.replace('/#/outfits/');
            }
        } catch (error) {
            console.error('Error: ', error);
        }
    }

    async function fetchClothes(): Promise<Clothes[] | []> {
        try {
            const response = await fetch(`${url}/clothes`);
            if (!response.ok) {
                console.log('Failed to fetch clothes: ' + response.statusText);
            }
            return await response.json();
        } catch (err: any) {
            error = err.message;
            return [];
        }
    }

    function toggleSelection(clothId: number) {
        if (clothes_ids.has(clothId)) {
            clothes_ids.delete(clothId);
        } else {
            clothes_ids.add(clothId);
        }
    }

    onMount(async () => {
        clothes = await fetchClothes();
    });

</script>

<h1>Добавление аутфита</h1>
<div class="container">
    <div class="form">
    <Flex gap="md" direction="column">
        <Text>Название:</Text>
        <Input bind:value={name} required></Input>
        <Text>Описание:</Text>
        <Input bind:value={description} required></Input>

        <Text>Выберите одежду в образ: </Text>
        {#each clothes as cloth}
            {#if error}
                <Alert icon={InfoCircled} title="Something went wrong..." color="red">
                    {error}
                </Alert>
            {:else if cloth}
                <Checkbox checked={false} label="{cloth.name} " on:change={() => toggleSelection(cloth.id)} />
            {:else}
                <Loader></Loader>
            {/if}
        {/each}
        </Flex>
    </div>
    <Button color=#deccb7 ripple radius="md" on:click={() => sendOutfitRequest()}>Подтвердить</Button>
</div>

<style>
    h1 {
        font-family: "Garamond", serif;
        margin-top: 50px;
        margin-bottom: 30px;
        margin-left: 60px;
    }
    .container {
        width: 60%;
        margin: 60px auto 0;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .form {
        width: 100%;
        margin-bottom: 20px;
    }
</style>
