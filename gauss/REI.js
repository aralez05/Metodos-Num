$(document).ready(function () {
    $("#resolver").click(function () {
        const funciones = [
            $("#funcion1").val().trim(),
            $("#funcion2").val().trim(),
            $("#funcion3").val().trim()
        ];

        const A = [];
        const b = [];
        for (let i = 0; i < 3; i++) {
            const { coeficientes, terminoIndependiente } = parseFuncion(funciones[i]);
            A.push(coeficientes);
            b.push(terminoIndependiente);
        }

        let x = [0, 0, 0];

      
        const tol = 1e-6; 
        const itera = 1000; 
        const verItera = 20; 

        $("#iteraciones tbody").empty();

        for (let k = 0; k < itera; k++) {
            let Xviejas = [...x];

            // Actualizar x, y, z
            x[0] = (b[0] - A[0][1] * x[1] - A[0][2] * x[2]) / A[0][0]; 
            x[1] = (b[1] - A[1][0] * x[0] - A[1][2] * x[2]) / A[1][1]; 
            x[2] = (b[2] - A[2][0] * x[0] - A[2][1] * x[1]) / A[2][2]; 
            if (k < verItera) {
                $("#iteraciones tbody").append(`
                    <tr>
                        <td>${k + 1}</td>
                        <td>${x[0].toFixed(6)}</td>
                        <td>${x[1].toFixed(6)}</td>
                        <td>${x[2].toFixed(6)}</td>
                    </tr>
                `);
            }
            if (Math.abs(x[0] - Xviejas[0]) < tol &&
                Math.abs(x[1] - Xviejas[1]) < tol &&
                Math.abs(x[2] - Xviejas[2]) < tol) {
                $("#solucion").html(`x = ${x[0].toFixed(4)}, y = ${x[1].toFixed(4)}, z = ${x[2].toFixed(4)}`);
                return;
            }
        }
        $("#solucion").html("No se alcanzó la convergencia.");
    });
    function parseFuncion(funcion) {
        funcion = funcion.replace(/\s+/g, ""); 
        const lados = funcion.split("=");
        if (lados.length !== 2) {
            throw new Error("Formato de función inválido. Debe incluir un '='.");
        }
        const ladoIzq = lados[0];
        const ladoDer = parseFloat(lados[1]);
        const coeficientes = [
            extraerCoeficiente(ladoIzq, "x"),
            extraerCoeficiente(ladoIzq, "y"),
            extraerCoeficiente(ladoIzq, "z")
        ];

        return { coeficientes, terminoIndependiente: ladoDer };
    }
    function extraerCoeficiente(expresion, variable) {
        const regex = new RegExp(`([+-]?\\d*)${variable}`);
        const match = expresion.match(regex);
        if (!match) return 0; 
        const coeficiente = match[1];
        if (coeficiente === "" || coeficiente === "+") return 1;
        if (coeficiente === "-") return -1;
        return parseFloat(coeficiente);
    }
});