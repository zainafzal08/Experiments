export async function Shader() {
    const vertex = await (await fetch('vertexShader.glsl')).text();
    const fragment = await (await fetch('fragmentShader.glsl')).text();

    return {
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: vertex,
        fragmentShader: fragment
    }
}