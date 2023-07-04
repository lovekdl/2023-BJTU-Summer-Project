@group(0) @binding(1) var<storage> mvp: array<mat4x4<f32>>;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) fragPosition: vec4<f32>,
};

@vertex
fn main(
    @builtin(instance_index) index: u32,
    @location(0) position: vec4<f32>
) -> VertexOutput {
    var out: VertexOutput;
    out.position = mvp[index] * position;
    out.fragPosition = 0.5 * (position + vec4(1.0));
    return out;
}