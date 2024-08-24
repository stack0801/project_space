import { Entity } from "./Entity";

// 1MB 크기의 공유 메모리 버퍼
const bufferSize = 1024 * 1024;
const sharedBuffer = new SharedArrayBuffer(bufferSize);
const buffer = new Uint8Array(sharedBuffer);

// 메타데이터 배열을 위한 공유 메모리 영역 생성 (여기선 각 메타데이터가 8바이트씩 차지)
const metadataSize = 100 * 2; // 예시로 100개의 메타데이터를 저장할 공간 (각 메타데이터 2개의 32비트 값)
const metadataBuffer = new SharedArrayBuffer(metadataSize * 4); // Uint32Array를 사용하므로 4바이트 곱함
const metadataArray = new Uint32Array(metadataBuffer);

let currentOffset = 0;
let metadataIndex = 0;

// 메타데이터와 객체를 공유 메모리에 저장하는 함수
function storeEntity(entity: Entity): number {
    const serializedEntity = JSON.stringify(entity);
    const size = serializedEntity.length;

    if (currentOffset + size > bufferSize) {
        throw new Error(
            "Buffer overflow: Cannot store the entity in the buffer."
        );
    }

    // 객체 데이터를 버퍼에 저장
    for (let i = 0; i < size; i++) {
        buffer[currentOffset + i] = serializedEntity.charCodeAt(i);
    }

    // 메타데이터 저장 (4바이트씩 저장)
    metadataArray[metadataIndex * 2] = currentOffset; // 시작 위치 저장
    metadataArray[metadataIndex * 2 + 1] = size; // 크기 저장

    currentOffset += size;

    return metadataIndex++; // 현재 메타데이터 인덱스를 반환하고 증가
}

// 메타데이터를 기반으로 객체 로드 함수
function loadEntityWithMetadata(index: number): Entity | null {
    const start = metadataArray[index * 2];
    const size = metadataArray[index * 2 + 1];

    let serializedEntity = "";
    for (let i = start; i < start + size; i++) {
        serializedEntity += String.fromCharCode(buffer[i]);
    }

    return JSON.parse(serializedEntity);
}

// 메타데이터와 객체 삭제 함수
function removeEntityWithMetadata(index: number): void {
    // 메타데이터에서 제거 (실제 데이터 삭제는 생략)
    metadataArray[index * 2] = 0; // 시작 위치 0으로 설정
    metadataArray[index * 2 + 1] = 0; // 크기 0으로 설정
}
