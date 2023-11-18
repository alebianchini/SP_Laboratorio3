export default class Persona {
    constructor(id, nombre, apellido, edad) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
    }

    toString() {
        return `ID: ${this.id}, nombre: ${this.nombre}, apellido: ${this.apellido}, edad: ${this.edad}`;
    }
}