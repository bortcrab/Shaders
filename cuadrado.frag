// Indica el nivel de presición de los float.
precision mediump float;
// Variable estandar para la resuloción.
uniform vec2 u_resolution;

d

void main(){
    // uv son las coordenadas de la pantalla de 0 a 1 (normalizadas)
    // Aquí estamos poniendo en el centro las coordenadas 0, 0.
    vec2 uv=(2.0*gl_FragCoord.xy-u_resolution.xy)/u_resolution.y;

    float pixelDistance = length(uv);

    pixelDistance -= 0.5;

    pixelDistance = abs(pixelDistance);

    pixelDistance = smoothstep(0.0, 0.1, pixelDistance);

    float d = pixelDistance; // Esto es para simplicidad en el gl_FragColor.

    gl_FragColor = vec4(d, d, d, 1.0);
}