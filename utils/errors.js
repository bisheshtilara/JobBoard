export class UserError extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class AlreadyExistsError extends UserError {
  constructor() {
    super('User already exists.')
  }
}

export class NotFoundError extends UserError {
  constructor() {
    super('User not found.')
  }
}

export class MissingPassword extends UserError {
  constructor() {
    super('User is missing a password.')
  }
}

export class MissingInfo extends UserError {
  constructor() {
    super('Request is missing some informations')
  }
}

export class IncorrectPassword extends UserError {
  constructor() {
    super('Incorrect user password.')
  }
}
