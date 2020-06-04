
export async function WaveShader() {
    const vertex = await (await fetch('vertexShader.glsl')).text();
    const fragment = await (await fetch('fragmentShader.glsl')).text();
    console.log(fragment);
    return {
        uniforms: {
            time: {value: 0}
        },
        vertexShader: vertex,
        fragmentShader: fragment
    }
}