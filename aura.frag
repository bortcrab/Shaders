// Indica el nivel de presición de los float.
precision mediump float;
// Variable estandar para la resuloción.
uniform vec2 u_resolution;

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
    
    // Para que se vea un poco más grande el vacío, le restamos 0.5.
    pixelDistance -= 0.5;
    
    /*
    Como en el paso anterior le restamos a todos los valores, en el centro
    ahora tenemos valores negativos. Si aplicamos la transformada de Fourier...
    puro pedito. Si usamos el valor absoluto, esos valores negativos se van a
    convertir en positivos, así que ahora van a tener un degradado, y se verá
    como un halo o un circulito.
    */
    pixelDistance = abs(pixelDistance);
    float d = pixelDistance; // Esto es para simplicidad en el gl_FragColor.
    
    // Es la variable estandar para el output en pantalla.
    /*
    Aquí es vec4() porque rgba. Y como esto se ejecuta por cada pixel, la
    variable d va a tener varios valores (de 0 a 1 en teoría), así que si lo
    ponemos en cada argumento de los colores, obtendremos un gradiente de
    blanco, gris y negro.
    */
    gl_FragColor=vec4(d,d,d,1.);
}