export class Projection {
    constructor(
        public min: number,
        public max: number
    ) { }   

    overlap(other: Projection): boolean {
        return (this.min < other.max && this.min > other.min)
            || (other.min < this.max && other.min > this.min)
    }

    getOverlap(other: Projection): number {
        if (!this.overlap(other)) return 0

        return Math.min(this.max, other.max) - Math.max(this.min, other.min)
    }
}