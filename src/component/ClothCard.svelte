<script lang="ts">
    import { Badge, Button, Card, Group, Image, Text } from '@svelteuidev/core';
    export let name: string, link: string, description: string;
</script>

<Card shadow='sm' padding='lg'>
    <Card.Section first padding='lg'>
        <Image
                src='./image.png'
                height={160}
                alt='Portugal'
        />
    </Card.Section>

    <Group position='apart'>
        <Text weight={500}>{name}</Text>
    </Group>

    <Text size='sm'>
        {description}
    </Text>

    <Button variant='light' color='blue' href="{link}" fullSize>
        Buy now
    </Button>
</Card>