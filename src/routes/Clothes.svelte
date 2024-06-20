<script lang="ts">
    import {onMount} from "svelte";
    import ClothCard from "../component/ClothCard.svelte";
    import type Clothes from "../dto/Clothes";
    import {Button, Modal} from "@svelteuidev/core";
    import type ClothRequest from "../dto/ClothRequest";
    import {ClothType} from "../dto/ClothType";

    let clothes: Clothes[] | [] = []
    let error: string | null = null
    let opened = false

    let name = '';
    let link = '';
    let description = '';
    let type: ClothType = ClothType.NONE;
    let image = '';

    async function fetchClothes(): Promise<Clothes[] | []> {
        try {
            const response = await fetch(`http://0.0.0.0:8080/api/v1/clothes`);
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
            const response = await fetch('http://0.0.0.0:8080/api/v1/clothes', {
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

    function close() {
        opened = false;
    }

    onMount(async () => {
        clothes = await fetchClothes()
    })

</script>

<h1>Clothes</h1>
<Modal {opened} on:close={close} title="Create cloth"
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
<Button color="pink" on:click={() => (opened=true)}>
    Create cloth
</Button>
{#each clothes as cloth (cloth.id)}
    <ClothCard image_id="{cloth.image_id}" name="{cloth.name}" link="{cloth.link}" description="{cloth.description}"></ClothCard>
{/each}