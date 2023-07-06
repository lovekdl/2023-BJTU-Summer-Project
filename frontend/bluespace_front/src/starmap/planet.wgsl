@group(0) @binding(0) var<storage> modelMatrixArray:    array<mat4x4<f32>>;
@group(0) @binding(1) var<storage> viewMatrix:          mat4x4<f32>;
@group(0) @binding(2) var<storage> projectionMatrix:    mat4x4<f32>;
@group(0) @binding(3) var<storage> starShaderTypeArray: array<f32>;

@group(1) @binding(0) var myTexture: texture_2d<f32>;
@group(1) @binding(1) var mySampler: sampler;
@group(1) @binding(2) var<storage> environmentArray: array<f32>;


struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) fragPosition: vec4<f32>,
    @location(1) fragNormal: vec3<f32>,
    @location(2) fragUV: vec2<f32>,
    @location(3) starType: f32,
};


@vertex
fn vertex_main(
    @builtin(instance_index) index: u32,
    @location(0) position: vec4<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) uv: vec2<f32>,
) -> VertexOutput {
    var tmp = environmentArray[0];
    var out: VertexOutput;
    out.position = projectionMatrix * viewMatrix * modelMatrixArray[index] * position;
    out.fragPosition = (position + 2 * vec4(1.0)) / 3;
    out.fragUV = uv;
    out.starType = starShaderTypeArray[index];
    return out;
}


@fragment
fn fragment_main(
    @location(0) fragPosition: vec4<f32>,
    @location(1) fragNormal: vec3<f32>,
    @location(2) fragUV: vec2<f32>,
    @location(3) starType: f32,
) -> @location(0) vec4<f32> {
    var tmp = environmentArray[0];
    var color: vec3<f32> = textureSample(myTexture, mySampler, fragUV).rgb;
    if(starType <= 0.5) {
        color = STAR_BLACKHOLE();
    } else if(starType <= 1.5) {
        color = STAR_O();
    } else if(starType <= 2.5) {
        color = STAR_B();
    } else if(starType <= 3.5) {
        color = STAR_A();
    } else if(starType <= 4.5) {
        color = STAR_F();
    } else if(starType <= 5.5) {
        color = STAR_G();
    } else if(starType <= 6.5) {
        color = STAR_K();
    } else {
        color = STAR_M();
    }
    return vec4(color, 1.0);
    // return vec4(1.0);
}

fn STAR_BLACKHOLE() -> vec3<f32> {
    return vec3(0.1, 0.1, 0.1);
}
fn STAR_O() -> vec3<f32> {
    return vec3(0.0, 0.9, 1.0);
}
fn STAR_B() -> vec3<f32> {
    return vec3(1.0, 0.0, 0.0);
}
fn STAR_A() -> vec3<f32> {
    return vec3(1.0, 1.0, 1.0);
}
fn STAR_F() -> vec3<f32> {
    return vec3(1.0, 0.89, 0.71);
}
fn STAR_G() -> vec3<f32> {
    return vec3(1.0, 0.9, 0.0);
}
fn STAR_K() -> vec3<f32> {
    return vec3(0.9, 0.8, 0.0);
    // return vec3(1.0, 0.64, 0.0);
}
fn STAR_M() -> vec3<f32> {
    return vec3(0.7, 0.9, 1.0);
    // return vec3(0.80, 0.4, 0.0);
}