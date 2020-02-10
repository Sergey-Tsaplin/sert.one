class Point {
	constructor(x, y) {
		this.x = x;
		this.y = (y == undefined ? x : y);
	}

	Add(p) { return new Point(this.x + p.x, this.y + p.y); }
	Sub(p) { return new Point(this.x - p.x, this.y - p.y); }
	Scale(a) { return new Point(this.x * a, this.y * a); }
	IsEqualTo(p) { return Math.abs(this.x - p.x) < kEps && Math.abs(this.y - p.y) < kEps; }
	GetLen() { return Math.sqrt(this.x * this.x + this.y * this.y); }
	SetLen(len) { return this.Scale(len / this.GetLen()); }
	Copy() { return new Point(this.x, this.y); }
	GetAngleTo(p) { return -Math.atan2(p.y - this.y, p.x - this.x); }
}