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
    Con length() obtenemos la distancia desde el origen del lienzo (0, 0)
    hasta algún punto de la pantalla. Como uv va de 0 a 1 y empieza desde
    el centro de la pantalla, el centro será 0 y estará negro. Entonces D
    es la distancia que hay desde el centro de la pantalla hasta cada pixel.
    */
    float pixelDistance = length(uv);

    /*
    Creamos un color nuevo. Lo multiplicamos por el tiempo para agregar    
    dinamismo.
    */
    vec3 col = palette(pixelDistance + u_time);
    
    /*
    Si usamos sin() para generar ondas sinusoidales. Multiplicamos por un
    número cualquiera para generar más ondas, es decir, aumentamos la frecuencia.
    Y dividimos entre ese mismo factor para normalizar la amplitud. Si usamos
    u_time es como ponerle un offset al seno, haciendo que se mueva, y como el
    shader está corriendo en todo momento, pues se puede notar este movimiento.
    */
    pixelDistance = sin(pixelDistance * 8.0 + u_time) / 8.0;

    /*
    Como en el paso anterior le restamos a todos los valores, en el centro
    ahora tenemos valores negativos. Si aplicamos la transformada de Fourier...
    puro pedito. Si usamos el valor absoluto, esos valores negativos se van a
    convertir en positivos, así que ahora van a tener un degradado, y se verá
    como un halo o un circulito.
    */
    pixelDistance = abs(pixelDistance);

    /*
    Ahora en vez de usar step() o smoothstep(), vamos a usar la inversa de pixelDistance.
    Para acomodar los valores, vamos a dividir 0.02. Esto resulta en que los colores
    se inviertan.
    */
    pixelDistance = 0.02 / pixelDistance;

    float d = pixelDistance; // Esto es para simplicidad en el gl_FragColor.

    /*
    Multiplicamos cada componente del color por el valor de d. Esto es como ponerle
    un filtro de color al gradiente que se genera.
    Es equivalente a tener:
    col.r = col.r * d;
    col.g = col.g * d;
    col.b = col.b * d;
    */
    col *= d;

    /*
    Aquí es vec4() porque rgba. Y como esto se ejecuta por cada pixel, la
    variable d va a tener varios valores (de 0 a 1 en teoría), así que si lo
    ponemos en cada argumento de los colores, obtendremos un gradiente de
    blanco, gris y negro.
    */
    gl_FragColor = vec4(col, 1.0);
    // gl_FragColor es la variable estandar para el output en pantalla.
}