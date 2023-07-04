@group(0) @binding(0) var<uniform> color: vec4<f32>;
@group(1) @binding(0) var myTexture: texture_2d<f32>;
@group(1) @binding(1) var mySampler: sampler;



@fragment
fn main(
    @location(0) fragPosition: vec4<f32>,
    @location(1) fragNormal: vec3<f32>,
    @location(2) fragUV: vec2<f32>,
) -> @location(0) vec4<f32> {
    return /*fragPosition * */ color * textureSample(myTexture, mySampler, fragUV);
}