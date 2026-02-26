/** Minimal JWT payload as issued by the backend's JwtService */
export interface JwtClaims {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
}

/**
 * Decode the payload section of a JWT without verifying the signature.
 * Signature verification is the server's responsibility.
 */
export const decodeJwt = (token: string): JwtClaims => {
  const base64 = token.split(".")[1] ?? "";
  // atob requires standard base64; JWT uses base64url — replace the two different chars
  const padded = base64.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(padded)) as JwtClaims;
};
