// Indica el nivel de presición de los float.
precision mediump float;
// Variable estandar para la resuloción.
uniform vec2 u_resolution;
// Variable estandar para el tiempo en segundos.
uniform float u_time;

// Función para generar una paleta de colores basada en un valor t entre 0 y 1.
vec3 palette(float t){
    vec3 a=vec3(.5,.5,.5);
    vec3 b=vec3(.5,.5,.5);
    vec3 c=vec3(.2745,.0078,.0078);
    vec3 d=vec3(.7569,.1804,.9882);
    
    return a+b*cos(6.28318*(c*t+d));
}

void main(){
    // uv son las coordenadas de la pantalla de 0 a 1 (normalizadas)
    // Aquí estamos poniendo en el centro las coordenadas 0, 0.
    vec2 uv=(2.*gl_FragCoord.xy-u_resolution.xy)/u_resolution.y;
    
    /*
    Creamos un ángulo de rotación de 180° y lo multiplicamos por el seno
    del tiempo transcurrido.
    */
    float rot = radians(180.0 * sin(u_time * 0.2)); // radians(45.0*sin(u_time));
    // Esta es una matriz de rotación.
    mat2 m = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
    // Multiplicamos la pantalla por la matriz para rotarla.
    uv  = m * uv;
    
    vec3 finalColor = vec3(0.0); // Variable para el color.
    
    //
    for (float i = 0.0; i < 5.0; i++) {
        // Usamos fract() para dividir en patrones.
        uv = fract(1.4 * uv) - 0.5;
        
        /*
        max(abs(uv.x), abs(uv.y)) es la fórmula para el sdf de un cuadrado.
        length(uv) es para el sdf de un círculo.
        */
        float pixelDistance = max(abs(uv.x), abs(uv.y)) * exp(-length(uv)) * length(uv);
        
        /*
        Creamos un color nuevo. Lo multiplicamos por el tiempo los sdfs para
        agregar dinamismo.
        */
        vec3 col = palette(length(uv) * (max(abs(uv.x), abs(uv.y))) + i * 0.5 + u_time * 2.0);
        
        /*
        Si usamos sin() para generar ondas sinusoidales. Multiplicamos por un
        número cualquiera para generar más ondas, es decir, aumentamos la frecuencia.
        Y dividimos entre ese mismo factor para normalizar la amplitud. Si usamos
        u_time es como ponerle un offset al seno, haciendo que se mueva, y como el
        shader está corriendo en todo momento, pues se puede notar este movimiento.
        */
        pixelDistance = sin(pixelDistance * 20.0 + u_time) / 10.0;
        
        /*
        Si usamos el valor absoluto, los valores negativos del centro de las figuras
        se van a convertir en positivos.
        */
        pixelDistance = abs(pixelDistance);
        
        // Esto es para ajustar el brillo y la nitidez de los destellos y el fondo.
        pixelDistance = pow(0.015 / pixelDistance, 1.8);
        
        // Vamos cambiando el color.
        finalColor += col * pixelDistance;
    }
    
    /*
    Aquí es vec4() porque rgba. Y como esto se ejecuta por cada pixel, la
    variable d va a tener varios valores (de 0 a 1 en teoría), así que si lo
    ponemos en cada argumento de los colores, obtendremos un gradiente de
    blanco, gris y negro.
    */
    gl_FragColor=vec4(finalColor,1.);
    // gl_FragColor es la variable estandar para el output en pantalla.
}