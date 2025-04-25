import { db } from "../../utils/db";
import { hashToken } from "../../utils/hasktoken";

function addRefresh({ refreshToken, id }: { refreshToken: string, id: string }) {
  return db.user.update({
    where: {
      id,
    },
    data: {
      hashedToken: hashToken(refreshToken),
    },
  });
}

function findRefreshToken({ token, id }: { token: string, id: string }) {
  return db.user.findFirst({
    where: {
      id,
      hashedToken: hashToken(token),
    },
  });
}

function deleteRefreshTokenById(id: string) {
  return db.user.update({
    where: {
      id,
    },
    data: {
      hashedToken: "",
    },
  });
}

export { addRefresh, findRefreshToken, deleteRefreshTokenById };
