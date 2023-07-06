@group(0) @binding(0) var myTexture: texture_2d<f32>;
@group(0) @binding(1) var mySampler: sampler;


struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) fragPosition: vec4<f32>,
    @location(1) fragUV: vec2<f32>,
};


@vertex
fn vertex_main(
    @builtin(instance_index) index: u32,
    @location(0) position: vec4<f32>,
    @location(1) uv: vec2<f32>,
) -> VertexOutput {
    var out: VertexOutput;
    out.fragPosition = (position + 2 * vec4(1.0)) / 3;
    out.fragUV = uv;
    return out;
}


@fragment
fn fragment_main(
    @location(0) fragPosition: vec4<f32>,
    @location(1) fragUV: vec2<f32>,
) -> @location(0) vec4<f32> {
    var result: vec4<f32> = textureSample(myTexture, mySampler, fragUV);
    return result;
}
