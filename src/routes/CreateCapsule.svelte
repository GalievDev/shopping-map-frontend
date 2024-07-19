<script lang="ts">
    import {onMount} from "svelte";
    import {Alert, Button, Checkbox, Flex, Input, Loader, Text} from '@svelteuidev/core';
    import type Outfits from "../dto/Outfits";
    import type CapsuleRequest from "../dto/CapsuleRequest";
    import {InfoCircled} from "radix-icons-svelte";

    const url = 'http://10.90.136.54:5252/api/v1';
    let outfits: Outfits[] | [] = [];
    let error: string | null = null;

    let name = '';
    let description = '';
    let outfits_ids: Set<number> = new Set();

    async function fetchOutfits(): Promise<Outfits[] | []> {
        try {
            const response = await fetch(`${url}/outfits`);
            if (!response.ok) {
                console.log('Failed to fetch outfits: ' + response.statusText);
            }
            return await response.json();
        } catch (err: any) {
            error = err.message;
            return [];
        }
    }

    async function sendCapsuleRequest() {
        const capsuleRequest: CapsuleRequest = {
            name,
            description,
            outfits: Array.from(outfits_ids)
        };

        try {
            const response = await fetch(`${url}/capsules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(capsuleRequest),
            });
            if (response.ok) {
                location.replace('/#/capsules/');
            }
        } catch (error) {
            console.error('Error: ', error);
        }
    }

    function toggleSelection(clothId: number) {
        if (outfits_ids.has(clothId)) {
            outfits_ids.delete(clothId);
        } else {
            outfits_ids.add(clothId);
        }
    }

    onMount(async () => {
        outfits = await fetchOutfits();
    });

</script>

<h1>Добавление капсулы</h1>
    <div class="container">
        <div class="form">
        <Flex gap="md" direction="column">
            <Text>Название:</Text>
            <Input bind:value={name} required></Input>
            <Text>Описание:</Text>
            <Input bind:value={description} required></Input>
            <Text>Выберите образы для капсулы:</Text>
            {#each outfits as outfit}
                {#if error}
                    <Alert icon={InfoCircled} title="Something went wrong..." color="red">
                        {error}
                    </Alert>
                {:else if outfit}
                    <Checkbox checked={false} label="{outfit.name}" on:change={() => toggleSelection(outfit.id)} />
                {:else}
                    <Loader></Loader>
                {/if}
            {/each}
            </Flex>
    </div>
    <Button color=#deccb7 ripple radius="md" on:click={() => sendCapsuleRequest()}>Подтвердить</Button>
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

