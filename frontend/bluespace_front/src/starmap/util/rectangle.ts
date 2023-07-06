const vertex = new Float32Array([
    // float3 position, float2 uv
    1,1,0,   1,0,
    1,-1,0,  1,1,
    -1,1,0,  0,0,
    -1,-1,0, 0,1,
])

const index = new Uint16Array([
    0, 1, 2,
    1, 2, 3,
])

const vertexCount = 4
const indexCount = 6

export {vertex, index, vertexCount, indexCount}
