export class Input {
    keys: string[]

    constructor() {
        this.keys = []

        window.addEventListener("keydown", (e: KeyboardEvent) => {
            if (!this.keys.includes(e.code)) this.keys.push(e.code)
        })

        window.addEventListener("keyup", (e: KeyboardEvent) => {
            this.keys = this.keys.filter(code => code !== e.code)
        })
    }
}