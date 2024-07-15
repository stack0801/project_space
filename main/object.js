class Object2D {
    constructor(points, weight, position, velocity, rotation = 0, angularVelocity = 0) {
        this.points = points; // 점들의 배열
        this.weight = weight; // 무게
        this.position = position; // 위치 {x, y}
        this.velocity = velocity; // 속도 {x, y}
        this.rotation = rotation; // 회전 각도
        this.angularVelocity = angularVelocity; // 회전 속도
        this.centerOfMass = this.calculateCenterOfMass(); // 질량 중심
    }

    // 질량 중심 계산
    calculateCenterOfMass() {
        let vertices = this.points
        let area = 0;
        let centroidX = 0;
        let centroidY = 0;
    
        const n = vertices.length;
    
        for (let i = 0; i < n; i++) {
            const { x: x1, y: y1 } = vertices[i];
            const { x: x2, y: y2 } = vertices[(i + 1) % n];
    
            const crossProduct = (x1 * y2) - (x2 * y1);
            area += crossProduct;
            centroidX += (x1 + x2) * crossProduct;
            centroidY += (y1 + y2) * crossProduct;
        }
    
        area /= 2;
        centroidX /= (6 * area);
        centroidY /= (6 * area);
    
        return { x: centroidX, y: centroidY };
    }    

    // 위치와 회전 업데이트
    update(dt) {
        // 위치 업데이트
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;

        // 회전 업데이트
        this.rotation += this.angularVelocity * dt;
    }

    // 디버깅용 정보 출력
    debug() {
        console.log(`Position: (${this.position.x}, ${this.position.y}), Velocity: (${this.velocity.x}, ${this.velocity.y}), Rotation: ${this.rotation}`);
    }
}

// 예제 사용
// const points = [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}];
// const weight = 1;
// const position = {x: 0, y: 0};
// const velocity = {x: 0, y: 0};
// const rotation = 0;
// const angularVelocity = 0;

// const object = new Object2D(points, weight, position, velocity, rotation, angularVelocity);
// object.debug();