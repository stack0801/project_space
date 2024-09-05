import { PI, MAX_VELOCITY_XY } from "./constants";
import { Entity, PointXY } from "./Entity";

class EntitySerializer {
    // 직렬화: Entity 객체를 Uint32Array로 변환
    static serialize(entity: Entity): Uint32Array {
        const serializedData = new Uint32Array(entity.vertices.length * 2 + 7); // 필요한 크기로 배열 생성

        let index = 0;

        // vertices 직렬화
        entity.vertices.forEach((vertex) => {
            serializedData[index++] = vertex.x;
            serializedData[index++] = vertex.y;
        });

        // position 직렬화
        serializedData[index++] = entity.position.x;
        serializedData[index++] = entity.position.y;
        serializedData[index++] = this.serializeRotation(entity.position.r);

        // velocity 직렬화
        if (entity.velocity) {
            serializedData[index++] = this.serializeVelocity(entity.velocity.x);
            serializedData[index++] = this.serializeVelocity(entity.velocity.y);
            serializedData[index++] = this.serializeRotation(entity.velocity.r);
        } else {
            serializedData[index++] = 0;
            serializedData[index++] = 0;
            serializedData[index++] = this.serializeRotation(0);
        }

        // mass 직렬화
        serializedData[index++] = entity.mass || 0;

        // health 직렬화
        serializedData[index++] = entity.health || 0;

        return serializedData;
    }

    // 역직렬화: Uint32Array를 Entity 객체로 변환
    static deserialize(data: Uint32Array): Entity {
        let index = 0;

        const vertices: PointXY[] = [];
        for (let i = 0; i < (data.length - 7) / 2; i++) {
            vertices.push({ x: data[index++], y: data[index++] });
        }

        const position = {
            x: data[index++],
            y: data[index++],
            r: EntitySerializer.deserializeRotation(data[index++]),
        };

        const velocity = {
            x: EntitySerializer.deserializeVelocity(data[index++]),
            y: EntitySerializer.deserializeVelocity(data[index++]),
            r: EntitySerializer.deserializeRotation(data[index++]),
        };

        const mass = data[index++];
        const health = data[index++];

        return new Entity(vertices, position, velocity, mass, health);
    }

    // 회전값 직렬화
    private static serializeRotation(r: number): number {
        return Math.floor((r + PI) * 100000); // 음수 회전을 0 이상으로 변환하고 소수점 제거
    }

    // 회전값 역직렬화
    private static deserializeRotation(r: number): number {
        return r / 100000 - PI; // 원래 범위로 복원
    }

    // 속도값 직렬화
    private static serializeVelocity(v: number): number {
        return Math.floor((v + MAX_VELOCITY_XY) * 100000); // 음수 속도를 0 이상으로 변환
    }

    // 속도값 역직렬화
    private static deserializeVelocity(v: number): number {
        return v / 100000 - MAX_VELOCITY_XY; // 원래 범위로 복원
    }
}

export { EntitySerializer };
