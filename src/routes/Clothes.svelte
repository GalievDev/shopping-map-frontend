<script lang="ts">
    import { onMount } from "svelte";
    import ClothCard from "../component/ClothCard.svelte";
    import type Clothes from "../dto/Clothes";

    let clothes: Clothes[] | [] = []
    let error: string | null = null

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

    onMount(async () => {
        clothes = await fetchClothes()
    })

</script>

<h1>Clothes</h1>
{#each clothes as cloth (cloth.id)}
    <ClothCard image_id="{cloth.image_id}" name="{cloth.name}" link="{cloth.link}" description="{cloth.description}"></ClothCard>
{/each}