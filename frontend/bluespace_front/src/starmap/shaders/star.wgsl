@group(0) @binding(0) var<storage> modelMatrices:         array<mat4x4<f32>>;
@group(0) @binding(1) var<storage> viewMatrix:            mat4x4<f32>;
@group(0) @binding(2) var<storage> projectionMatrix:      mat4x4<f32>;
@group(0) @binding(3) var<storage> starShaderTypeArray:   array<f32>;
@group(0) @binding(4) var<storage> planetShaderTypeArray: array<f32>; // 若值 < -1，则说明为行星

@group(1) @binding(0) var myTexture:                 texture_2d<f32>;
@group(1) @binding(1) var mySampler:                 sampler;
@group(1) @binding(2) var<storage> environmentArray: array<f32>;
@group(1) @binding(3) var<uniform> cameraPosition:   vec3<f32>;
@group(1) @binding(4) var<uniform> ka:               vec3<f32>; // Ambient Coefficient
@group(1) @binding(5) var<uniform> kd:               vec3<f32>; // Diffuse Coefficient
@group(1) @binding(6) var<uniform> ks:               vec3<f32>; // Specular Coefficient


struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) fPosition: vec4<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) uv: vec2<f32>,
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
    out.position = projectionMatrix * viewMatrix * modelMatrices[index] * position;
    out.fPosition = modelMatrices[index] * position;
    var normalMatrix = mat3x3<f32>(
        modelMatrices[index][0].xyz,
        modelMatrices[index][1].xyz,
        modelMatrices[index][2].xyz,
    );
    out.normal = normalMatrix * normal;
    out.uv = uv;
    out.starType = starShaderTypeArray[index];
    return out;
}


@fragment
fn fragment_main(
    @location(0) fPosition: vec4<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) starType: f32,
) -> @location(0) vec4<f32> {
    var Ka = ka;
    var Kd = kd;
    var Ks = ks;
    var tmp = environmentArray[0];
    var color: vec3<f32> = textureSample(myTexture, mySampler, uv).rgb;
    if(starType <= 0.5) {
        color = STAR_BLACKHOLE(fPosition.xyz, normal);
    } else if(starType <= 1.5) {
        color = STAR_O(fPosition.xyz, normal);
    } else if(starType <= 2.5) {
        color = STAR_B(fPosition.xyz, normal);
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

fn CENTER_BLACK(position: vec3<f32>, normal: vec3<f32>, strength: f32) -> f32 {
    return 1 - saturate(dot(normalize(cameraPosition - position), normalize(normal))) * strength;
}

/**
 * TODO: 远距离时，黑洞中间纯白周围亮黄；近距离时，黑洞中间纯黑周围紫色
 */
fn STAR_BLACKHOLE(position: vec3<f32>, normal: vec3<f32>) -> vec3<f32> {
    return vec3(0.2, 0.0, 0.4) * CENTER_BLACK(position, normal, 1.0);
}
fn STAR_O(position: vec3<f32>, normal: vec3<f32>) -> vec3<f32> {
    return vec3(0.0, 0.9, 1.0) * CENTER_BLACK(position, normal, 0.8);
}
fn STAR_B(position: vec3<f32>, normal: vec3<f32>) -> vec3<f32> {
    return vec3(1.0, 0.0, 0.0) * CENTER_BLACK(position, normal, 0.8);
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
}
fn STAR_M() -> vec3<f32> {
    return vec3(0.7, 0.9, 1.0);
}
