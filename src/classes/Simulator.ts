import { Vec2 } from "./Vec2"
import { SBody } from "./SBody"

export class Simulator {
	private bodies: SBody[]
	private G: number
	private forces: Vec2[]

	constructor(bodies: SBody[], G: number) {
		this.bodies = bodies
		this.G = G
		this.forces = Array<Vec2>(bodies.length).fill(Vec2.zero)
	}

	private calcForce(body1: SBody, body2: SBody): Vec2 {
		const r = body2.pos.sub(body1.pos)
		const distSq = r.magSq()
		const forceMag = (this.G * body1.mass * body2.mass) / distSq
		return r.norm().mul(forceMag)
	}

	public step(dt: number) {
		const len = this.bodies.length
		this.forces.fill(Vec2.zero)

		for (let i = 0; i < len; i++) {
			const body = this.bodies[i]
			for (let j = 0; j < len; j++) {
				if (i !== j) {
					this.forces[i] = this.forces[i].add(
						this.calcForce(body, this.bodies[j]),
					)
				}
			}
		}

		for (let i = 0; i < len; i++) {
			this.bodies[i].applyForce(this.forces[i], dt)
		}
	}
}
