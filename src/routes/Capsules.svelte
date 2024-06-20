<script lang="ts">
    import { onMount } from "svelte";
    import ClothCard from "../component/ClothCard.svelte";
    import { Badge, Button, Card, Group, Image, Text } from '@svelteuidev/core';

    let capsules: any = []

    onMount(async () => {
        // const response = await fetch('https://e2484b7d-baa7-4b5f-a860-cf269e3bb116.mock.pstmn.io/api/v1/capsules')
        // capsules = await response.json()
    })

</script>

<h1>Capsules page</h1>
{#each capsules as capsule (capsule.id)}
    <ClothCard name="{capsule.name}" link="{capsule.link}" description="{capsule.description}"></ClothCard>
{/each}