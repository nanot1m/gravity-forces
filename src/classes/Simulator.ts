import { Vec2 } from "./Vec2"
import { SBody } from "./SBody"

export class Simulator {
	private bodies: SBody[]
	private G: number

	constructor(bodies: SBody[], G: number) {
		this.bodies = bodies
		this.G = G
	}

	private calcForce(body1: SBody, body2: SBody): Vec2 {
		const r = body2.pos.sub(body1.pos)
		const dist = r.mag()
		const forceMag = (this.G * body1.mass * body2.mass) / dist ** 2
		return r.norm().mul(forceMag)
	}

	public step(dt: number) {
		for (let i = 0; i < this.bodies.length; i++) {
			const body1 = this.bodies[i]
			let force = new Vec2(0, 0)
			for (let j = 0; j < this.bodies.length; j++) {
				if (i !== j) {
					const body2 = this.bodies[j]
					force = force.add(this.calcForce(body1, body2))
				}
			}
			body1.applyForce(force, dt)
		}
	}
}
