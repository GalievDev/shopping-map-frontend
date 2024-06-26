<script lang="ts">
    import { onMount } from "svelte";
    import ClothCard from "../component/ClothCard.svelte";
    import { Portal } from '@svelteuidev/core';

    let opened = false;

    let outfits: any = []

    onMount(async () => {
        // const response = await fetch('https://e2484b7d-baa7-4b5f-a860-cf269e3bb116.mock.pstmn.io/api/v1/outfits')
        // outfits = await response.json()
    })

</script>

<h1>Аутфиты</h1>
<!--
{#each outfits as outfit (outfit.id)}
    <ClothCard name="{outfit.name}" link="{outfit.link}" description="{outfit.description}"></ClothCard>
{/each}
<main style="position: relative; z-index: 1">
    {#if opened}
        <Portal zIndex={5}>
            <div>Your modal content</div>
        </Portal>
    {/if}

    <button on:click={() => (opened = !opened)} type="button"> Open modal </button>
</main>-->
