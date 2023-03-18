import { Vec2 } from "./Vec2"

const TAIL_CAPACITY = 1000

export class SBody {
	public pos: Vec2
	public vel: Vec2
	public mass: number

	#tailChunkSize: number
	#tail: Vec2[] = []
	#passedDistance = 0
	#lastTailUpdate = 0

	get tail(): Readonly<Vec2[]> {
		return this.#tail
	}

	constructor(pos: Vec2, vel: Vec2, mass: number, tailLength: number) {
		this.pos = pos
		this.vel = vel
		this.mass = mass

		this.#tailChunkSize = tailLength / TAIL_CAPACITY
	}

	applyForce(force: Vec2, dt: number) {
		this.#updateTail()

		const accel = force.div(this.mass)
		this.vel = this.vel.add(accel.mul(dt))
		this.pos = this.pos.add(this.vel.mul(dt))

		this.#passedDistance += this.vel.mag() * dt
	}

	#updateTail() {
		if (this.#passedDistance - this.#lastTailUpdate > this.#tailChunkSize) {
			this.#tail.push(this.pos)
			if (this.#tail.length > TAIL_CAPACITY) {
				this.#tail.shift()
			}
			this.#lastTailUpdate = this.#passedDistance
		}
	}
}
