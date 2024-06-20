<script lang="ts">
    import { onMount } from "svelte";
    import ClothCard from "../component/ClothCard.svelte";

    let clothes: any = []

    onMount(async () => {
        const response = await fetch('https://e2484b7d-baa7-4b5f-a860-cf269e3bb116.mock.pstmn.io/api/v1/clothes')
        clothes = await response.json()
    })

</script>

<h1>Clothes</h1>
{#each clothes as cloth (cloth.id)}
    <ClothCard name="{cloth.name}" link="{cloth.link}" description="{cloth.description}"></ClothCard>
{/each}