@group(0) @binding(0) var<storage> modelMatrixArray: array<mat4x4<f32>>;
@group(0) @binding(1) var<storage> viewMatrix:       mat4x4<f32>;
@group(0) @binding(2) var<storage> projectionMatrix: mat4x4<f32>;

@group(1) @binding(0) var myTexture: texture_2d<f32>;
@group(1) @binding(1) var mySampler: sampler;


struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) fragPosition: vec4<f32>,
    @location(1) fragNormal: vec3<f32>,
    @location(2) fragUV: vec2<f32>,
};


@vertex
fn vertex_main(
    @builtin(instance_index) index: u32,
    @location(0) position: vec4<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) uv: vec2<f32>,
) -> VertexOutput {
    var out: VertexOutput;
    out.position = projectionMatrix * viewMatrix * modelMatrixArray[index] * position;
    out.fragPosition = (position + 2 * vec4(1.0)) / 3;
    out.fragUV = uv;
    return out;
}


@fragment
fn fragment_main(
    @location(0) fragPosition: vec4<f32>,
    @location(1) fragNormal: vec3<f32>,
    @location(2) fragUV: vec2<f32>,
) -> @location(0) vec4<f32> {
    return textureSample(myTexture, mySampler, fragUV);
}
