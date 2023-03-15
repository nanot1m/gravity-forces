import { Vec2 } from "./Vec2"

export class SBody {
	public pos: Vec2
	public vel: Vec2
	public mass: number

	constructor(pos: Vec2, vel: Vec2, mass: number) {
		this.pos = pos
		this.vel = vel
		this.mass = mass
	}

	applyForce(force: Vec2, dt: number) {
		const accel = force.div(this.mass)
		this.vel = this.vel.add(accel.mul(dt))
		this.pos = this.pos.add(this.vel.mul(dt))
	}
}
