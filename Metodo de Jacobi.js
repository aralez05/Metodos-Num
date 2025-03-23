document.addEventListener("DOMContentLoaded", () => {
    const resolverButton = document.getElementById("resolver");
    const resultadoElement = document.getElementById("resultado");

    if (!resolverButton || !resultadoElement) {
        console.error("Elementos del DOM no encontrados.");
        return;
    }

    resolverButton.addEventListener("click", () => {
        // Obtener las funciones despejadas
        const funcion1 = obtenerFuncionDespejada("resultadoDespeje1");
        const funcion2 = obtenerFuncionDespejada("resultadoDespeje2");
        const funcion3 = obtenerFuncionDespejada("resultadoDespeje3");

        // Validar que todas las funciones estén presentes
        if (!funcion1 || !funcion2 || !funcion3) {
            mostrarError("Despeja todas las variables antes de resolver.");
            return;
        }

        // Configuración inicial
        const tolerancia = 0.0001; // Tolerancia
        const maxIter = 100; // Máximo de iteraciones
        let [x0, y0, z0] = [0, 0, 0]; // Valores iniciales
        const iteraciones = []; // Almacena resultados de cada iteración

        // Iteración principal
        for (let i = 0; i < maxIter; i++) {
            // Evaluar las funciones para obtener nuevos valores
            const nuevoX = evaluarFuncionLineal(funcion1, { x: x0, y: y0, z: z0 });
            const nuevoY = evaluarFuncionLineal(funcion2, { x: x0, y: y0, z: z0 });
            const nuevoZ = evaluarFuncionLineal(funcion3, { x: x0, y: y0, z: z0 });

            // Verificar si alguna evaluación falla
            if ([nuevoX, nuevoY, nuevoZ].some(val => isNaN(val) || val === undefined)) {
                mostrarError(`Error al evaluar las funciones en la iteración ${i + 1}. Verifica las ecuaciones.`);
                return;
            }

            // Calcular los errores absolutos
            const errores = [Math.abs(nuevoX - x0), Math.abs(nuevoY - y0), Math.abs(nuevoZ - z0)];

            // Almacenar los resultados de la iteración actual
            iteraciones.push({
                iter: i + 1,
                x: nuevoX.toFixed(6),
                y: nuevoY.toFixed(6),
                z: nuevoZ.toFixed(6),
            });

            // Verificar criterio de convergencia
            if (errores.every(error => error < tolerancia)) {
                mostrarResultados(iteraciones, `Convergencia alcanzada en ${i + 1} iteraciones.`);
                return;
            }

            // Actualizar valores para la siguiente iteración
            [x0, y0, z0] = [nuevoX, nuevoY, nuevoZ];
        }

        // Si no converge dentro del número máximo de iteraciones
        mostrarResultados(iteraciones, "El método de Jacobi no logró converger.");
    });

    const obtenerFuncionDespejada = (id) => {
        const elemento = document.getElementById(id);
        if (!elemento) {
            console.error(`Elemento con id '${id}' no encontrado.`);
            return null;
        }
        const texto = elemento.innerText?.trim();
        if (!texto) return null;

        // Extraer solo la parte derecha de la ecuación (después del "=")
        const match = texto.match(/=\s*(.*)/);
        if (!match || !match[1]) {
            console.error(`Formato de función inválido: ${texto}`);
            return null;
        }
        return formatearFuncionLineal(match[1]);
    };

    const formatearFuncionLineal = funcion => {
        // Reemplazar "-3x" por "-3 * x", "+16" por "16", etc.
        funcion = funcion.replace(/([+-]?\d+)([a-z])/g, "$1*$2"); // Coeficientes como -3x -> -3*x
        funcion = funcion.replace(/\/\s*\+/g, "/"); // Eliminar "+" después de "/"
        funcion = funcion.replace(/\+\s*\+/g, "+"); // Eliminar "+" redundantes
        funcion = funcion.replace(/\-\s*\-/g, "+"); // Reemplazar "--" por "+"
        return funcion;
    };

    const evaluarFuncionLineal = (funcion, valores) => {
        try {
            let expresion = funcion;
            for (const [variable, valor] of Object.entries(valores)) {
                expresion = expresion.replace(new RegExp(`\\b${variable}\\b`, "g"), `(${valor})`);
            }
            console.log("Expresión a evaluar:", expresion); // Depuración
            return eval(expresion); // Evaluar la expresión final
        } catch (error) {
            console.error("Error al evaluar la función:", error.message);
            return NaN; // Retornar NaN si hay un error
        }
    };

    const mostrarError = mensaje => {
        resultadoElement.innerHTML = `<p style="color:red;">${mensaje}</p>`;
    };

    const mostrarResultados = (iteraciones, mensajeFinal) => {
        let html = `<p>${mensajeFinal}</p>`;
        html += `<table border="1">
            <tr><th>Iteración</th><th>x</th><th>y</th><th>z</th></tr>`;
        iteraciones.forEach(({ iter, x, y, z }) => {
            html += `<tr><td>${iter}</td><td>${x}</td><td>${y}</td><td>${z}</td></tr>`;
        });
        html += `</table>`;
        resultadoElement.innerHTML = html;
    };
});