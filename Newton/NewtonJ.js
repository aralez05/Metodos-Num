$(document).ready(function() {
    // Agregar nuevo punto
    $('#add-point').click(function() {
        const newPoint = $('<div class="point-input">')
            .append('<input type="number" class="x-input" placeholder="x" step="any">')
            .append('<input type="number" class="y-input" placeholder="y" step="any">')
            .append('<button class="remove-btn">×</button>');
        $('#points-container').append(newPoint);
    });

    // Eliminar punto
    $(document).on('click', '.remove-btn', function() {
        if($('.point-input').length > 1) {
            $(this).parent().remove();
        } else {
            alert("Debe haber al menos un punto");
        }
    });

    // Calcular interpolación
    $('#calculate').click(function() {
        const points = getPoints();
        if(points.length < 2) {
            alert("Se necesitan al menos 2 puntos para interpolación");
            return;
        }

        // Ordenar puntos por x
        points.sort((a, b) => a.x - b.x);

        // Calcular diferencias divididas
        const diffs = calculateDividedDifferences(points);
        displayDifferencesTable(points, diffs);

        // Construir polinomio
        const polynomial = buildNewtonPolynomial(points, diffs);
        $('#polynomial').html('<h3>Polinomio de Newton:</h3><p>' + polynomial + '</p>');

        // Graficar
        plotInterpolation(points, polynomial);
    });

    // Calcular valor interpolado
    $('#interpolate-btn').click(function() {
        const x = parseFloat($('#interpolate-x').val());
        if(isNaN(x)) {
            alert("Ingrese un valor válido para x");
            return;
        }

        const points = getPoints();
        if(points.length < 2) {
            alert("Se necesitan al menos 2 puntos para interpolación");
            return;
        }

        points.sort((a, b) => a.x - b.x);
        const diffs = calculateDividedDifferences(points);
        const y = evaluateNewtonPolynomial(points, diffs, x);

        $('#interpolation-result').html(`Para x = ${x}, y ≈ ${y.toFixed(4)}`);
    });

    // Función para obtener puntos ingresados
    function getPoints() {
        const points = [];
        $('.point-input').each(function() {
            const x = parseFloat($(this).find('.x-input').val());
            const y = parseFloat($(this).find('.y-input').val());
            if(!isNaN(x) && !isNaN(y)) {
                points.push({x, y});
            }
        });
        return points;
    }

    // Calcular diferencias divididas
    function calculateDividedDifferences(points) {
        const n = points.length;
        const diffs = new Array(n);
        
        // Inicializar matriz
        for(let i = 0; i < n; i++) {
            diffs[i] = new Array(n);
            diffs[i][0] = points[i].y; // Diferencias de orden 0
        }

        // Calcular diferencias
        for(let j = 1; j < n; j++) {
            for(let i = 0; i < n - j; i++) {
                diffs[i][j] = (diffs[i+1][j-1] - diffs[i][j-1]) / (points[i+j].x - points[i].x);
            }
        }

        return diffs;
    }

    // Mostrar tabla de diferencias
    function displayDifferencesTable(points, diffs) {
        const n = points.length;
        let html = '<h3>Tabla de Diferencias Divididas:</h3><table><tr><th>x</th><th>y</th>';
        
        // Encabezados
        for(let i = 1; i < n; i++) {
            html += `<th>Orden ${i}</th>`;
        }
        html += '</tr>';

        // Filas de datos
        for(let i = 0; i < n; i++) {
            html += `<tr><td>${points[i].x}</td><td>${diffs[i][0].toFixed(4)}</td>`;
            for(let j = 1; j < n - i; j++) {
                html += `<td>${diffs[i][j].toFixed(4)}</td>`;
            }
            // Celdas vacías para alinear
            for(let j = n - i; j < n; j++) {
                html += '<td></td>';
            }
            html += '</tr>';
        }

        html += '</table>';
        $('#differences-table').html(html);
    }

    // Construir representación del polinomio
    function buildNewtonPolynomial(points, diffs) {
        let polynomial = diffs[0][0].toFixed(4);
        let term = '';

        for(let i = 1; i < points.length; i++) {
            term += `(x - ${points[i-1].x})`;
            const coeff = diffs[0][i];
            
            if(coeff >= 0) {
                polynomial += ` + ${coeff.toFixed(4)}${term}`;
            } else {
                polynomial += ` - ${Math.abs(coeff).toFixed(4)}${term}`;
            }
        }

        return polynomial;
    }

    // Evaluar polinomio en un punto x
    function evaluateNewtonPolynomial(points, diffs, x) {
        let result = diffs[0][0];
        let product = 1;

        for(let i = 1; i < points.length; i++) {
            product *= (x - points[i-1].x);
            result += diffs[0][i] * product;
        }

        return result;
    }

    // Graficar puntos y polinomio
    function plotInterpolation(points, polynomialStr) {
        if(points.length < 2) return;

        // Ordenar puntos por x
        points.sort((a, b) => a.x - b.x);

        // Calcular rango para la gráfica
        const xMin = points[0].x - 1;
        const xMax = points[points.length-1].x + 1;
        const step = (xMax - xMin) / 100;

        // Preparar datos para Plotly
        const xValues = [];
        const yValues = [];
        
        // Obtener coeficientes para evaluación
        const diffs = calculateDividedDifferences(points);
        
        // Calcular puntos del polinomio
        for(let x = xMin; x <= xMax; x += step) {
            xValues.push(x);
            yValues.push(evaluateNewtonPolynomial(points, diffs, x));
        }

        // Datos de los puntos originales
        const originalPoints = {
            x: points.map(p => p.x),
            y: points.map(p => p.y),
            mode: 'markers',
            type: 'scatter',
            name: 'Puntos dados',
            marker: { size: 10, color: 'red' }
        };

        // Datos del polinomio interpolante
        const interpolatedCurve = {
            x: xValues,
            y: yValues,
            mode: 'lines',
            type: 'scatter',
            name: 'Polinomio interpolante',
            line: { color: 'blue' }
        };

        // Configuración del gráfico
        const layout = {
            title: 'Interpolación de Newton',
            xaxis: { title: 'x' },
            yaxis: { title: 'P(x)' },
            showlegend: true
        };

        // Dibujar gráfico
        Plotly.newPlot('chart', [originalPoints, interpolatedCurve], layout);
    }
});