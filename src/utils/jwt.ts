import jwt from "jsonwebtoken";

type partialUser = {
  id: string,
  email: string,
};

export const generateAccessToken = (user: partialUser) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: '5m',
  })
}

export const generateRefreshtoken = (user: partialUser) => {
  return jwt.sign({ ID: user.id, Email: user.email }, process.env.SECRET as string, {
    expiresIn: '30d'
  });
}

export const generateTokens = (user: partialUser) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshtoken(user);
  return { accessToken, refreshToken };

}



