import { Request } from 'express';

/**
 * Extracts authentication token from either HTTP-only cookie, Authorization Bearer header, or x-access-token.
 */
export function extractTokenFromRequest(request: Request): string | undefined {
  if (request.cookies?.accessToken) {
    return request.cookies.accessToken;
  }
  const authHeader = request.headers?.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  if (request.headers && request.headers['x-access-token']) {
    return String(request.headers['x-access-token']).trim();
  }
  return undefined;
}
