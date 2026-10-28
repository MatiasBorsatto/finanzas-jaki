class ErrorValidacion extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = 'ErrorValidacion';
    this.status = 400;
  }
}

class ErrorNoEncontrado extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = 'ErrorNoEncontrado';
    this.status = 404;
  }
}

class ErrorConflicto extends ErrorValidacion {
  constructor(mensaje) {
    super(mensaje);
    this.name = 'ErrorConflicto';
    this.status = 409;
  }
}

class ErrorNoAutenticado extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = 'ErrorNoAutenticado';
    this.status = 401;
  }
}

module.exports = { ErrorValidacion, ErrorNoEncontrado, ErrorConflicto, ErrorNoAutenticado };
