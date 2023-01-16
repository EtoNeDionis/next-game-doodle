interface IGameSettings {
    canvas: HTMLCanvasElement | null
    ctx: CanvasRenderingContext2D | null
    score: number
}

export interface IV {
    x: number
    y: number
}

export interface IPosition {
    x: number
    y: number
}

export const gameSettings: IGameSettings = {
    canvas: null,
    ctx: null,
    score: 0,
}