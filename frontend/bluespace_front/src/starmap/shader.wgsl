@group(0) @binding(0) var<storage> modelMatrixArray:    array<mat4x4<f32>>;
@group(0) @binding(1) var<storage> viewMatrix:          mat4x4<f32>;
@group(0) @binding(2) var<storage> projectionMatrix:    mat4x4<f32>;
@group(0) @binding(3) var<storage> starShaderTypeArray: array<f32>;

@group(1) @binding(0) var myTexture: texture_2d<f32>;
@group(1) @binding(1) var mySampler: sampler;


struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) fragPosition: vec4<f32>,
    @location(1) fragNormal: vec3<f32>,
    @location(2) fragUV: vec2<f32>,
    @location(3) index: f32,
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
    out.index = f32(index);
    return out;
}


@fragment
fn fragment_main(
    @location(0) fragPosition: vec4<f32>,
    @location(1) fragNormal: vec3<f32>,
    @location(2) fragUV: vec2<f32>,
    @location(3) index: f32,
) -> @location(0) vec4<f32> {
    var starType: f32 = starShaderTypeArray[u32(index)];
    var result: vec4<f32> = textureSample(myTexture, mySampler, fragUV);
    if(starType == 1) {
        result = STAR_O();
    } else if(starType == 2) {
        result = STAR_B();
    } else if(starType == 3) {
        result = STAR_A();
    } else if(starType == 4) {
        result = STAR_F();
    } else if(starType == 5) {
        result = STAR_G();
    } else if(starType == 6) {
        result = STAR_K();
    } else {
        result = STAR_M();
    }
    return result;
    // return vec4(1.0);
}

fn STAR_O() -> vec4<f32> {
    return vec4(0.0, 0.9, 1.0, 1.0);
}
fn STAR_B() -> vec4<f32> {
    return vec4(0.73, 1.0, 1.0, 1.0);
}
fn STAR_A() -> vec4<f32> {
    return vec4(1.0, 1.0, 1.0, 1.0);
}
fn STAR_F() -> vec4<f32> {
    return vec4(1.0, 0.89, 0.71, 1.0);
}
fn STAR_G() -> vec4<f32> {
    return vec4(1.0, 1.0, 0.0, 1.0);
}
fn STAR_K() -> vec4<f32> {
    return vec4(1.0, 0.9, 0.0, 1.0);
    // return vec4(1.0, 0.64, 0.0, 1.0);
}
fn STAR_M() -> vec4<f32> {
    return vec4(0.9, 0.8, 0.0, 1.0);
    // return vec4(0.80, 0.4, 0.0, 1.0);
}