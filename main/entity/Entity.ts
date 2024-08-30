// MAX_UINT32 = 4294967295; // 32비트 무부호 정수의 최대값
// PI = 3.14159; // π, 라디안 값
// MAX_VELOCITY_XY = 100000; // x, y 좌표에 대한 속도의 최대 절대값
// MAX_VELOCITY_R = PI / 2; // r (회전)에 대한 속도의 최대 절대값 (90도, π/2 라디안)
// MAX_MASS = 100000; // 무게의 최대값
// MAX_HEALTH = 100000; // 체력의 최대값

interface PointXY {
    x: number; // 자연수 0 <= x < MAX_UINT32
    y: number; // 자연수 0 <= y < MAX_UINT32
}

interface PointXYR {
    x: number; // 자연수 0 <= x < MAX_UINT32
    y: number; // 자연수 0 <= y < MAX_UINT32
    r: number; // 소수(5자리) - 2 * PI < r < 2 * PI
}

class Entity {
    vertices: PointXY[];
    // 점들의 배열 [{x, y}, ...]
    //  자연수 0 <= x, y < MAX_UINT32

    position: PointXYR;
    // 위치 {x, y, r}
    //  자연수 0 <= x, y < MAX_UINT32
    //  소수 (5자리) 0 <= r < 2 * PI

    velocity?: PointXYR;
    // 속도 {x, y, r}
    //  정수 -MAX_VELOCITY_XY < x, y < MAX_VELOCITY_XY
    //  소수 (5자리) -MAX_VELOCITY_R < r < MAX_VELOCITY_R

    mass?: number;
    // 무게
    //  자연수 0 < mass < MAX_MASS

    centroid?: PointXY;
    // 질량 중심 {x, y}
    //  자연수 0 <= x, y < MAX_UINT32

    health?: number;
    // 체력
    //  자연수 0 < health < MAX_HEALTH

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
