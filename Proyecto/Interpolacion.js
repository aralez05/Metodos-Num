function interpolacionCuadraticaNewton(x0, fx0, x1, fx1, x2, fx2, x) {
    let b0 = fx0;
    let b1 = (fx1 - fx0) / (x1 - x0);
  
    let nume1 = (fx1 - fx2)/(x2-x1);
    let nume2 = (fx1-fx0)/(x1-x0);
    let nume3 = nume1-nume2;
    let b2 = nume3 / (x2-x0);
  
    let resultado = b0 + b1 * (x - x0) + b2 * (x - x0) * (x - x1);
  
    return resultado;
  }
  
  function dibujarGrafica(x0, fx0, x1, fx1, x2, fx2, x, fx) {
    let canvas = document.getElementById("grafica");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    const margen = 50;
    const ancho = canvas.width - 2 * margen;
    const alto = canvas.height - 2 * margen;
  
    const minX = Math.min(x0, x1, x2, x);
    const maxX = Math.max(x0, x1, x2, x);
    const minY = Math.min(fx0, fx1, fx2, fx);
    const maxY = Math.max(fx0, fx1, fx2, fx);
  
    const escalarX = val => margen + ((val - minX) / (maxX - minX)) * ancho;
    const escalarY = val => canvas.height - (margen + ((val - minY) / (maxY - minY)) * alto);
  
    ctx.beginPath();
    ctx.strokeStyle = "#aaa";
    ctx.moveTo(margen, margen);
    ctx.lineTo(margen, canvas.height - margen);
    ctx.lineTo(canvas.width - margen, canvas.height - margen);
    ctx.stroke();
  
    ctx.beginPath();
    ctx.strokeStyle = "purple";
    
    const puntos = 100;
    for (let i = 0; i <= puntos; i++) {
        const xi = minX + (maxX - minX) * (i / puntos);
        const yi = interpolacionCuadraticaNewton(x0, fx0, x1, fx1, x2, fx2, xi);
        
        if (i === 0) {
            ctx.moveTo(escalarX(xi), escalarY(yi));
        } else {
            ctx.lineTo(escalarX(xi), escalarY(yi));
        }
    }
    ctx.stroke();
  
    function dibujarPunto(xVal, yVal, color, label) {
        const px = escalarX(xVal);
        const py = escalarY(yVal);
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = "#000";
        ctx.font = "12px Arial";
        ctx.fillText(label, px + 8, py - 8);
    }
  
    dibujarPunto(x0, fx0, "blue", `(${x0.toFixed(2)}, ${fx0.toFixed(2)})`);
    dibujarPunto(x1, fx1, "blue", `(${x1.toFixed(2)}, ${fx1.toFixed(2)})`);
    dibujarPunto(x2, fx2, "blue", `(${x2.toFixed(2)}, ${fx2.toFixed(2)})`);
    
    dibujarPunto(x, fx, "red", `(${x.toFixed(2)}, ${fx.toFixed(2)})`);
  }
  
  $(document).ready(function () {
    $("#interpolar").click(function () {
        let x0 = parseFloat($("#x0").val());
        let fx0 = parseFloat($("#fx0").val());
        let x1 = parseFloat($("#x1").val());
        let fx1 = parseFloat($("#fx1").val());
        let x2 = parseFloat($("#x2").val());
        let fx2 = parseFloat($("#fx2").val());
        let x = parseFloat($("#x").val());
  
        if (
            isNaN(x0) || isNaN(fx0) || isNaN(x1) || isNaN(fx1) ||
            isNaN(x2) || isNaN(fx2) || isNaN(x)
        ) {
            $("#resultado").text("Por favor, completa todos los campos con números válidos.");
            return;
        }
  
        let y = interpolacionCuadraticaNewton(x0, fx0, x1, fx1, x2, fx2, x);
        
        $("#resultado").html(`El valor interpolado en x = ${x} es <b>${y.toFixed(4)}</b>`);
        $("#celdaX0").text(x0.toFixed(4));
        $("#celdaFx0").text(fx0.toFixed(4));
        $("#celdaX1").text(x1.toFixed(4));
        $("#celdaFx1").text(fx1.toFixed(4));
        $("#celdaX2").text(x2.toFixed(4));
        $("#celdaFx2").text(fx2.toFixed(4));
        $("#celdaXInterp").text(x.toFixed(4));
        $("#celdaFxInterp").text(y.toFixed(4));
        
        dibujarGrafica(x0, fx0, x1, fx1, x2, fx2, x, y);
    });
  });