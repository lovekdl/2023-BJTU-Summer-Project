@group(0) @binding(0) var<storage> environmentArray: array<f32>;
@group(0) @binding(1) var mySampler: sampler;
@group(0) @binding(2) var myTexture: texture_2d<f32>;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
};

const offset: array<f32, 9> = array<f32, 9>(0.0, 1.4896, 3.4757, 5.4619, 7.4482, 9.4345, 11.421, 13.4075, 15.3941);
const weight: array<f32, 9> = array<f32, 9>(0.066812, 0.129101, 0.112504, 0.08782, 0.061406, 0.03846, 0.021577, 0.010843, 0.004881);
 
fn blur(image: texture_2d<f32>, uv: vec2<f32>, blurDirect: bool) -> vec3<f32> {
    var color: vec3<f32> = textureSample(image, mySampler, uv).rgb * weight[0];
    var direct: vec2<f32>;
    if(blurDirect) {
        direct = vec2(1.0, 0.0) / vec2(environmentArray[0], environmentArray[1]);
    } else {
        direct = vec2(0.0, 1.0) / vec2(environmentArray[0], environmentArray[1]);
    }
    for(var i = 1; i <= 8; i++) {
        color += textureSample(image, mySampler, uv + direct * offset[i]).rgb * weight[i];
        color += textureSample(image, mySampler, uv - direct * offset[i]).rgb * weight[i];
    }
    return color;
}


@vertex
fn vertex_main(
    @builtin(instance_index) index: u32,
    @location(0) position: vec4<f32>,
    @location(1) uv: vec2<f32>,
) -> VertexOutput {
    var out: VertexOutput;
    out.position = position;
    out.uv = uv;
    return out;
}


@fragment
fn fragment_main(
    @location(0) uv: vec2<f32>,
) -> @location(0) vec4<f32> {
    var color: vec3<f32> = textureSample(myTexture, mySampler, uv).rgb;

    var highlight = blur(myTexture, uv, false);

    color = color + highlight;

    return vec4(color, 1.0);
}
