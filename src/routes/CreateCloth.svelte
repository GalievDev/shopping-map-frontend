<script lang="ts">
    import type Clothes from "../dto/Clothes";
    import { ClothType } from "../dto/ClothType";
    import { Button, Flex, Input, Text } from '@svelteuidev/core';
    import type ClothRequest from "../dto/ClothRequest";

    const url = 'http://51.250.36.103:5252/api/v1/clothes';
    let clothes: Clothes[] | [] = [];

    let name = '';
    let link = '';
    let description = '';
    let type: ClothType = ClothType.NONE;
    let image = '';
    let opened = false;
    let error: string | null = null;

    async function sendClothRequest() {
        const clothRequest: ClothRequest = {
            name,
            link,
            description,
            type,
            image
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clothRequest),
            });
            if (response.ok) {
                location.replace('/#/');
            }
        } catch (err: any) {
            error = err;
        } finally {
            opened = false;
            resetForm();
        }
    }

    function handleFileChange(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                image = (reader.result as string).split(',')[1];
            };
            reader.readAsDataURL(file);
        }
    }

    function resetForm() {
        name = '';
        link = '';
        description = '';
        type = ClothType.NONE;
        image = '';
    }

</script>

<h1>Добавление одежды</h1>

<div class="container">
    <div class="form">
        <Flex gap="md" direction="column">
            <Text>Название:</Text>
            <Input bind:value={name} required></Input>

            <Text>Ссылка:</Text>
            <Input bind:value={link} required></Input>

            <Text>Описание:</Text>
            <Input bind:value={description} required></Input>

            <Text>Выберите тип:</Text>
            <Input root="select" bind:value={type} required>
                {#each Object.values(ClothType) as clothType}
                    <option value={clothType}>{clothType}</option>
                {/each}
            </Input>

            <Text>Загрузите фото:</Text>
            <Input type="file" accept="image/*" on:change={handleFileChange} required></Input>
        </Flex>
    </div>

    <Button color=#deccb7 ripple radius="md" on:click={() => sendClothRequest()}>Подтвердить</Button>
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