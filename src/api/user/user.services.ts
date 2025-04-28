import bcrypt from "bcrypt"
import { db } from "../../utils/db"

type RegisterUser = {
  email: string,
  password: string,
}

function findUserByEmail(email: string) {
  return db.user.findUnique({
    where: {
      email,
    },
  });
}

function findUserById(id: string) {
  return db.user.findUnique({
    where: {
      id,
    },
  });
}

function createUserByEmailAndPassword(user: RegisterUser) {
  user.password = bcrypt.hashSync(user.password, 12);
  return db.user.create({
    data: {
      email: user.email,
      password: user.password,
      hashedToken: " ",
    }
  })
}



export { findUserById, findUserByEmail, createUserByEmailAndPassword };
