function evaluarFuncion(funcion, x) {
    try {
        funcion = funcion.replace(/\^/g, "**") // Reemplaza exponentes
                         .replace(/(\d)(x)/g, '$1*x') // Agrega multiplicación entre números y x
                         .replace(/(x)(\d)/g, 'x*$2'); // Agrega multiplicación entre x y números (en caso de que x esté primero)
        return Function("x", "return " + funcion)(x);
    } catch (e) {
        alert("Error en la función ingresada");
        return NaN;
    }
}
//-----------------------------------------------------------------------------
function metodoBiseccion() {
    let funcion = document.getElementById("funcion").value;
    let a = parseFloat(document.getElementById("a").value);
    let b = parseFloat(document.getElementById("b").value);

    if (isNaN(a) || isNaN(b)) {
        alert("Debe ingresar un intervalo válido [a, b]");
        return;
    }

    let f_a = evaluarFuncion(funcion, a);
    let f_b = evaluarFuncion(funcion, b);

    if (f_a * f_b > 0) {
        alert("El intervalo ingresado no es válido. La función debe tener signos opuestos en a y b.");
        return;
    }

    let tolerancia = 0.05;
    let iteraciones = [];
    let xr, f_xr, error = 100;
    let iter = 0;

    while (error > tolerancia) {
        xr = (a + b) / 2;
        f_xr = evaluarFuncion(funcion, xr);

        if (isNaN(f_xr)) {
            return;
        }

        if (f_xr * f_a < 0) {
            b = xr;
            f_b = f_xr;
        } else {
            a = xr;
            f_a = f_xr;
        }

        if (iter > 0) {
            error = Math.abs((b - a)/ xr) * 100;
        }

        iteraciones.push({ iter, a, b, xr, error });
        iter++;
    }

    let tabla = `<tr>
                <th>Iteración</th>
                <th>a</th>
                <th>b</th>
                <th>Xr</th>
                <th>Error (%)</th>
                </tr>`;
                
    iteraciones.forEach(row => {
        tabla += `<tr>
                    <td>${row.iter}</td>
                    <td>${row.a.toFixed(6)}</td>
                    <td>${row.b.toFixed(6)}</td>
                    <td>${row.xr.toFixed(6)}</td>
                    <td>${row.error.toFixed(6)}</td>
                </tr>`;
    });

    document.getElementById("resultado").innerHTML = tabla;
    let tabulacion = `<tr>
    <th>X</th>
    <th>Y</th>
</tr>`;

// Obtener el último valor de xr (la raíz aproximada)
const ultimoXr = iteraciones[iteraciones.length - 1].xr;
const ultimoYr = evaluarFuncion(funcion, ultimoXr); // Evaluamos la función en xr

if (!isNaN(ultimoYr)) { // Verificamos si el resultado es un número válido
tabulacion += `<tr>
    <td>${ultimoXr.toFixed(6)}</td>
    <td>${ultimoYr.toFixed(6)}</td>
</tr>`;
} else {
tabulacion += `<tr>
    <td colspan="2">No se pudo calcular Y (f(x) no válida en Xr)</td>
</tr>`;
}



document.getElementById("tabulacion").innerHTML = tabulacion;
}

