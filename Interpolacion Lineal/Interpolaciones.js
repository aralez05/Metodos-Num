$(document).ready(function () {
  $("#calcular").click(function () {
    let xList = $("#valoresX").val().split(',').map(v => parseFloat(v.trim()));
    let fxList = $("#valoresFX").val().split(',').map(v => parseFloat(v.trim()));
    let xInterp = parseFloat($("#xInterpola").val());

    if (
      xList.length < 2 || fxList.length < 2 ||
      isNaN(xList[0]) || isNaN(xList[1]) ||
      isNaN(fxList[0]) || isNaN(fxList[1]) ||
      isNaN(xInterp)
    ) {
      $("#resultado").html("<p style='color:red;'>Por favor asegúrate de ingresar al menos dos valores válidos en x y f(x), y un número válido para x a interpolar.</p>");
      return;
    }

    let x0 = xList[0], x1 = xList[1];
    let fx0 = fxList[0], fx1 = fxList[1];

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
    ctx.strokeStyle = "blue";
    ctx.moveTo(escalarX(x0), escalarY(fx0));
    ctx.lineTo(escalarX(x1), escalarY(fx1));
    ctx.stroke();

    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(escalarX(x0), escalarY(fx0), 5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(escalarX(x1), escalarY(fx1), 5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(escalarX(x), escalarY(fx), 5, 0, 2 * Math.PI);
    ctx.fill();
  }
});
