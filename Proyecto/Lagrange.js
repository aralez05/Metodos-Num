document.addEventListener("DOMContentLoaded", function () {

    const addPointBtn = document.getElementById('add-point');
    const calculateBtn = document.getElementById('calculate');
    const interpolateBtn = document.getElementById('interpolate-btn');
    const pointsContainer = document.getElementById('points-container');
    const polynomialDiv = document.getElementById('polynomial');
    const interpolationResultP = document.getElementById('interpolation-result');
    const canvas = document.getElementById('chart');
    const ctx = canvas.getContext('2d');
  
    addPointBtn.addEventListener('click', addPoint);
    calculateBtn.addEventListener('click', () => {
      const points = getPoints();
      if (points.length < 2) {
        alert("Se necesitan al menos 2 puntos para interpolación");
        return;
      }
      points.sort((a, b) => a.x - b.x);
      const polyStr = buildLagrangePolynomial(points);
      polynomialDiv.innerHTML = '<h3>Polinomio de Lagrange:</h3><p>' + polyStr + '</p>';
      plotInterpolation(points);
    });
    interpolateBtn.addEventListener('click', () => {
      const xVal = parseFloat(document.getElementById('interpolate-x').value);
      if (isNaN(xVal)) {
        alert("Ingrese un valor válido para x");
        return;
      }
      const points = getPoints();
      if (points.length < 2) {
        alert("Se necesitan al menos 2 puntos para interpolación");
        return;
      }
      points.sort((a, b) => a.x - b.x);
      const yVal = evaluateLagrangePolynomial(points, xVal);
      interpolationResultP.textContent = `Para x = ${xVal}, y ≈ ${yVal.toFixed(4)}`;
    });
    pointsContainer.addEventListener('click', function (e) {
      if (e.target && e.target.classList.contains('remove-btn')) {
        const pointDiv = e.target.parentElement;
        if (pointsContainer.querySelectorAll('.point-input').length > 1) {
          pointsContainer.removeChild(pointDiv);
        } else {
          alert("Debe haber al menos un punto");
        }
      }
    });
    function addPoint() {
      const newDiv = document.createElement("div");
      newDiv.className = "point-input";
      
      const xInput = document.createElement("input");
      xInput.type = "number";
      xInput.className = "x-input";
      xInput.placeholder = "x";
      xInput.step = "any";
      
      const yInput = document.createElement("input");
      yInput.type = "number";
      yInput.className = "y-input";
      yInput.placeholder = "y";
      yInput.step = "any";
      
      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-btn";
      removeBtn.textContent = "×";
      
      newDiv.appendChild(xInput);
      newDiv.appendChild(yInput);
      newDiv.appendChild(removeBtn);
      pointsContainer.appendChild(newDiv);
    }
  
    function getPoints() {
      const points = [];
      const pointDivs = pointsContainer.querySelectorAll('.point-input');
      pointDivs.forEach(div => {
        const xVal = parseFloat(div.querySelector('.x-input').value);
        const yVal = parseFloat(div.querySelector('.y-input').value);
        if (!isNaN(xVal) && !isNaN(yVal)) {
          points.push({ x: xVal, y: yVal });
        }
      });
      return points;
    }
    function buildLagrangePolynomial(points) {
      let polyStr = "P(x) = ";
      const n = points.length;
      let terms = [];
  
      for (let i = 0; i < n; i++) {
        let numeratorTerms = [];
        for (let j = 0; j < n; j++) {
          if (j !== i) {
            numeratorTerms.push(`(x - ${points[j].x})`);
          }
        }
        let denominator = [];
        for (let j = 0; j < n; j++) {
          if (j !== i) {
            denominator.push((points[i].x - points[j].x).toFixed(4));
          }
        }
        const termStr = `${points[i].y.toFixed(4)}·[${numeratorTerms.join('·')}] / (${denominator.join('·')})`;
        terms.push(termStr);
      }
      polyStr += terms.join(" + ");
      return polyStr;
    }
  
    function evaluateLagrangePolynomial(points, x) {
      const n = points.length;
      let result = 0;
      for (let i = 0; i < n; i++) {
        let term = points[i].y;
        for (let j = 0; j < n; j++) {
          if (j !== i) {
            term *= (x - points[j].x) / (points[i].x - points[j].x);
          }
        }
        result += term;
      }
      return result;
    }
  
    function plotInterpolation(points) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const padding = 40;
      const xs = points.map(p => p.x);
      const ys = points.map(p => p.y);
  
      let xMin = Math.min(...xs);
      let xMax = Math.max(...xs);
      xMin -= 1; xMax += 1;
  
      let calcY = [];
      const steps = 100;
      let step = (xMax - xMin) / steps;
      for (let x = xMin; x <= xMax; x += step) {
        calcY.push(evaluateLagrangePolynomial(points, x));
      }
      let yMin = Math.min(...ys, ...calcY);
      let yMax = Math.max(...ys, ...calcY);
      yMin -= 1; yMax += 1;
  
      const scaleX = (canvas.width - 2 * padding) / (xMax - xMin);
      const scaleY = (canvas.height - 2 * padding) / (yMax - yMin);
  
      function transformX(x) {
        return padding + (x - xMin) * scaleX;
      }
      function transformY(y) {
        return canvas.height - padding - (y - yMin) * scaleY;
      }
  
      ctx.beginPath();
      ctx.moveTo(transformX(xMin), transformY(0));
      ctx.lineTo(transformX(xMax), transformY(0));
     
      ctx.moveTo(transformX(0), transformY(yMin));
      ctx.lineTo(transformX(0), transformY(yMax));
      ctx.strokeStyle = '#000';
      ctx.stroke();
  
      ctx.beginPath();
      let firstPoint = true;
      for (let x = xMin; x <= xMax; x += step) {
        const y = evaluateLagrangePolynomial(points, x);
        const canvasX = transformX(x);
        const canvasY = transformY(y);
        if (firstPoint) {
          ctx.moveTo(canvasX, canvasY);
          firstPoint = false;
        } else {
          ctx.lineTo(canvasX, canvasY);
        }
      }
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.stroke();
  
      points.forEach(p => {
        const cx = transformX(p.x);
        const cy = transformY(p.y);
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
      });
    }
  
  });
  