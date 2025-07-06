// Indica el nivel de presición de los float.
precision mediump float;
// Variable estandar para la resuloción.
uniform vec2 u_resolution;
// Variable estandar para el tiempo en segundos.
uniform float u_time;

// Función para generar una paleta de colores basada en un valor t entre 0 y 1.
vec3 palette( float t ) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(0.2745, 0.0078, 0.0078);
    vec3 d = vec3(0.7569, 0.1804, 0.9882);

    return a + b*cos( 6.28318*(c*t+d) );
}


void main(){
    // uv son las coordenadas de la pantalla de 0 a 1 (normalizadas)
    // Aquí estamos poniendo en el centro las coordenadas 0, 0.
    vec2 uv=(2.*gl_FragCoord.xy-u_resolution.xy)/u_resolution.y;
    
    /*
    uv0 es para mantener la paleta de colores en el centro de la pantalla
    y no se vea afectada por la transformación de uv.
    */
    vec2 uv0 = uv;

    vec3 finalColor = vec3(0.0);

    for (float i = 0.0; i < 3.0; i++) {
        // Usamos fract() para dividir en patrones.
        uv = fract(1.5 * uv) - 0.5;
        
        /*
        Con length() obtenemos la distancia desde el origen del lienzo (0, 0)
        hasta algún punto de la pantalla. Como uv va de 0 a 1 y empieza desde
        el centro de la pantalla, el centro será 0 y estará negro. Entonces D
        es la distancia que hay desde el centro de la pantalla hasta cada pixel.
        */
        float pixelDistance = length(uv) * exp(-length(uv0));

        /*
        Creamos un color nuevo. Lo multiplicamos por el tiempo para agregar    
        dinamismo.
        */
        vec3 col = palette(length(uv0) + i * 0.5 + u_time);
        
        /*
        Si usamos sin() para generar ondas sinusoidales. Multiplicamos por un
        número cualquiera para generar más ondas, es decir, aumentamos la frecuencia.
        Y dividimos entre ese mismo factor para normalizar la amplitud. Si usamos
        u_time es como ponerle un offset al seno, haciendo que se mueva, y como el
        shader está corriendo en todo momento, pues se puede notar este movimiento.
        */
        pixelDistance = sin(pixelDistance * 8.0 + u_time) / 8.0;

        pixelDistance = abs(pixelDistance);

        // Esto es para ajustar el brillo.
        pixelDistance = pow(0.015 / pixelDistance, 1.4);
        
        finalColor += col * pixelDistance;
    }

    /*
    Aquí es vec4() porque rgba. Y como esto se ejecuta por cada pixel, la
    variable d va a tener varios valores (de 0 a 1 en teoría), así que si lo
    ponemos en cada argumento de los colores, obtendremos un gradiente de
    blanco, gris y negro.
    */
    gl_FragColor = vec4(finalColor, 1.0);
    // gl_FragColor es la variable estandar para el output en pantalla.
}