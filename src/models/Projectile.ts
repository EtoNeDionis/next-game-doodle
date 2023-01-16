import { gameSettings, IPosition, IV } from "..";

export class Projectile {
    width: number
    height: number
    color: string
    position: IPosition
    v: IV
    markedForDeletion: boolean

    constructor(
        { width, height, color, position }
            :
            { width: number; height: number; color: string; position: IPosition })
    {
        this.width = width
        this.height = height    
        this.color = color
        this.position = position
        this.v = { x: 0, y: -9 }
        this.markedForDeletion = false
    }

    update() {
        this.position.y += this.v.y
        if (this.position.y < -1000)
            this.markedForDeletion = true
    }

    draw() {
        const ctx = gameSettings.ctx as CanvasRenderingContext2D
        ctx.save()
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        ctx.restore()
    }
}