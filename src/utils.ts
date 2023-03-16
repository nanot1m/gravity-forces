import { SBody } from "./classes/SBody"
import { Vec2 } from "./classes/Vec2"
import { SpaceObjectJsonNode } from "./data/SpaceObjectJsonNode"
import { SpaceObject } from "./types"

export function spaceObjectJsonToSpaceObject(
	json: SpaceObjectJsonNode,
): SpaceObject[] {
	const result: SpaceObject[] = []

	function helper(
		node: SpaceObjectJsonNode,
		distance: number,
		velocity: number,
	) {
		distance += node.distance
		velocity += node.velocity

		result.push({
			title: node.title,
			body: new SBody(new Vec2(distance, 0), new Vec2(0, velocity), node.mass),
			radius: node.radius,
			visualRadius: node.visualRadius,
			color: node.color,
		})

		node.orbitals?.forEach((node) => {
			helper(node, distance, velocity)
		})
	}
	helper(json, 0, 0)

	return result
}

export function scaleAndResizeCanvas(
	canvas: HTMLCanvasElement,
	scaleFn: (scale: number) => void,
	width: number,
	height: number,
) {
	const scale = window.devicePixelRatio
	canvas.width = width * scale
	canvas.height = height * scale
	canvas.style.width = `${width}px`
	canvas.style.height = `${height}px`
	scaleFn(scale)
}
