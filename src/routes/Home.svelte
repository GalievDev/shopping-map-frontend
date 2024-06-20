<h1>Home page</h1>

<script lang="ts">

import {MagnifyingGlass} from "radix-icons-svelte";
import {Grid, Input} from "@svelteuidev/core";
</script>

<Grid cols={10}>
    <Grid.Col span={5}>
        <Input
                icon={MagnifyingGlass}
                placeholder='Search'
                rightSectionWidth={70}
                styles={{ rightSection: { pointerEvents: 'none' } }}
        >
        </Input>
    </Grid.Col>
</Grid>