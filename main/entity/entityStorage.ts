// 1MB 크기의 공유 메모리 버퍼
const bufferSize = 1024 * 1024;
const sharedBuffer = new SharedArrayBuffer(bufferSize);
const buffer = new Uint8Array(sharedBuffer);

// 메타데이터 배열을 위한 공유 메모리 영역 생성 (여기선 각 메타데이터가 8바이트씩 차지)
const metadataSize = 100 * 8; // 예시로 100개의 메타데이터를 저장할 공간
const metadataBuffer = new SharedArrayBuffer(metadataSize);
const metadataView = new DataView(metadataBuffer);

let currentOffset = 0;
let metadataIndex = 0;
