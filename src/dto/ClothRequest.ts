
import Outfits from "../routes/Outfits.svelte";

export default interface ClothRequest {
    name: string,
    link: string,
    description: string,
    type: Outfits,
    image: string;
}
