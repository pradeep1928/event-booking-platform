import { jwtService } from '../infrastructure/jwt/jwt.service.js';

async function main() {
  const token = await jwtService.generateAccessToken({
    sub: 'user-123',
    email: 'pradeep@example.com',
    role: 'USER',
  });

  console.log('Access Token:\n', token);

  const payload = await jwtService.verifyAccessToken(token);

  console.log('\nDecoded Payload:\n', payload);
}

main().catch(console.error);