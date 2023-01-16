import { gameSettings, IPosition, IV } from "../..";
import { Enemy } from "./Enemy";
import imgEnemy from "../../../public/images/enemy1.png"

export class EnemyEasy extends Enemy {
    constructor({ position }: { position: IPosition }) {
        super({ position: position })
        const img = new Image()
        img.src = imgEnemy.src
        img.width = imgEnemy.width
        img.height = imgEnemy.height
        this.img = img
        this.hitsToDie = 1
        this.v.x = 2

        const audio = new Audio("/sounds/enemy.mp3")
        audio.volume = .2
        audio.play()
    }
    update({ v }: { v: IV }) { 
        if (v.y < 0)
            this.v.y = -v.y

        if (
            this.position.x + this.img.width >= gameSettings.canvas!.width ||
            this.position.x < 0
        ) 
            this.v.x *= -1

        if (
            this.position.y > gameSettings.canvas!.height ||
            this.hitsToDie === 0
        )
            this.markedForDeletion = true

        if (this.hitsToDie === 0) {
            const audio = new Audio("/sounds/monster-crash.mp3")
            audio.volume = .1
            audio.play()
        }

        this.position.x += this.v.x
        this.position.y += this.v.y
    }

    draw() {
        const ctx = gameSettings.ctx as CanvasRenderingContext2D
        ctx.drawImage(this.img, this.position.x, this.position.y)
    }
}