import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}

export async function hashToken(token: string): Promise<string> {
    const secret = process.env.JWT_REFRESH_SECRET;
    return await crypto.createHmac('sha256', secret).update(token).digest('hex');
}