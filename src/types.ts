import { SBody } from "./classes/SBody"
import { Vec2 } from "./classes/Vec2"

export type SpaceObject = {
	title?: string
	body: SBody
	radius: number
	color: string
}

export type Circle = {
	pos: Vec2
	radius: number
}

export type Style = {
	fillStyle?: string
	strokeStyle?: string
	lineWidth?: number
}
