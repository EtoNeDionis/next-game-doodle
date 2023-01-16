import { gameSettings, IPosition, IV } from "../..";
import { Platform } from "./Platform";
import img from "../../../public/images/brownPlatform.png"

export class BrownPlatform extends Platform {
    constructor({ position }: { position: IPosition}) {
        super({ position: position })
        this.image = new Image()
        this.image.src = img.src
        this.image.width = img.width
        this.image.height = img.height
    }
    update({ v }: {v: IV}) {
        if (this.position.y > gameSettings.canvas!.height + 200) this.markedForDeletion = true

        if (v.y < 0)
            this.position.y -= v.y
    }

    draw() {
        const ctx = gameSettings.ctx as CanvasRenderingContext2D
        ctx.save()
        ctx.drawImage(this.image, this.position.x, this.position.y)
        ctx.restore()
    }
}