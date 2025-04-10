$(document).ready(function () {
    $("#calcular").click(function () {
      let xLista = $("#valoresX").val().split(',').map(v => parseFloat(v.trim()));
      let fxLista = $("#valoresFX").val().split(',').map(v => parseFloat(v.trim()));
      let xInterp = parseFloat($("#xInterpola").val());
  
      if (
        xLista.length < 2 || fxLista.length < 2 ||
        isNaN(xLista[0]) || isNaN(xLista[1]) ||
        isNaN(fxLista[0]) || isNaN(fxLista[1]) ||
        isNaN(xInterp)
      ) {
        $("#resultado").html("<p style='color:red;'>Por favor asegúrate de ingresar al menos dos valores válidos en x y f(x), y un número válido para x a interpolar.</p>");
        return;
      }
  
      let x0 = xLista[0], x1 = xLista[1];
      let fx0 = fxLista[0], fx1 = fxLista[1];
  
      let numerador = (fx1 - fx0);
      let denominador = (x1 - x0);
      let diferencia = (xInterp - x0);
      let resultado = fx0 + (numerador / denominador) * diferencia;
  
      $("#resultado").html(`
        <p><strong>Sustitución:</strong><br>
        f(${xInterp}) = ${fx0} + ((${fx1} - ${fx0}) / (${x1} - ${x0})) * (${xInterp} - ${x0})</p>
        <p><strong>Resultado:</strong><br>
        f(${xInterp}) = <strong>${resultado.toFixed(4)}</strong></p>
      `);
  
      dibujarGrafica(x0, fx0, x1, fx1, xInterp, resultado);
  
      const celdas = $("#tablaValores tbody td");
      celdas.eq(1).text(x0);
      celdas.eq(3).text(fx0);
      celdas.eq(5).text(x1);
      celdas.eq(7).text(fx1);
      celdas.eq(9).text(xInterp);
      celdas.eq(11).text(resultado.toFixed(4));
      
      $("#x0").text(x0);
      $("#fx0").text(fx0);
      $("#x1").text(x1);
      $("#fx1").text(fx1);
      $("#xInterp").text(xInterp);
      $("#fxInterp").text(resultado.toFixed(4));
    });
  
    function dibujarGrafica(x0, fx0, x1, fx1, x, fx) {
      let canvas = document.getElementById("grafica");
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      const margen = 40;
      const ancho = canvas.width - 2 * margen;
      const alto = canvas.height - 2 * margen;
  
      const minX = Math.min(x0, x1, x);
      const maxX = Math.max(x0, x1, x);
      const minY = Math.min(fx0, fx1, fx);
      const maxY = Math.max(fx0, fx1, fx);
  
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
      ctx.moveTo(escalarX(x0), escalarY(fx0));
      ctx.lineTo(escalarX(x1), escalarY(fx1));
      ctx.stroke();
  
      function Etiquetas(xVal, yVal, color, label) {
          const px = escalarX(xVal);
          const py = escalarY(yVal);
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, 2 * Math.PI);
          ctx.fill();
  
          ctx.fillStyle = "#000";
          ctx.font = "12px monospace";
          ctx.fillText(label, px + 8, py - 8);
      }
  
      Etiquetas(x0, fx0, "green", `(${x0}, ${fx0})`);
      Etiquetas(x1, fx1, "green", `(${x1}, ${fx1})`);
      Etiquetas(x, fx, "red", `(${x.toFixed(2)}, ${fx.toFixed(2)})`);
  }
  });