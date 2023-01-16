import { gameSettings, IPosition, IV } from "..";
//import imgPlayer from "../../public/images/lik-right.png"
import { Projectile } from "./Projectile";
//import imgShootingPlayer from "../../public/images/lik-shoot.png"
import imgPlayer from "../../public/images/playerSprite.png"
import { Platform } from "./Platforms/Platform";

export class Player {
    position: IPosition
    v: IV
    image: HTMLImageElement
    imageIndex: number
    width: number
    height: number
    maxvy: number
    minvy: number
    weight: number
    minPositionY: number

    shootsPerSecond: number
    isShootingAvailable: boolean
    projectiles: Projectile[]

    markedForDeletion: boolean

    constructor({ position }: { position: IPosition }) {
        this.position = position
        this.v = { x: 0, y: 0}
        this.image = new Image()
        this.image.src = imgPlayer.src
        this.image.width = imgPlayer.width / 3
        this.image.height = imgPlayer.height
        this.imageIndex = 0
        this.width = this.image.width
        this.height = this.image.height
        this.weight = .1

        this.maxvy = 6
        this.minvy = -8
        this.weight = .1
        this.minPositionY = gameSettings.canvas!.height / 2 + 100

        this.shootsPerSecond = 5
        this.isShootingAvailable = true
        this.projectiles = []

        this.markedForDeletion = false
    }

    update(keys: string[], platforms: Platform[]) {
        // movement
        if (keys.includes("KeyD") || keys.includes("ArrowRight")) {
            if (this.imageIndex !== 1) this.imageIndex = 0
            this.v.x = 3
        }
        else if (keys.includes("KeyA") || keys.includes("ArrowLeft")) {
            this.v.x = -3
            if (this.imageIndex !== 1) this.imageIndex = 2
        }
        else this.v.x = 0

        // game borders
        if (this.position.x + this.width / 2 < 0) this.position.x = gameSettings.canvas!.width - this.width / 2
        if (this.position.x + this.width / 2 > gameSettings.canvas!.width) this.position.x = 0

        // physics
        if (this.v.y > this.weight && this.onPlatform(platforms))
            this.v.y = this.minvy   // up

        if (this.v.y < this.maxvy) this.v.y += this.weight // down

        if (this.position.y > this.minPositionY || this.v.y > this.weight)
            this.position.y += this.v.y

        if (this.position.y > 200 + gameSettings.canvas!.height && this.v.y > 0)
            this.markedForDeletion = true

        // shoot 
        if (
            (keys.includes("Space") || keys.includes("ArrowUp") || keys.includes("KeyW")) &&
            this.isShootingAvailable
        )
            this.shoot()

        //position
        this.position.x += this.v.x


        // update
        this.projectiles.forEach(p => p.update())

        // filter
        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion)
    }

    draw() {
        const ctx = gameSettings.ctx as CanvasRenderingContext2D
        ctx.drawImage(
            this.image,
            this.width * this.imageIndex,
            0,
            this.width,
            this.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )

        // draw
        this.projectiles.forEach(p => p.draw())
    }

    onPlatform(platforms: Platform[]) {
        let shouldJump = false
        platforms.forEach(p => {
            if (
                // y check
                this.position.y + this.height >= p.position.y &&
                this.position.y + this.height <= p.position.y + p.image.height &&
                (

                // check player left bottom
                this.position.x >= p.position.x &&
                this.position.x <= p.position.x + p.image.width ||
                // right bottom
                this.position.x + this.width >= p.position.x &&
                this.position.x + this.width <= p.position.x + p.image.width 
                )
            ) {
                const audio = new Audio("/sounds/jump.wav")
                audio.volume = .13
                audio.play()
                shouldJump = true
                return;
            }
        })

        //// canvas bottom
        //if (this.position.y + this.height >= gameSettings.canvas!.height) {
        //    return true
        //}

        return shouldJump
    }   

    shoot() {
        if (!this.isShootingAvailable) return;
        const prevImageIndex = this.imageIndex
        this.imageIndex = 1
        this.projectiles.push(new Projectile({
            color: "blue",
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y
            },
            height: 5,
            width: 2
        }))
        this.isShootingAvailable = false

        setTimeout(() => {
            this.isShootingAvailable = true

            const soundShoot = new Audio("/sounds/arcade-laser.mp3")
            soundShoot.volume = .01
            soundShoot.play()
        }, (1 / this.shootsPerSecond) * 1000)
        setTimeout(() => {
            this.imageIndex = prevImageIndex
        }, 100)
    }
}