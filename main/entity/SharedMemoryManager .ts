import { Entity } from "./Entity";
import { EntitySerializer } from "./entitySerializer";

class SharedMemoryManager {
    private memory1: Uint32Array; // 직렬화된 Entity 데이터를 저장할 메모리
    private memory2: Uint32Array; // Entity 시작 주소와 꼭짓점 개수를 저장할 메모리

    constructor(memorySize1: number, memorySize2: number) {
        this.memory1 = new Uint32Array(memorySize1);
        this.memory2 = new Uint32Array(memorySize2);
    }

    saveEntity(entity: Entity, entityIndex: number): void {
        // 직렬화된 Entity 데이터를 생성
        const serializedData = EntitySerializer.serialize(entity);

        // Memory1에 Entity 데이터 저장
        const startAddress = this.getAvailableAddress(serializedData.length);
        this.memory1.set(serializedData, startAddress);

        // Memory2에 시작 주소와 꼭짓점 개수 저장
        const vertexCount = entity.vertices.length;
        this.memory2[entityIndex * 2] = startAddress;
        this.memory2[entityIndex * 2 + 1] = vertexCount;
    }

    loadEntity(entityIndex: number): Entity {
        // Memory2에서 시작 주소와 꼭짓점 개수 가져오기
        const startAddress = this.memory2[entityIndex * 2];
        const vertexCount = this.memory2[entityIndex * 2 + 1];

        // Memory1에서 Entity 데이터 읽어오기
        const entityData = this.memory1.slice(
            startAddress,
            startAddress + vertexCount * 2 + 7
        );

        // 직렬화된 데이터를 역직렬화하여 Entity 객체로 복원
        return EntitySerializer.deserialize(entityData);
    }

    private getAvailableAddress(dataLength: number): number {
        // 간단한 예시: 현재 저장된 데이터의 길이 다음 주소를 반환
        // 실제 구현에서는 빈 공간을 효율적으로 찾는 로직이 필요할 수 있음
        return this.memory1.length - dataLength;
    }
}
