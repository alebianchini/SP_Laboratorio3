import Futbolista from "../futbolista.js";
import Profesional from "../profesional.js";

const URL = "http://localhost/personasFutbolitasProfesionales.php";
let lista = [];
const formDatos = document.forms[0];
const formABM = document.forms[1];
const divTabla = document.getElementById("divTabla");
const spinner = document.getElementById("spanSpinner");
const rdoFutbolista = document.getElementById("rdoFutbolista");
const rdoProfesional = document.getElementById("rdoProfesional");
const inpEquipo = document.getElementById("txtEquipo");
const inpPosicion = document.getElementById("txtPosicion");
const inpCantGoles = document.getElementById("txtCantGoles");
const inpTitulo = document.getElementById("txtTitulo");
const inpFacultad = document.getElementById("txtFacultad");
const inpAñoGrad = document.getElementById("txtAñoGrad");
const labelErrorMessage = document.getElementById("labelErrorMessage");
const tituloABM = document.getElementById("tituloABM");
const btnAceptar = document.getElementById("btnAceptar");

window.addEventListener("DOMContentLoaded", () => {
    getLista();
});

window.addEventListener("click", (e) => {
    if (e.target.matches("#btnAgregar")) {
        if (formABM.hasAttribute("hidden")) {
            switchForms();
        }
        inpTitulo.toggleAttribute("hidden");
        inpFacultad.toggleAttribute("hidden");
        inpAñoGrad.toggleAttribute("hidden");
        tituloABM.textContent = "ALTA";
    }
    else if (e.target.matches(".btnModificar")) {
        cargarFormulario(lista.find((element) => element.id == e.target.parentElement.parentElement.dataset.id));
        tituloABM.textContent = "MODIFICACION";
        if (formABM.hasAttribute("hidden")) {
            switchForms();
        }
    }
    else if (e.target.matches(".btnEliminar")) {
        cargarFormulario(lista.find((element) => element.id == e.target.parentElement.parentElement.dataset.id));
        tituloABM.textContent = "BAJA";
        if (formABM.hasAttribute("hidden")) {
            switchForms();
        }
    }
    else if (e.target.matches("#btnCancelar")) {
        limpiarFormulario();
    }
    else if (e.target.matches("#rdoProfesional")) {
        if (inpTitulo.hasAttribute("hidden") && inpFacultad.hasAttribute("hidden") && inpAñoGrad.hasAttribute("hidden")) {
            inpTitulo.removeAttribute("hidden");
            inpFacultad.removeAttribute("hidden");
            inpAñoGrad.removeAttribute("hidden");
        }
        if (!inpEquipo.hasAttribute("hidden") && !inpPosicion.hasAttribute("hidden") && !inpCantGoles.hasAttribute("hidden")) {
            inpEquipo.setAttribute("hidden", "hidden");
            inpPosicion.setAttribute("hidden", "hidden");
            inpCantGoles.setAttribute("hidden", "hidden");
        }
    }
    else if (e.target.matches("#rdoFutbolista")) {
        if (inpEquipo.hasAttribute("hidden") && inpPosicion.hasAttribute("hidden") && inpCantGoles.hasAttribute("hidden")) {
            inpEquipo.removeAttribute("hidden");
            inpPosicion.removeAttribute("hidden");
            inpCantGoles.removeAttribute("hidden");
        }
        if (!inpTitulo.hasAttribute("hidden") && !inpFacultad.hasAttribute("hidden") && !inpAñoGrad.hasAttribute("hidden")) {
            inpTitulo.setAttribute("hidden", "hidden");
            inpFacultad.setAttribute("hidden", "hidden");
            inpAñoGrad.setAttribute("hidden", "hidden");
        }
    }
    else if (e.target.matches("#btnAceptar")) {
        if (tituloABM.textContent == "BAJA") {
            //Lógica baja
            bajaPersona(parseInt(formABM.txtID.value));
        }
        else if (tituloABM.textContent == "MODIFICACION") {
            //Lógica modificacion
            const { txtID, txtNombre, txtApellido, txtEdad, rdoTipo, txtEquipo, txtPosicion, txtCantGoles, txtTitulo, txtFacultad, txtAñoGrad } = formABM;
            var nuevaPersona = new Object();
            if (rdoFutbolista.checked) {
                nuevaPersona = new Futbolista(txtID.value, txtNombre.value, txtApellido.value, parseInt(txtEdad.value), txtEquipo.value, txtPosicion.value, parseInt(txtCantGoles.value));
                agregarSpinner();
                sendModif(nuevaPersona)
                    .then(function (respuesta) {
                        // La promesa se resuelve correctamente
                        console.log('Respuesta del servidor:', respuesta);
                        console.log(nuevaPersona);
                        let indice = lista.findIndex((item) => {
                            return item.id == nuevaPersona.id;
                        });
                        lista.splice(indice, 1, nuevaPersona);
                        actualizarTabla(lista);
                        limpiarFormulario();
                        eliminarSpinner();
                    })
                    .catch(function (error) {
                        // La promesa es rechazada con el error correspondiente
                        console.error('Error en la solicitud:', error);
                        limpiarFormulario();
                        eliminarSpinner();
                    });
            }
            else {
                nuevaPersona = new Profesional(txtID.value, txtNombre.value, txtApellido.value, parseInt(txtEdad.value), txtTitulo.value, txtFacultad.value, parseInt(txtAñoGrad.value));
                agregarSpinner();
                sendModif(nuevaPersona)
                    .then(function (respuesta) {
                        // La promesa se resuelve correctamente
                        console.log('Respuesta del servidor:', respuesta);
                        console.log(nuevaPersona);
                        let indice = lista.findIndex((item) => {
                            return item.id == nuevaPersona.id;
                        });
                        lista.splice(indice, 1, nuevaPersona);
                        actualizarTabla(lista);
                        limpiarFormulario();
                        eliminarSpinner();
                    })
                    .catch(function (error) {
                        // La promesa es rechazada con el error correspondiente
                        console.error('Error en la solicitud:', error);
                        limpiarFormulario();
                        eliminarSpinner();
                    });
            }
        }
        else {
            //Lógica alta
            const { txtID, txtNombre, txtApellido, txtEdad, rdoTipo, txtEquipo, txtPosicion, txtCantGoles, txtTitulo, txtFacultad, txtAñoGrad } = formABM;
            var nuevaPersona = new Object();
            if (rdoFutbolista.checked) {
                /*if (txtAnoFab.value < 1886 || txtVelMax.value < 1 || txtAltMax.value < 1 || txtAutonomia.value < 1) {
                    showErrorMessage();
                    return false;
                }*/
                nuevaPersona = new Futbolista(undefined, txtNombre.value, txtApellido.value, parseInt(txtEdad.value), txtEquipo.value, txtPosicion.value, parseInt(txtCantGoles.value));
                console.log(nuevaPersona);
                agregarSpinner();
                try {
                    let response = sendAlta(nuevaPersona);
                    response.then(response => {
                        response.json().then(response => {
                            nuevaPersona.id = response.id;
                            if (nuevaPersona.edad < 16 || nuevaPersona.cantidadGoles < 0) {
                                showErrorMessage();
                                limpiarFormulario();
                                eliminarSpinner();
                                alert("Alta Denegada. Hay datos que no cumplen con la documentación");
                                return false;
                            }
                            console.log("nuevo id: " + response.id);
                            lista.push(nuevaPersona);
                            actualizarTabla(lista);
                            limpiarFormulario();
                            eliminarSpinner();
                        });
                    })
                        .catch(err => {
                            console.log(err);
                        })
                } catch (error) {
                    alert(JSON.stringify(error));
                }
            } else {
                /*if (txtAnoFab.value < 1886 || txtVelMax.value < 1 || txtCantPue.value < 0 || txtCantRue.value < 1) {
                    showErrorMessage();
                    return false;
                }*/
                nuevaPersona = new Profesional(undefined, txtNombre.value, txtApellido.value, parseInt(txtEdad.value), txtTitulo.value, txtFacultad.value, parseInt(txtAñoGrad.value));
                agregarSpinner();
                try {
                    let response = sendAlta(nuevaPersona);
                    response.then(response => {
                        response.json().then(response => {
                            nuevaPersona.id = response.id;
                            if (nuevaPersona.edad < 16 || nuevaPersona.añoGraduacion < 1951) {
                                showErrorMessage();
                                limpiarFormulario();
                                eliminarSpinner();
                                alert("Alta Denegada. Hay datos que no cumplen con la documentación");
                                return false;
                            }
                            console.log("nuevo id: " + response.id);
                            lista.push(nuevaPersona);
                            actualizarTabla(lista);
                            limpiarFormulario();
                            eliminarSpinner();
                        });
                    })
                        .catch(err => {
                            console.log(err);
                        })
                } catch (error) {
                    alert(JSON.stringify(error));
                }
            }
        }
    }
});

function getLista() {
    var xhttp = new XMLHttpRequest();
    let data;
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
                data = JSON.parse(xhttp.responseText);
                data.forEach(item => {
                    if (item.hasOwnProperty("equipo") && item.hasOwnProperty("posicion") && item.hasOwnProperty("cantidadGoles")) {
                        const futbolista = new Futbolista(item.id, item.nombre, item.apellido, item.edad, item.equipo, item.posicion, item.cantidadGoles);
                        lista.push(futbolista);
                    } else if (item.hasOwnProperty("titulo") && item.hasOwnProperty("facultad") && item.hasOwnProperty("añoGraduacion")) {
                        const profesional = new Profesional(item.id, item.nombre, item.apellido, item.edad, item.titulo, item.facultad, item.añoGraduacion);
                        lista.push(profesional);
                    }
                });
                actualizarTabla(lista);
            }
            else {
                console.error("Error: No se pudo cargar la lista, " + xhttp.status + ": " + xhttp.statusText);
                alert("Error: No se pudo cargar la lista.");
            }
            eliminarSpinner();
        }
        else {
            agregarSpinner();
        }
    };
    xhttp.open("GET", URL);
    xhttp.send();
}

function actualizarTabla(data) {
    while (divTabla.hasChildNodes()) {
        divTabla.removeChild(divTabla.firstElementChild);
    }
    if (data) {
        console.log(data);
        divTabla.appendChild(crearTabla(data));
    }
}

function crearTabla(data) {
    const tabla = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const columnas = [];
    data.forEach(element => {
        for (const key in element) {
            if (!columnas.includes(key)) {
                columnas.push(key);
            }
        }
    });
    columnas.push("Modificar");
    columnas.push("Eliminar");
    const cabecera = document.createElement("tr");
    columnas.forEach(columna => {
        const th = document.createElement("th");
        const texto = document.createTextNode(columna);
        th.appendChild(texto);
        cabecera.appendChild(th);
    });
    thead.appendChild(cabecera);
    tabla.appendChild(thead);

    data.forEach(element => {
        const tr = document.createElement("tr");
        columnas.forEach(columna => {
            const td = document.createElement("td");
            if (columna === "id") {
                tr.setAttribute("data-id", element[columna]);
                td.textContent = element[columna];
                tr.appendChild(td);
            }
            else if (columna === "Modificar") {
                const tdButton = document.createElement('button');
                tdButton.innerText = columna;
                tdButton.className += " btnModificar";
                tdButton.setAttribute("type", "button");
                td.appendChild(tdButton);
                tr.appendChild(td);
            }
            else if (columna === "Eliminar") {
                const tdDelete = document.createElement('button');
                tdDelete.innerText = columna;
                tdDelete.className += " btnEliminar";
                tdDelete.setAttribute("type", "button");
                td.appendChild(tdDelete);
                tr.appendChild(td);
            }
            else {
                td.textContent = (element[columna] !== undefined && element[columna] !== null) ? element[columna] : "N/A"; // Evita valores undefined
                tr.appendChild(td);
            }
        });
        tbody.appendChild(tr);
    });
    tabla.appendChild(tbody);
    tabla.setAttribute("id", "tablaPersonas");
    return tabla;
}

function cargarFormulario(objeto) {
    const { txtID, txtNombre, txtApellido, txtEdad, rdoTipo, txtEquipo, txtPosicion, txtCantGoles, txtTitulo, txtFacultad, txtAñoGrad } = formABM;

    txtID.value = objeto.id;
    txtNombre.value = objeto.nombre;
    txtApellido.value = objeto.apellido;
    txtEdad.value = objeto.edad;
    if (objeto.cantidadGoles >= 0) {
        txtEquipo.value = objeto.equipo;
        txtPosicion.value = objeto.posicion;
        txtCantGoles.value = objeto.cantidadGoles;
        txtTitulo.toggleAttribute("hidden");
        txtFacultad.toggleAttribute("hidden");
        txtAñoGrad.toggleAttribute("hidden");
        rdoTipo.value = "futbolista";
        rdoFutbolista.checked = true;
        rdoProfesional.disabled = true;
    }
    else if (objeto.añoGraduacion > 0) {
        txtTitulo.value = objeto.titulo;
        txtFacultad.value = objeto.facultad;
        txtAñoGrad.value = objeto.añoGraduacion;
        txtEquipo.toggleAttribute("hidden");
        txtPosicion.toggleAttribute("hidden");
        txtCantGoles.toggleAttribute("hidden");
        rdoTipo.value = "profesional";
        rdoProfesional.checked = true;
        rdoFutbolista.disabled = true;
    }
}

async function sendAlta(objeto) {
    return await fetch(URL, {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(objeto)
    });
}

function sendModif(datos) {
    return new Promise(function (resolve, reject) {
        var xhttp = new XMLHttpRequest();

        xhttp.open('POST', URL, true);
        xhttp.setRequestHeader('Content-Type', 'application/json');

        xhttp.onload = function () {
            if (xhttp.status == 200) {
                // La solicitud fue exitosa
                resolve(xhttp.responseText);
            } else {
                // La solicitud falló
                reject(xhttp.statusText);
            }
        };

        xhttp.onerror = function () {
            reject('Error de red');
        };

        console.log(JSON.stringify(datos));
        xhttp.send(JSON.stringify(datos));
    });
}

function bajaPersona(id) {
    let indice = lista.findIndex((item) => {
        return item.id == id;
    });
    let msgSend = { 'id': id };
    console.log(msgSend);
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
                lista.splice(indice, 1);
                actualizarTabla(lista);
            }
            else {
                console.error("Error " + xhttp.status + ": " + xhttp.statusText);
                alert("Error ID invalido");
            }
            limpiarFormulario();
            eliminarSpinner();
            return lista;
        }
        else {
            agregarSpinner();
        }
    };
    xhttp.open("DELETE", URL);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(JSON.stringify(msgSend));
}

function agregarSpinner() {
    let spinnerGif = document.createElement("img");
    spinnerGif.setAttribute("src", "./assets/1486.gif");
    spinnerGif.setAttribute("alt", "Imagen spinner");
    spinner.appendChild(spinnerGif);
    spinner.style.display = 'block';
}

function eliminarSpinner() {
    spinner.innerHTML = "";
    spinner.style.display = 'none';
}

function switchForms() {
    if (formABM.hasAttribute("hidden")) {
        formABM.removeAttribute("hidden");
    } else {
        formABM.setAttribute("hidden", "hidden");
    }
    if (formDatos.hasAttribute("hidden")) {
        formDatos.removeAttribute("hidden");
    } else {
        formDatos.setAttribute("hidden", "hidden");
    }
}

function limpiarFormulario() {
    formABM.reset();
    formABM.txtID.value = '';
    txtEquipo.removeAttribute("hidden");
    txtPosicion.removeAttribute("hidden");
    txtCantGoles.removeAttribute("hidden");
    txtTitulo.removeAttribute("hidden");
    txtFacultad.removeAttribute("hidden");
    txtAñoGrad.removeAttribute("hidden");
    rdoFutbolista.disabled = false;
    rdoProfesional.disabled = false;
    if (!labelErrorMessage.hasAttribute("hidden")) {
        labelErrorMessage.toggleAttribute("hidden");
    }
    switchForms();
}

function showErrorMessage() {
    if (labelErrorMessage.hasAttribute("hidden")) {
        labelErrorMessage.toggleAttribute("hidden");
    }
}