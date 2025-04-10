$(document).ready(function() {
    $('#add-point').click(function() {
        const NPunto = $('<div class="point-input">')
            .append('<input type="number" class="x-input" placeholder="x" step="any">')
            .append('<input type="number" class="y-input" placeholder="y" step="any">')
            .append('<button class="remove-btn">×</button>');
        $('#puntos-container').append(NPunto);
    });

    
    $(document).on('click', '.remove-btn', function() {
        if($('.point-input').length > 1) {
            $(this).parent().remove();
        } else {
            alert("Debe haber al menos un punto");
        }
    });

    
    $('#calculate').click(function() {
        const puntos = getpuntos();
        if(puntos.length < 2) {
            alert("Se necesitan al menos 2 puntos para interpolación");
            return;
        }

        puntos.sort((a, b) => a.x - b.x);

        const PapuDif = calculateDividedDifferences(puntos);
        displayDifferencesTable(puntos, PapuDif);

        const Papulimonial = buildNewtonPapulimonial(puntos, PapuDif);
        $('#Papulimonial').html('<h3>Polinomio de Newton:</h3><p>' + Papulimonial + '</p>');

        plotInterpolation(puntos, Papulimonial);
    });

    $('#interpolate-btn').click(function() {
        const x = parseFloat($('#interpolate-x').val());
        if(isNaN(x)) {
            alert("Ingrese un valor válido para x");
            return;
        }

        const puntos = getpuntos();
        if(puntos.length < 2) {
            alert("Se necesitan al menos 2 puntos para interpolación");
            return;
        }

        puntos.sort((a, b) => a.x - b.x);
        const PapuDif = calculateDividedDifferences(puntos);
        const y = evaluateNewtonPapulimonial(puntos, PapuDif, x);

        $('#interpolation').html(`Para x = ${x}, y ≈ ${y.toFixed(4)}`);
    });

    
    function getpuntos() {
        const puntos = [];
        $('.point-input').each(function() {
            const x = parseFloat($(this).find('.x-input').val());
            const y = parseFloat($(this).find('.y-input').val());
            if(!isNaN(x) && !isNaN(y)) {
                puntos.push({x, y});
            }
        });
        return puntos;
    }

    
    function calculateDividedDifferences(puntos) {
        const n = puntos.length;
        const PapuDif = new Array(n);
        
        
        for(let i = 0; i < n; i++) {
            PapuDif[i] = new Array(n);
            PapuDif[i][0] = puntos[i].y; 
        }

        // Calcular diferencias
        for(let j = 1; j < n; j++) {
            for(let i = 0; i < n - j; i++) {
                PapuDif[i][j] = (PapuDif[i+1][j-1] - PapuDif[i][j-1]) / (puntos[i+j].x - puntos[i].x);
            }
        }

        return PapuDif;
    }

   
    function displayDifferencesTable(puntos, PapuDif) {
        const n = puntos.length;
        let html = '<h3>Tabla de Diferencias Divididas:</h3><table><tr><th>x</th><th>y</th>';
        
        for(let i = 1; i < n; i++) {
            html += `<th>Orden ${i}</th>`;
        }
        html += '</tr>';

        for(let i = 0; i < n; i++) {
            html += `<tr><td>${puntos[i].x}</td><td>${PapuDif[i][0].toFixed(4)}</td>`;
            for(let j = 1; j < n - i; j++) {
                html += `<td>${PapuDif[i][j].toFixed(4)}</td>`;
            }
            for(let j = n - i; j < n; j++) {
                html += '<td></td>';
            }
            html += '</tr>';
        }

        html += '</table>';
        $('#differences-table').html(html);
    }
    function buildNewtonPapulimonial(puntos, PapuDif) {
        let Papulimonial = PapuDif[0][0].toFixed(4);
        let term = '';

        for(let i = 1; i < puntos.length; i++) {
            term += `(x - ${puntos[i-1].x})`;
            const coeff = PapuDif[0][i];
            
            if(coeff >= 0) {
                Papulimonial += ` + ${coeff.toFixed(4)}${term}`;
            } else {
                Papulimonial += ` - ${Math.abs(coeff).toFixed(4)}${term}`;
            }
        }

        return Papulimonial;
    }
    function evaluateNewtonPapulimonial(puntos, PapuDif, x) {
        let Resultado = PapuDif[0][0];
        let product = 1;

        for(let i = 1; i < puntos.length; i++) {
            product *= (x - puntos[i-1].x);
            Resultado += PapuDif[0][i] * product;
        }

        return Resultado;
    }
    function plotInterpolation(puntos, PapulimonialStr) {
        if (puntos.length < 2) return;
        puntos.sort((a, b) => a.x - b.x);
        const canvas = document.getElementById('chart');
        const ctx = canvas.getContext('2d');
        const padding = 40; 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const xMin = Math.min(...puntos.map(p => p.x)) - 1;
        const xMax = Math.max(...puntos.map(p => p.x)) + 1;
        const yMin = Math.min(...puntos.map(p => p.y)) - 1;
        const yMax = Math.max(...puntos.map(p => p.y)) + 1;
        const scaleX = (canvas.width - 2 * padding) / (xMax - xMin);
        const scaleY = (canvas.height - 2 * padding) / (yMax - yMin);
        const toPixelX = (x) => padding + (x - xMin) * scaleX;
        const toPixelY = (y) => canvas.height - padding - (y - yMin) * scaleY;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.moveTo(padding, canvas.height - padding);
        ctx.lineTo(padding, padding);
        ctx.stroke();
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.beginPath();
    
        const PapuDif = calculateDividedDifferences(puntos);
        const Papus = (xMax - xMin) / 100;
    
        for (let x = xMin; x <= xMax; x += Papus) {
            const y = evaluateNewtonPapulimonial(puntos, PapuDif, x);
            const px = toPixelX(x);
            const py = toPixelY(y);
    
            if (x === xMin) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.stroke();

        ctx.fillStyle = 'red';
        puntos.forEach(point => {
            const px = toPixelX(point.x);
            const py = toPixelY(point.y);
            ctx.beginPath();
            ctx.arc(px, py, 5, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.fillText('x', canvas.width - padding + 10, canvas.height - padding);
        ctx.fillText('y', padding, padding - 10);
    }
});