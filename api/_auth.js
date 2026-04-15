export const sessions = {};

export function verifyToken(req) {
  const auth = req.headers.authorization;

  if (!auth) return null;

  const token = auth.split(" ")[1];

  return sessions[token] || null;
}
