class Object2D {
    constructor(
        vertices, // 필수
        initialPosition, // 필수
        initialVelocity = [0, 0], // 선택
        initialRotation = 0, // 선택
        initialAngularVelocity = 0, // 선택
        mass = 100, // 선택
        initialHealth = 100 // 선택
    ) {
        this.checkRequired(vertices, "vertices");
        this.checkRequired(initialPosition, "initialPosition");

        this.vertices = vertices; // 점들의 배열
        this.mass = mass; // 질량
        this.health = initialHealth; // 초기 체력

        this.position = initialPosition; // 초기 위치 {x, y}
        this.velocity = initialVelocity; // 초기 속도 {x, y}
        this.rotation = initialRotation; // 초기 회전 각도
        this.angularVelocity = initialAngularVelocity; // 초기 회전 속도
    }

    checkRequired(value, name) {
        if (value === undefined || value === null) {
            throw new Error(`${name} is a required parameter.`);
        }
    }
}

// 예시 객체 생성
try {
    const exampleObject = new Object2D(
        [
            { x: 1, y: 2 },
            { x: 3, y: 4 },
        ], // 점들
        { x: 5, y: 6 } // 초기 위치
        // 나머지 매개변수는 선택 사항이므로 생략 가능
    );

    console.log(exampleObject);
} catch (error) {
    console.error(error.message);
}

try {
    const exampleObjectMissingRequired = new Object2D(
        null, // 점들을 제공하지 않아서 오류 발생
        { x: 5, y: 6 } // 초기 위치
    );
} catch (error) {
    console.error(error.message); // "vertices is a required parameter." 출력
}
