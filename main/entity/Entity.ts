interface PointXY {
    x: number;
    y: number;
}

interface PointXYR {
    x: number;
    y: number;
    r: number;
}

class Entity {
    vertices: PointXY[]; // 점들의 배열 [{x, y}, ...] ( 정수 0 < x, y < 4,294,967,295 )
    position: PointXYR; // 위치 {x, y, r} ( 0 < x, y < 4,294,967,295, 0 < r < 6.28319 )
    velocity?: PointXYR; // 속도 {x, y, r} ( -100 < x, y < 100, -6.28319 < r < 6.28319 )
    mass?: number; // 무게 ( 0 < mass < 1000 )
    centroid?: PointXY; // 질량 중심 {x, y} ( 정수 0 < x, y < 10000 )
    health?: number; // 체력 ( 0 < health < 10000 )

    constructor(
        vertices: PointXY[],
        position: PointXYR,
        velocity: PointXYR = { x: 0, y: 0, r: 0 },
        mass: number = 100,
        health: number = 100
    ) {
        this.vertices = vertices;
        this.position = position;
        this.velocity = velocity;
        this.mass = mass;
        this.health = health;
        this.centroid = this.calculateCenterOfMass();
    }

    // 질량 중심 계산 메서드
    calculateCenterOfMass(): PointXY {
        let vertices = this.vertices;
        let area = 0;
        let centroidX = 0;
        let centroidY = 0;

        const n = vertices.length;

        for (let i = 0; i < n; i++) {
            const { x: x1, y: y1 } = vertices[i];
            const { x: x2, y: y2 } = vertices[(i + 1) % n];

            const crossProduct = x1 * y2 - x2 * y1;
            area += crossProduct;
            centroidX += (x1 + x2) * crossProduct;
            centroidY += (y1 + y2) * crossProduct;
        }

        area /= 2;
        if (area !== 0) {
            centroidX /= 6 * area;
            centroidY /= 6 * area;
        } else {
            centroidX = vertices.reduce((sum, vertex) => sum + vertex.x, 0) / n;
            centroidY = vertices.reduce((sum, vertex) => sum + vertex.y, 0) / n;
        }

        return { x: centroidX, y: centroidY };
    }

    // 디버깅용 정보 출력
    printStatus(): void {
        const velocity = this.velocity ?? { x: 0, y: 0, r: 0 };
        const mass = this.mass ?? 0;
        const health = this.health ?? 0;
        const centroid = this.centroid ?? { x: 0, y: 0 };

        console.log(
            `Position: (${this.position.x}, ${this.position.y}, ${this.position.r})`
        );
        console.log(`Velocity: (${velocity.x}, ${velocity.y}, ${velocity.r})`);
        console.log(`Mass: ${mass}`);
        console.log(`Health: ${health}`);
        console.log(`Centroid: (${centroid.x}, ${centroid.y})`);
        console.log(`Vertices: ${JSON.stringify(this.vertices)}`);
    }
}

export { Entity, PointXY, PointXYR };
