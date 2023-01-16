import { gameSettings, IPosition, IV } from "../..";

export class Platform {
    position: IPosition
    image: HTMLImageElement
    markedForDeletion: boolean

    constructor({ position}: { position: IPosition }) {
        this.position = position
        this.image = new Image()
        this.markedForDeletion = false
    }

    update({ v }: { v: IV }) {
    }

    draw() {}
}