import * as dat from "dat.gui"

import { Simulator } from "./classes/Simulator"
import { Vec2 } from "./classes/Vec2"
import { solarSystemJson } from "./data/solar-system"
import { Circle, SpaceObject, Style } from "./types"
import { scaleAndResizeCanvas, spaceObjectJsonToSpaceObject } from "./utils"

const G = 6.6743 * 10 ** -11 // N * m^2 / kg^2

let screenWidth = window.innerWidth
let screenHeight = window.innerHeight
let scale = 1e-9
let screenCenter = new Vec2(0, 0)
let stepTime = 2 // seconds
let stepsPerFrame = 1800 // 30 minutes
let followPlanetIdx = 0
let gui: dat.GUI
let selectedPlanet: dat.GUI

export function setupCanvas(element: HTMLCanvasElement) {
	const ctx = element.getContext("2d")!
	scaleAndResizeCanvas(
		element,
		(scale) => ctx.scale(scale, scale),
		screenWidth,
		screenHeight,
	)

	const solarSystemObjects = spaceObjectJsonToSpaceObject(solarSystemJson)
	// window.solarSystemObjects = solarSystemObjects

	const sim = new Simulator(
		solarSystemObjects.map((spaceObject) => spaceObject.body),
		G,
	)

	let passedTime = 0

	function loop() {
		for (let i = 0; i < stepsPerFrame; i++) sim.step(stepTime)

		passedTime += stepTime * stepsPerFrame
		screenCenter = solarSystemObjects[followPlanetIdx].body.pos

		clearCanvas(ctx, "#1b2b34")
		drawObjects(ctx, solarSystemObjects)
		printPassedTime(ctx, passedTime)
		printScale(ctx)

		requestAnimationFrame(loop)
	}

	loop()
	attachListeners(ctx, solarSystemObjects)
	initGui(solarSystemObjects)
}

function initGui(objects: SpaceObject[]) {
	gui = new dat.GUI({
		autoPlace: true,
		hideable: true,
	})

	const sim = {
		get stepTime() {
			return stepTime
		},
		set stepTime(value: number) {
			stepTime = value
		},

		get stepsPerFrame() {
			return stepsPerFrame
		},
		set stepsPerFrame(value: number) {
			stepsPerFrame = value
		},

		get followObject() {
			return objects[followPlanetIdx].title ?? "Untitled"
		},
		set followObject(value: string) {
			followPlanetIdx = Math.max(
				objects.findIndex((obj) => obj.title === value),
				0,
			)
			selectPlanet(objects)
		},
	}
	const simFolder = gui.addFolder("Simulation")
	simFolder.add(sim, "stepTime", 1, 10, 1)
	simFolder.add(sim, "stepsPerFrame", 60, 7200, 60)
	simFolder.add(
		sim,
		"followObject",
		objects.map((x) => x.title),
	)
	simFolder.open()
}

function selectPlanet(objects: SpaceObject[]) {
	if (selectedPlanet) {
		gui.removeFolder(selectedPlanet)
	}
	selectedPlanet = gui.addFolder("Selected Planet")
	selectedPlanet.add(objects[followPlanetIdx], "title")
	selectedPlanet.add(objects[followPlanetIdx].body, "mass")
	selectedPlanet.open()
}

function drawCircle(
	ctx: CanvasRenderingContext2D,
	circle: Circle,
	style: Style,
	minRadius: number,
) {
	ctx.save()
	ctx.translate(screenWidth / 2, screenHeight / 2)

	const pos = circle.pos.sub(screenCenter)

	const radius = Math.max(circle.radius * scale, minRadius)

	ctx.beginPath()
	ctx.arc(pos.x * scale, pos.y * scale, radius, 0, 2 * Math.PI)

	if (style.fillStyle) {
		ctx.fillStyle = style.fillStyle
		ctx.fill()
	}

	if (style.strokeStyle) {
		ctx.strokeStyle = style.strokeStyle
		if (style.lineWidth) {
			ctx.lineWidth = style.lineWidth
		}
		ctx.stroke()
	}

	ctx.restore()
}

function clearCanvas(ctx: CanvasRenderingContext2D, backgroundColor: string) {
	ctx.save()
	ctx.fillStyle = backgroundColor
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
	ctx.restore()
}

function drawObjects(ctx: CanvasRenderingContext2D, objects: SpaceObject[]) {
	for (const obj of objects) {
		drawCircle(
			ctx,
			{ pos: obj.body.pos, radius: obj.radius },
			{
				fillStyle: obj.color,
				strokeStyle: "white",
				lineWidth: 1,
			},
			obj.visualRadius,
		)
	}
}

function printPassedTime(ctx: CanvasRenderingContext2D, passedTime: number) {
	const days = Math.floor(passedTime / 86400)
	const hours = Math.floor((passedTime % 86400) / 3600)

	ctx.fillStyle = "white"
	ctx.font = "12px monospace"
	ctx.fillText(`Passed time: ${days} days ${hours} hours`, 20, 20)
}

function printScale(ctx: CanvasRenderingContext2D) {
	ctx.fillStyle = "white"
	ctx.font = "12px monospace"
	const [val, pow] = scale.toString().split("e")
	ctx.fillText(`Scale: ${(+val).toFixed(2)} * ${10}`, 20, 40)
	ctx.font = "8px monospace"
	ctx.fillText(`${pow}`, 138, 35)
}

function attachListeners(
	ctx: CanvasRenderingContext2D,
	solarSystemObjects: SpaceObject[],
) {
	ctx.canvas.addEventListener("wheel", (event) => {
		event.preventDefault()
		scale *= 1 + event.deltaY / 1000
	})

	// pinch zoom
	let lastDistance = 0
	ctx.canvas.addEventListener("touchstart", (event) => {
		if (event.touches.length === 2) {
			const [a, b] = Array.from(event.touches)
			lastDistance = new Vec2(a.clientX, a.clientY)
				.sub(new Vec2(b.clientX, b.clientY))
				.mag()
		}
	})
	ctx.canvas.addEventListener("touchmove", (event) => {
		if (event.touches.length === 2) {
			const [a, b] = Array.from(event.touches)
			const distance = new Vec2(a.clientX, a.clientY)
				.sub(new Vec2(b.clientX, b.clientY))
				.mag()
			scale *= 1 + (distance - lastDistance) / 100
			lastDistance = distance
		}
	})

	ctx.canvas.addEventListener("click", (event) => {
		const x = event.offsetX
		const y = event.offsetY
		const pos = new Vec2(x, y)
		const center = new Vec2(screenWidth / 2, screenHeight / 2)
		const screenPos = pos.sub(center)
		const worldPos = screenPos.div(scale).add(screenCenter)
		const closest = solarSystemObjects.reduce(
			(closest, obj, index) => {
				const dist = obj.body.pos.sub(worldPos).mag()
				if (dist < closest.dist) {
					return { dist, index }
				}
				return closest
			},
			{ dist: Infinity, index: -1 },
		)
		if (closest.index > -1) {
			followPlanetIdx = closest.index
		}

		gui.updateDisplay()
		selectPlanet(solarSystemObjects)
	})

	window.addEventListener("resize", () => {
		screenWidth = window.innerWidth
		screenHeight = window.innerHeight
		scaleAndResizeCanvas(
			ctx.canvas,
			(scale) => ctx.scale(scale, scale),
			screenWidth,
			screenHeight,
		)
	})
}
