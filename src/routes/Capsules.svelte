<script lang="ts">
    import {onMount} from "svelte";
    import ClothCard from "../component/ClothCard.svelte";
    import {Button, Flex, Grid, Input, Modal} from '@svelteuidev/core';
    import { MagnifyingGlass } from 'radix-icons-svelte';

    const url = 'http://10.90.136.54:5252/api/v1/capsules'
    let capsules: Capsules[] | [] = []
    let error: string | null = null
    let opened = false

    let name = '';
    let link = '';
    let description = '';

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

    async function sendCapsuleRequest() {
        const capsuleRequest: CapsuleRequest = {
            name,
            link,
            description,
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(capsuleRequest),
            });
            console.log(JSON.stringify(capsuleRequest))
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
        capsules = await fetchCapsules()
    })

    function sortAlphabetically() {
        capsules.sort((a: any, b: any) => {
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
<Modal centered {opened} on:close={() => opened = false} title="Create capsule"
       overlayOpacity={0.55}
       overlayBlur={3}
>
    <form on:submit={() => sendCapsuleRequest()}>
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
        <Button color=#deccb7 ripple radius="md" on:click={sortAlphabetically}>Сортировка</Button>
    </Grid.Col>
    <Grid.Col span={1} offset={2.5}>
        <Button on:click={() => (opened = true)} color=#deccb7 ripple radius="md" >Добавить капсулу</Button>
    </Grid.Col>
</Grid>
<Grid>
    {#each capsules as capsule (capsule.id)}
        <Grid.Col span={4}>
            <ClothCard name="{capsule.name}" link="{capsule.link}" description="{capsule.description}"></ClothCard>
        </Grid.Col>
    {/each}
</Grid>
