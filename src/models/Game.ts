import { gameSettings, IPosition, IV } from "..";
import { Background } from "./Background";
import { Enemy } from "./Enemies/Enemy";
import { EnemyEasy } from "./Enemies/EnemyEasy";
import { EnemyHard } from "./Enemies/EnemyHard";
import { Input } from "./Input";
import { BrownPlatform } from "./Platforms/BrownPlatform";
import { Platform } from "./Platforms/Platform";
import { Player } from "./Player";

export class Game {
    input: Input
    background: Background
    player: Player
    platforms: Platform[]
    frames: number
    v: IV
    enemies: Enemy[]
    gameStarted: boolean
    gameEnded: boolean

    constructor() {
        this.gameStarted = false
        this.input = new Input()
        this.background = new Background()

        const firstPlatformPosition: IPosition = {
            x: Math.floor(Math.random() * (gameSettings.canvas!.width - 84)),
            y: 200,
        }
        this.platforms = []
        for (let i = 0; i < 20; i++) {
            this.platforms.push(new BrownPlatform(
                {
                    position: {
                        x: Math.floor(Math.random() * (gameSettings.canvas!.width - 84)),
                        y: gameSettings.canvas!.height -
                            Math.floor(Math.random() * 2 * gameSettings.canvas!.height),
                    }
                })
            )
        }
        this.player = new Player({
            position: {
                x: firstPlatformPosition.x + 20,
                y: firstPlatformPosition.y - 100
            }
        })
        this.frames = 0
        this.v = { x: 0, y: 0 }

        this.enemies = []
        this.gameEnded = false
    }

    update() {
        if (this.gameEnded) return;

        // add brown platforms
        if (this.background.shouldAddPlatforms) {
            for (let i = 0; i < 10; i++) {
                this.platforms.push(new BrownPlatform({
                    position: {
                        x: Math.floor(Math.random() * (gameSettings.canvas!.width - 84)),
                        y: -gameSettings.canvas!.height +
                            Math.floor(Math.random() * gameSettings.canvas!.height)
                    }
                }))
            }

            for (let i = 0; i < 1; i++) {
                this.enemies.push(new EnemyEasy({
                    position: {
                        x: Math.floor(Math.random() * (gameSettings.canvas!.width - 100)),
                        y: -gameSettings.canvas!.height +
                            Math.floor(Math.random() * gameSettings.canvas!.height)
                    }
                }))
            }

            for (let i = 0; i < 1; i++) {
                this.enemies.push(new EnemyHard({
                    position: {
                        x: Math.floor(Math.random() * (gameSettings.canvas!.width - 100)),
                        y: -gameSettings.canvas!.height +
                            Math.floor(Math.random() * gameSettings.canvas!.height)
                    }
                }))
            }
        }
 

        // update classes
        this.player.update(this.input.keys, this.platforms)

        if (this.player.position.y <= this.player.minPositionY && this.player.v.y < 0) {
            this.v.y = this.player.v.y
            gameSettings.score -= Math.trunc(this.v.y)
        }
        else this.v.y = 0
        
        this.background.update({ v: this.v })
        this.platforms.forEach(p => p.update({ v: this.v }))
        this.enemies.forEach(e => e.update({ v: this.v }))

        // check hitboxes 
        this.enemies.forEach(e => {
            const player = this.player
            // projectiles 
            player.projectiles.forEach(p => {
                const originP = {
                    x: p.position.x + p.width / 2,
                    y: p.position.y + p.height / 2
                }
                if (
                    // check x
                    originP.x >= e.position.x && originP.x <= e.position.x + e.img.width &&
                    // check y
                    originP.y >= e.position.y && originP.y <= e.position.y + e.img.height
                ) {
                    e.hitsToDie--
                    p.markedForDeletion = true
                }
            })

            // enemy hits player
            if (
                // x
                player.position.x <= e.position.x + e.img.width &&
                player.position.x + player.width >= e.position.x &&
                // y
                player.position.y <= e.position.y + e.img.height
            ) {
                player.markedForDeletion = true
            }
        })

        // filter
        this.platforms = this.platforms.filter(p => !p.markedForDeletion)
        this.enemies = this.enemies.filter(e => !e.markedForDeletion)

        if (this.player.markedForDeletion) {
            this.gameEnded = true
        }

        // increases
        this.frames++
    }

    draw() {
        const ctx = gameSettings.ctx as CanvasRenderingContext2D
        const canvas = gameSettings.canvas as HTMLCanvasElement

        if (this.gameEnded) {
            ctx.save()
            ctx.textAlign = "center"
            ctx.fillStyle = "white"
            ctx.font = "20px Sans-Serif"
            ctx.fillText(`You got: ${gameSettings.score} score`, canvas.width / 2, canvas.height / 2)
            const score = localStorage.getItem("score") || gameSettings.score
            ctx.fillText(`Best Score: ${score} score`, canvas.width / 2, canvas.height / 3)
            ctx.font = "10px Sans-Serif"
            ctx.fillText("PRESS R TO RESTART", canvas.width / 2, canvas.height / 1.5)
            ctx.restore()
            return;
        }


        this.background.draw()
        this.player.draw()
        this.platforms.forEach(p => p.draw())
        this.enemies.forEach(e => e.draw())

        // score

        ctx.font = "20px Helveta"
        ctx.fillText(`Score: ${gameSettings.score}`, 20, 40)
    }
}