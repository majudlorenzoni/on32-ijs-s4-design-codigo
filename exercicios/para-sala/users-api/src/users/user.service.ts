import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

//para validar o email
function validateEmail(email: string): void {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email');    
  }
  if (this.users.some((user) => user.email === email)) {
    throw new Error('Email already in use');
  }
}

//para validar a senha e a supersenha
function validatePassword(password: string): void  {
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password,
    )
  ) {
    throw new Error('Invalid password');
  }
}


function cpfUsado(cpf: string): void  { 
  if (this.users.some((user) => user.cpf === cpf)) {
    throw new Error('CPF already in use');
  }
}

function cpfIncorreto(cpf: string): void {
  if (!/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/.test(cpf)) {
    throw new Error('Invalid CPF');
  }
}

 function cpfSemPontos(cpf: string): string {
  const cpfWithoutDots = cpf.replace(/[^\d]+/g, '');
  if (cpfWithoutDots.length !== 11) {
    throw new Error('Invalid CPF');
  }
  return cpfWithoutDots;
}

function cpfInvalidos(cpfTratado) {
  const algarismosInvalidos = ['00000000000', '11111111111', '22222222222', '33333333333', '44444444444', '55555555555', '66666666666', '77777777777', '88888888888', '99999999999']
  if (algarismosInvalidos.includes(cpfTratado)) {
    throw new Error('Invalid CPF');
  }
}

function calculoPrimeiroDigito(sum, remainder, cpfTratado){
  for (let i = 1; i <= 9; i++) {
    sum +=
      parseInt(cpfTratado.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cpfTratado.substring(9, 10))) {
    throw new Error('Invalid CPF');
  }
  sum = 0;
}

function calculoSegundoDigito(sum, remainder, cpfTratado){
  // Calcula o segundo dígito verificador
  for (let i = 1; i <= 10; i++) {
    sum +=
      parseInt(cpfTratado.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (
    remainder !== parseInt(cpfTratado.substring(10, 11))
  ) {
    throw new Error('Invalid CPF');
  }
}

function calcularDigitosVerificadores(cpfTratado){
  let sum = 0;
  let remainder;
  calculoPrimeiroDigito(sum, remainder, cpfTratado);
  calculoSegundoDigito(sum, remainder, cpfTratado);
}

function validateCPF(cpf: string){
  cpfUsado(cpf);
  cpfIncorreto(cpf);
  let cpfTratado = cpfSemPontos(cpf);
  cpfInvalidos(cpfTratado);
  calcularDigitosVerificadores(cpfTratado);
}

@Injectable()
export class UserService {
  private users: User[] = [];

  createUser(
    name: string,
    email: string,
    password: string,
    cpf: string,
    userType: 'customer' | 'manager' | 'admin',
    superPassword?: string,
  ): User {
    validateEmail(email)
    validatePassword(password)
    if (superPassword) {
      validatePassword(superPassword);
    }
    validateCPF(cpf)

                  let sum = 0;
                  let remainder;
                  // Calcula o primeiro dígito verificador
                  for (let i = 1; i <= 9; i++) {
                    sum +=
                      parseInt(cpfWithoutDots.substring(i - 1, i)) * (11 - i);
                  }

                  remainder = (sum * 10) % 11;

                  if (remainder === 10 || remainder === 11) {
                    remainder = 0;
                  }

                  if (remainder !== parseInt(cpfWithoutDots.substring(9, 10))) {
                    throw new Error('Invalid CPF');
                  }

                  sum = 0;

                  // Calcula o segundo dígito verificador
                  for (let i = 1; i <= 10; i++) {
                    sum +=
                      parseInt(cpfWithoutDots.substring(i - 1, i)) * (12 - i);
                  }

                  remainder = (sum * 10) % 11;

                  if (remainder === 10 || remainder === 11) {
                    remainder = 0;
                  }

                  if (
                    remainder !== parseInt(cpfWithoutDots.substring(10, 11))
                  ) {
                    throw new Error('Invalid CPF');
                  }
                }
              }

    const userCode = `${Date.now().toString()}${this.users.length}`;
    const user = new User(
      name,
      email,
      password,
      cpf,
      userType,
      userCode,
      `${this.users.length + 1}`,
      superPassword,
    );
    this.users.push(user);
    return user;
  }

  updateUser(
    id: string,
    name: string,
    email: string,
    password: string,
    cpf: string,
    userType: 'customer' | 'manager' | 'admin',
    superPassword?: string,
  ): User {
    // valida user data
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email');
    } else {
      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          password,
        )
      ) {
        throw new Error('Invalid password');
      } else {
        if (
          superPassword &&
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            superPassword,
          )
        ) {
          throw new Error('Invalid super password');
        } else {
          if (this.users.some((user) => user.email === email)) {
            throw new Error('Email already in use');
          } else {
            if (this.users.some((user) => user.cpf === cpf)) {
              throw new Error('CPF already in use');
            } else {
              if (!/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/.test(cpf)) {
                throw new Error('Invalid CPF');
              } else {
                const cpfWithoutDots = cpf.replace(/[^\d]+/g, '');
                if (cpfWithoutDots.length !== 11) {
                  throw new Error('Invalid CPF');
                } else {
                  // Elimina CPFs conhecidos que são inválidos
                  if (
                    cpfWithoutDots === '00000000000' ||
                    cpfWithoutDots === '11111111111' ||
                    cpfWithoutDots === '22222222222' ||
                    cpfWithoutDots === '33333333333' ||
                    cpfWithoutDots === '44444444444' ||
                    cpfWithoutDots === '55555555555' ||
                    cpfWithoutDots === '66666666666' ||
                    cpfWithoutDots === '77777777777' ||
                    cpfWithoutDots === '88888888888' ||
                    cpfWithoutDots === '99999999999'
                  ) {
                    throw new Error('Invalid CPF');
                  }

                  let sum = 0;
                  let remainder;

                  // Calcula o primeiro dígito verificador
                  for (let i = 1; i <= 9; i++) {
                    sum +=
                      parseInt(cpfWithoutDots.substring(i - 1, i)) * (11 - i);
                  }

                  remainder = (sum * 10) % 11;

                  if (remainder === 10 || remainder === 11) {
                    remainder = 0;
                  }

                  if (remainder !== parseInt(cpfWithoutDots.substring(9, 10))) {
                    throw new Error('Invalid CPF');
                  }

                  sum = 0;

                  // Calcula o segundo dígito verificador
                  for (let i = 1; i <= 10; i++) {
                    sum +=
                      parseInt(cpfWithoutDots.substring(i - 1, i)) * (12 - i);
                  }

                  remainder = (sum * 10) % 11;

                  if (remainder === 10 || remainder === 11) {
                    remainder = 0;
                  }

                  if (
                    remainder !== parseInt(cpfWithoutDots.substring(10, 11))
                  ) {
                    throw new Error('Invalid CPF');
                  }
                }
              }
            }
          }
        }
      }
    }

    const user = this.users.find((user) => user.id === id);

    if (user) {
      user.name = name;
      user.email = email;
      user.password = password;
      user.cpf = cpf;
      user.userType = userType;

      if (superPassword) {
        user.superPassword = superPassword;
      }
    }

    return user;
  }

  deleteUser(id: string): void {
    this.users = this.users.filter((user) => user.id !== id);
  }

  getUserById(id: string): User {
    return this.users.find((user) => user.id === id);
  }

  listUsers(): User[] {
    return this.users;
  }
}
