import CryptoJS from 'crypto-js';

// La clave DEBE estar en variables de entorno
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY ;


// Validar que la clave tenga longitud mínima
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 16) {
  console.warn('⚠️  VITE_ENCRYPTION_KEY debe tener al menos 16 caracteres');
}

class EncryptionService {
  constructor() {
    this.key = CryptoJS.enc.Utf8.parse(this.padKey(ENCRYPTION_KEY));
    this.iv = CryptoJS.enc.Utf8.parse(this.padKey(ENCRYPTION_KEY).substring(0, 16));
  }

  // Asegurar que la clave tenga 32 bytes (256 bits)
  padKey(key) {
    if (key.length >= 32) return key.substring(0, 32);
    return key.padEnd(32, '0');
  }

  // Encriptar datos
  encrypt(data) {
    try {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        this.key,
        {
          iv: this.iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      return encrypted.toString();
    } catch (error) {
      console.error('Error en encriptación:', error);
      return null;
    }
  }

  // Desencriptar datos
  decrypt(ciphertext) {
    try {
      const decrypted = CryptoJS.AES.decrypt(
        ciphertext,
        this.key,
        {
          iv: this.iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedText);
    } catch (error) {
      console.error('Error en desencriptación:', error);
      return null;
    }
  }

  // Generar hash para verificar integridad
  generateHash(data) {
    return CryptoJS.SHA256(JSON.stringify(data)).toString();
  }

  // Verificar que los datos no han sido alterados
  verifyIntegrity(encryptedData, expectedHash) {
    const decrypted = this.decrypt(encryptedData);
    if (!decrypted) return false;
    
    const currentHash = this.generateHash(decrypted);
    return currentHash === expectedHash;
  }
}

export const encryptionService = new EncryptionService();