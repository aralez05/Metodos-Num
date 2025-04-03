$(document).ready(function () {
    $("#descomponer").click(function () {
        let papu = false;
        let vueltapapu = 0;
        while (papu !== true) {
            if (vueltapapu !== 3) {
                let funcion = iteracion(vueltapapu);
                let regex = /([+-]?\d*x\^?\d*)|([+-]?\d+)|(?<==)\s*(?![+-])\d+/g;
                let terminos = funcion.match(regex);
                terminos = terminos.map(term => {
                    if (/^\d+$/.test(term)) {
                        return `+${term}`;
                    }
                    return term;
                });
                if (terminos) {
                    let resultadoHTML = "<ul>";
                    terminos.forEach(termino => {
                        resultadoHTML += `<li>Término: ${termino}</li>`;
                    });
                    resultadoHTML += "</ul>";
                    switch (vueltapapu) {
                        case 0: {
                            $("#resultadoDescomposicion1").html(resultadoHTML);
                            break;
                        }
                        case 1: {
                            $("#resultadoDescomposicion2").html(resultadoHTML);
                            break;
                        }
                        case 2: {
                            $("#resultadoDescomposicion3").html(resultadoHTML);
                            break;
                        }

                    }

                    let terminoExponenteBajo = encontrarExponenteMasBajo(terminos);
                    switch (vueltapapu) {
                        case 0: {
                            if (terminoExponenteBajo) {
                                $("#termino-exponente-bajo1").html(`El término con el exponente más bajo de x (mayor a 0) es: <strong>${terminoExponenteBajo}</strong>`);
                            } else {
                                $("#termino-exponente-bajo1").html("No hay términos con exponente mayor a 0.");
                            }
                        }
                        case 1: {
                            if (terminoExponenteBajo) {
                                $("#termino-exponente-bajo2").html(`El término con el exponente más bajo de x (mayor a 0) es: <strong>${terminoExponenteBajo}</strong>`);
                            } else {
                                $("#termino-exponente-bajo2").html("No hay términos con exponente mayor a 0.");
                            }
                        }
                        case 2: {
                            if (terminoExponenteBajo) {
                                $("#termino-exponente-bajo3").html(`El término con el exponente más bajo de x (mayor a 0) es: <strong>${terminoExponenteBajo}</strong>`);
                            } else {
                                $("#termino-exponente-bajo3").html("No hay términos con exponente mayor a 0.");
                            }
                        }

                    }

                } else {
                    $("#resultadoDescomposicion").html("No se encontraron términos válidos.");
                    $("#termino-exponente-bajo").html("");
                }
                vueltapapu++;
            } else {
                return papu = true;
            }
        }
    });
    function iteracion(ite) {
        switch (ite) {
            case 0: {
                let funcion1 = $("#funcionx").val().trim();
                return funcion1;
                break;
            }
            case 1: {
                let funcion2 = $("#funciony").val().trim();
                return funcion2;
                break;
            }
            case 2: {
                let funcion3 = $("#funcionz").val().trim();
                return funcion3;
                break;
            }

        }
    }
    $("#despejar").click(function () {
        let papu = false;
        let vueltapapu = 0;
        while (papu !== true) {
            if (vueltapapu !== 3) {
                let funcion = iteracion(vueltapapu);
                let resultado = despejarX(funcion, vueltapapu);

               switch (vueltapapu){
                case 0: {
                    if (resultado) {
                    $("#resultadoDespeje1").html(`La función despejada para x es: <strong>${resultado}</strong>`);
                } else {
                    $("#resultadoDespeje1").html("No se pudo despejar x. Asegúrate de ingresar una función válida.");
                }
                break;
                }
                case 1: {
                    if (resultado) {
                        $("#resultadoDespeje2").html(`La función despejada para x es: <strong>${resultado}</strong>`);
                    } else {
                        $("#resultadoDespeje2").html("No se pudo despejar x. Asegúrate de ingresar una función válida.");
                    }
                    break;
                }
                case 2:{
                    if (resultado) {
                        $("#resultadoDespeje3").html(`La función despejada para x es: <strong>${resultado}</strong>`);
                    } else {
                        $("#resultadoDespeje3").html("No se pudo despejar x. Asegúrate de ingresar una función válida.");
                    }
                    break
                }
               }
                vueltapapu++;
            }else{
                return papu = true;
            }

        }
    });

    function encontrarExponenteMasBajo(terminos) {
        let exponenteMasBajo = Infinity;
        let terminoMasBajo = "";

        terminos.forEach(termino => {
            let exponente = extraerExponente(termino);
            if (exponente > 0 && exponente < exponenteMasBajo) {
                exponenteMasBajo = exponente;
                terminoMasBajo = termino;
            }
        });

        return terminoMasBajo;
    }

    function extraerExponente(termino) {
        if (!termino.includes("x")) {
            return 0;
        }
        if (!termino.includes("^")) {
            return 1;
        }
        let regex = /\^(\d+)/;
        let match = termino.match(regex);
        return match ? parseInt(match[1]) : 1;
    }
    function despejarX(funcion, orden) {
        if (!funcion || typeof funcion !== "string") {
            console.error("Error: La función ingresada es inválida o está vacía.");
            return "Error: La ecuación no es válida.";
        }
    
        funcion = funcion.replace(/\s+/g, "").toLowerCase();
    
        let lados = funcion.split("=");
        if (lados.length !== 2) {
            console.error(`Error: La ecuación no tiene un formato válido (falta '='). Entrada: ${funcion}`);
            return "Error: La ecuación debe contener un '='.";
        }
    
        let ladoIzq = lados[0] || "";
        let ladoDer = lados[1] || ""; 
    
        console.log(`Lado izquierdo: ${ladoIzq}, Lado derecho: ${ladoDer}`); 
    
        let terminos = ladoIzq.match(/[-+]?\d*\.?\d*[a-z]\^?\d*|[-+]?\d*\.?\d+/g) || [];
    
        if (!terminos || terminos.length === 0) {
            console.error(`Error: No se encontraron términos con variables en la ecuación: ${ladoIzq}`);
            return "Error: No se encontraron variables en la ecuación.";
        }
    
        console.log(`Términos encontrados: ${terminos}`); 
    
        if (terminos.length <= orden) {
            console.error(`Error: No hay suficientes términos en la ecuación para despejar (se esperaba el término ${orden + 1}).`);
            return `No se encontró suficiente cantidad de variables para despejar en la ecuación ${orden + 1}`;
        }
    
        let terminoObjetivo = terminos[orden];
        console.log(`Término a despejar: ${terminoObjetivo}`);
    
        if (!terminoObjetivo) {
            console.error("Error: término objetivo es undefined");
            return "Error: No se pudo determinar el término a despejar.";
        }
    
        let variableMatch = terminoObjetivo.match(/[a-z]/);
        if (!variableMatch) {
            console.error(`Error: No se encontró una variable en el término: ${terminoObjetivo}`);
            return "No se encontró una variable válida.";
        }
    
        let variable = variableMatch[0];
        return despejarVariable(funcion, variable);
    }
    
    




    function despejarVariable(funcion, variable) {
        if (!funcion || typeof funcion !== "string") {
            return "Error: La ecuación no es válida.";
        }

        funcion = funcion.replace(/\s+/g, "").toLowerCase();
        let lados = funcion.split("=");
        if (lados.length !== 2) return "Error: La ecuación debe contener un '='.";

        let ladoIzq = lados[0] || "";
        let ladoDer = lados[1] || "0";

        
        let terminos = ladoIzq.match(/([-+]?\d*\.?\d*[a-z]\^?\d*|[-+]?\d*\.?\d+)/g) || [];
        let terminoVar = terminos.find(t => t.includes(variable));
        if (!terminoVar) return `La variable ${variable} no se encuentra en la ecuación.`;

        let coeficiente = terminoVar.replace(new RegExp(`${variable}\\^?\\d*`, 'g'), '');
        if (coeficiente === '' || coeficiente === '+') coeficiente = '1';
        else if (coeficiente === '-') coeficiente = '-1';

        let nuevosTerminos = terminos.filter(t => t !== terminoVar)
                                   .map(t => t.startsWith('-') ? `+${t.substring(1)}` : `-${t}`);

        if (ladoDer !== "0") {
            nuevosTerminos.push(ladoDer.startsWith('-') ? ladoDer : `+${ladoDer}`);
        }

        let nuevoLadoDer = nuevosTerminos.join('')
                           .replace(/\+\+/g, '+')
                           .replace(/\-\-/g, '+')
                           .replace(/\+\-/g, '-')
                           .replace(/\-\+/g, '-');

        if (coeficiente !== '1' && coeficiente !== '-1') {
            nuevoLadoDer = `(${nuevoLadoDer})/${coeficiente}`;
        } else if (coeficiente === '-1') {
            nuevoLadoDer = nuevoLadoDer.replace(/([+-]?)([^+-]+)/g, 
                (_, signo, term) => (signo === '+' ? '-' : '+') + term);
        }

        nuevoLadoDer = simplificarEcuacion(nuevoLadoDer.replace(/^\+/, ''));

        return `${variable} = ${nuevoLadoDer}`;
    }
    
    function simplificarParentesis(expresion) {
        if (expresion.startsWith('(') && expresion.endsWith(')')) {
            let contenido = expresion.slice(1, -1);
            if (!contenido.match(/[+\-]/)) {
                return contenido;
            }
        }
        return expresion;
    }
    
    function simplificarExpresion(exp) {
        exp = exp.replace(/^\((.*)\)$/, "$1");
        exp = exp.replace(/([+-])\+/g, "$1")
                 .replace(/([+-])\-/g, function(m, signo) {
                     return signo === "+" ? "-" : "+";
                 });
        return exp;
    }
    
    function encontrarExponenteMasBajo(terminos) {
        let exponenteMasBajo = Infinity;
        let terminoMasBajo = "";
    
        terminos.forEach(termino => {
            let exponente = extraerExponente(termino);
            if (exponente > 0 && exponente < exponenteMasBajo) {
                exponenteMasBajo = exponente;
                terminoMasBajo = termino;
            }
        });
    
        return terminoMasBajo;
    }
    
    function extraerExponente(termino) {
        if (!termino.includes("x")) return 0;
        if (!termino.includes("^")) return 1;
        let regex = /\^(\d+)/;
        let match = termino.match(regex);
        return match ? parseInt(match[1]) : 1;
    }
    
    function simplificarEcuacion(ecuacion) {
        if (ecuacion.startsWith('-(') && ecuacion.endsWith(')')) {
            ecuacion = ecuacion.slice(2, -1).replace(/([+-])/g, m => m === '+' ? '-' : '+');
        }
        
        ecuacion = ecuacion.replace(/\+\+/g, '+')
                          .replace(/\+\-/g, '-')
                          .replace(/\-\+/g, '-')
                          .replace(/\-\-/g, '+')
                          .replace(/([+-])1([a-z])/g, '$1$2');
        
        return ecuacion;
    }
});
