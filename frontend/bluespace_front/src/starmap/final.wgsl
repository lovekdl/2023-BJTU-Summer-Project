@group(0) @binding(0) var<storage> environmentArray: array<f32>;
@group(0) @binding(1) var mySampler: sampler;
@group(0) @binding(2) var texture0: texture_2d<f32>;
@group(0) @binding(3) var texture2: texture_2d<f32>;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
};


// reference: http://blog.hakugyokurou.net/?p=1364
fn uncharted2Tonemap(x: vec3<f32>) -> vec3<f32> {
    return ((x*(0.15*x+0.1*0.5)+0.2*0.02) / (x*(0.15*x+0.5)+0.2*0.3))-0.02/0.3;
}
fn tonemap(input: vec3<f32>) -> vec3<f32> {
    var color = pow(input, vec3(1.4));
    color *= 6.0;
    var curr = uncharted2Tonemap(color);
    var whiteScale = 1.0/uncharted2Tonemap(vec3(13.134));
    return curr * whiteScale;
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
    var canvasWidth = environmentArray[0];

    var color: vec3<f32> = textureSample(texture0, mySampler, uv).rgb;
    var highlight: vec3<f32> = textureSample(texture2, mySampler, uv).rgb;

    color = color + highlight;

    color = tonemap(color);

    return vec4(color, 1.0);
}
