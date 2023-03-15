import { SBody } from "./classes/SBody"
import { Simulator } from "./classes/Simulator"
import { Vec2 } from "./classes/Vec2"

function scaleAndResizeCanvas(
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

let screenWidth = window.innerWidth
let screenHeight = window.innerHeight
let scale = 1e-9
let screenCenter = new Vec2(0, 0)

type Circle = {
	pos: Vec2
	radius: number
}

type Style = {
	fillStyle?: string
	strokeStyle?: string
	lineWidth?: number
}

function drawCircle(
	ctx: CanvasRenderingContext2D,
	circle: Circle,
	style: Style,
) {
	ctx.save()
	ctx.translate(screenWidth / 2, screenHeight / 2)

	const pos = circle.pos.sub(screenCenter)
	ctx.beginPath()
	ctx.arc(pos.x * scale, pos.y * scale, circle.radius, 0, 2 * Math.PI)

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

type SpaceObject = {
	body: SBody
	radius: number
	color: string
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
		)
	}
}

const solarSystem: SpaceObject[] = [
	// Sun
	{
		body: new SBody(new Vec2(0, 0), new Vec2(0, 0), 1.989 * 10 ** 30),
		radius: 20,
		color: "yellow",
	},
	// Mercury
	{
		body: new SBody(
			new Vec2(5.79 * 10 ** 10, 0),
			new Vec2(0, 47870),
			3.285 * 10 ** 23,
		),
		radius: 2,
		color: "gray",
	},
	// Venus
	{
		body: new SBody(
			new Vec2(1.082 * 10 ** 11, 0),
			new Vec2(0, 35020),
			4.867 * 10 ** 24,
		),
		radius: 3,
		color: "orange",
	},
	// Earth
	{
		body: new SBody(
			new Vec2(1.496 * 10 ** 11, 0),
			new Vec2(0, 29783),
			5.972 * 10 ** 24,
		),
		radius: 5,
		color: "blue",
	},
	// Moon
	{
		body: new SBody(
			new Vec2(1.496 * 10 ** 11 + 3.84 * 10 ** 8, 0),
			new Vec2(0, 29783 + 1022),
			7.34767309 * 10 ** 22,
		),
		radius: 1,
		color: "gray",
	},
	// Mars
	{
		body: new SBody(
			new Vec2(2.279 * 10 ** 11, 0),
			new Vec2(0, 24130),
			6.39 * 10 ** 23,
		),
		radius: 3,
		color: "red",
	},
	// Jupiter
	{
		body: new SBody(
			new Vec2(7.785 * 10 ** 11, 0),
			new Vec2(0, 13070),
			1.898 * 10 ** 27,
		),
		radius: 10,
		color: "brown",
	},
	// Saturn
	{
		body: new SBody(
			new Vec2(1.433 * 10 ** 12, 0),
			new Vec2(0, 9690),
			5.683 * 10 ** 26,
		),
		radius: 8,
		color: "yellow",
	},
	// Uranus
	{
		body: new SBody(
			new Vec2(2.873 * 10 ** 12, 0),
			new Vec2(0, 6810),
			8.681 * 10 ** 25,
		),
		radius: 6,
		color: "lightblue",
	},
	// Neptune
	{
		body: new SBody(
			new Vec2(4.495 * 10 ** 12, 0),
			new Vec2(0, 5430),
			1.024 * 10 ** 26,
		),
		radius: 6,
		color: "blue",
	},
]

export function setupCanvas(element: HTMLCanvasElement) {
	window.addEventListener("resize", () => {
		screenWidth = window.innerWidth
		screenHeight = window.innerHeight
		scaleAndResizeCanvas(
			element,
			(scale) => ctx.scale(scale, scale),
			screenWidth,
			screenHeight,
		)
	})

	const ctx = element.getContext("2d")!
	scaleAndResizeCanvas(
		element,
		(scale) => ctx.scale(scale, scale),
		screenWidth,
		screenHeight,
	)

	const sim = new Simulator(
		solarSystem.map((obj) => obj.body),
		6.6743 * 10 ** -11,
	)

	let centeredObject = solarSystem[0].body

	function loop() {
		screenCenter = centeredObject.pos
		sim.step(60 * 60)
		// spacegray color
		clearCanvas(ctx, "#1b2b34")
		drawObjects(ctx, solarSystem)
		requestAnimationFrame(loop)
	}

	loop()

	element.addEventListener("wheel", (event) => {
		event.preventDefault()
		scale *= 1 + event.deltaY / 1000
	})

	// pinch zoom
	let lastDistance = 0
	element.addEventListener("touchstart", (event) => {
		if (event.touches.length === 2) {
			const [a, b] = Array.from(event.touches)
			lastDistance = a.clientX - b.clientX
		}
	})
	element.addEventListener("touchmove", (event) => {
		if (event.touches.length === 2) {
			const [a, b] = Array.from(event.touches)
			const distance = a.clientX - b.clientX
			scale *= 1 + (distance - lastDistance) / 1000
			lastDistance = distance
		}
	})

	element.addEventListener("click", (event) => {
		const x = event.offsetX
		const y = event.offsetY
		const pos = new Vec2(x, y)
		const center = new Vec2(screenWidth / 2, screenHeight / 2)
		const screenPos = pos.sub(center)
		const worldPos = screenPos.div(scale).add(screenCenter)
		const closest = solarSystem.reduce(
			(closest, obj) => {
				const dist = obj.body.pos.sub(worldPos).mag()
				if (dist < closest.dist) {
					return { dist, obj }
				}
				return closest
			},
			{ dist: Infinity, obj: null as SpaceObject | null },
		)
		if (closest.obj) {
			centeredObject = closest.obj.body
		}
	})
}
