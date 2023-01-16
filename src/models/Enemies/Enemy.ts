import { IPosition, IV } from "../.."

export class Enemy {
    position: IPosition
    v: IV
    markedForDeletion: boolean
    hitsToDie: number
    img: HTMLImageElement

    constructor({ position }: { position: IPosition}) {
        this.position = position
        this.v = { x: 0, y: 0 }
        this.markedForDeletion = false
        this.img = new Image()
        this.hitsToDie = 0
    }

    update({ v }: {v: IV}) {

    }

    draw() {
    }
}