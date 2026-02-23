import { SignJWT, jwtVerify } from 'jose';

// Define the shape of our JWT payload
export interface TenantJWTPayload {
  tenant_id: string;
  apartment_id: string;
  room_number: string;
  must_change_pass: boolean;
  role: 'tenant';
}

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    // Fallback for development, in production you MUST set JWT_SECRET_KEY
    return new TextEncoder().encode('fallback-pilas-tenant-secret-key-32chars');
  }
  return new TextEncoder().encode(secret);
};

export async function signTenantJWT(payload: TenantJWTPayload): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 7; // 7 days expiration

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(getJwtSecretKey());
}

export async function verifyTenantJWT(token: string): Promise<TenantJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload as unknown as TenantJWTPayload;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}
