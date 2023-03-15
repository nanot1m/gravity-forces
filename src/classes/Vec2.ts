export class Vec2 {
	constructor(public x: number, public y: number) {}

	add(other: Vec2): Vec2 {
		return new Vec2(this.x + other.x, this.y + other.y)
	}

	sub(other: Vec2): Vec2 {
		return new Vec2(this.x - other.x, this.y - other.y)
	}

	mul(scalar: number): Vec2 {
		return new Vec2(this.x * scalar, this.y * scalar)
	}

	div(scalar: number): Vec2 {
		return new Vec2(this.x / scalar, this.y / scalar)
	}

	mag(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y)
	}

	norm(): Vec2 {
		const mag = this.mag()
		if (mag === 0) {
			return new Vec2(0, 0)
		}
		return this.div(mag)
	}
}
