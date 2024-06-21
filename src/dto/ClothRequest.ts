import type {ClothType} from "./ClothType";

export default interface ClothRequest {
    name: string,
    link: string,
    description: string,
    type: ClothType,
    image: string;
}