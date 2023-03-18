import { SBody } from "./classes/SBody"
import { Vec2 } from "./classes/Vec2"
import { SpaceObjectJsonNode } from "./data/SpaceObjectJsonNode"
import { Color, SpaceObject } from "./types"

function colorNameToHex(color: string): Color {
	const div = document.createElement("div")
	div.style.color = color
	document.body.appendChild(div)

	const colorStyle = window.getComputedStyle(div).color
	document.body.removeChild(div)

	const hex = colorStyle.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)?.map(Number)
	if (hex) {
		return { r: hex[1], g: hex[2], b: hex[3], a: 1 }
	}
	return { r: 0, g: 0, b: 0, a: 1 }
}

export function spaceObjectJsonToSpaceObject(
	json: SpaceObjectJsonNode,
): SpaceObject[] {
	const result: SpaceObject[] = []

	function helper(
		node: SpaceObjectJsonNode,
		distance: number,
		velocity: number,
		distanceToParent: number,
	) {
		distance += node.distance
		velocity += node.velocity

		result.push({
			title: node.title,
			body: new SBody(
				new Vec2(distance, 0),
				new Vec2(0, velocity),
				node.mass,
				distanceToParent * 2,
			),
			radius: node.radius,
			visualRadius: node.visualRadius,
			color: colorNameToHex(node.color),
		})

		node.orbitals?.forEach((node) => {
			helper(node, distance, velocity, node.distance)
		})
	}
	helper(json, 0, 0, 0)
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

export function colorToString(color: Color, opacity?: number) {
	return `rgba(${color.r},${color.g},${color.b},${opacity ?? color.a})`
}
