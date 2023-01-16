import { gameSettings, IPosition, IV } from ".."
import imgBg from "../../public/images/bck.png"

export class Background {
    image: HTMLImageElement
    position: IPosition
    shouldAddPlatforms: boolean

    constructor() {
        this.image = new Image()
        this.image.src = imgBg.src
        this.position = { x: 0, y: 0 }
        this.image.width = gameSettings.canvas!.width
        this.image.height = gameSettings.canvas!.height
        this.shouldAddPlatforms = false
    }

    update({ v }: { v: IV }) {
        this.shouldAddPlatforms = false
        if (this.position.y > gameSettings.canvas!.height) {
            this.position.y = 0
            this.shouldAddPlatforms = true

        }
        if (v.y < 0) {
            this.position.y -= v.y
        }
    }

    draw() {
        const ctx = gameSettings.ctx as CanvasRenderingContext2D

        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            gameSettings.canvas!.width,
            gameSettings.canvas!.height
        )

        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y - this.image.height,
            gameSettings.canvas!.width,
            gameSettings.canvas!.height
        )

    }
}