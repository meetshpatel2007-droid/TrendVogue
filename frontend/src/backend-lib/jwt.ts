// Re-export from backend lib — middleware must use edge-compatible JS
// This file is the bridge for Next.js middleware which runs on the Edge runtime

export { verifyAccessToken, signAccessToken, type JWTPayload } from "../../backend/src/lib/jwt";
