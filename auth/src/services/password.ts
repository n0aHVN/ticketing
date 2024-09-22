import {scrypt, randomBytes} from 'crypto';
import{promisify} from 'util';
const scryptAsync = promisify(scrypt);

export class Password{
//Ta sẽ lưu salt và buf
//salt là random và hoạt động như seed
//buf là password được mã hoá từ seed ra
    static async toHash(password: string ){
        const salt = randomBytes(8).toString('hex');
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;
        return `${buf.toString('hex')}.${salt}`;
    }
    //Ta có storePassword và salt, lấy salt + suppliedPassword cần check = suppliedhashedPassword, nếu storePassword = suppliedhashedPassword thì là ok
    static async compare(storedPassword: string, suppliedPassword: string){
        const [hashedPassword, salt] = storedPassword.split('.');
        const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
        return buf.toString('hex') === hashedPassword;
    }
}