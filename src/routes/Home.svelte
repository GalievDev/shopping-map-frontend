<h1>Home page</h1>

<script lang="ts">

import {MagnifyingGlass} from "radix-icons-svelte";
import {Grid, Input} from "@svelteuidev/core";
import { Button, Flex } from '@svelteuidev/core';
import { Badge, Card, Group, Image, Text } from '@svelteuidev/core';


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

<Grid cols={12}>
    <Grid.Col span={6} offset={0.2}>
        <div class="card">
            <img alt="Card Background" class="background-image" />
            <div class="card-content">
                <button class="button">Click Me!</button>
            </div>
        </div>
        <style>
            .card {
                width: 300px;
                height: 200px;
                position: relative;
                overflow: hidden;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .background-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                position: absolute;
                top: 0;
                left: 0;
            }

            .card-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
            }

            .button {
                padding: 10px 20px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
        </style>
    </Grid.Col>

    <Grid.Col span={3} offset={1}>
        <Button color="yellow">Сортировка</Button>
    </Grid.Col>
</Grid>
