const crypto = require('crypto');

const ENC_PREFIX = 'enc:v1:';
const IV_LENGTH = 12;

const resolveKeyMaterial = () => {
  return process.env.MESSAGE_ENCRYPTION_KEY || process.env.JWT_SECRET || '';
};

const deriveKey = () => {
  const material = resolveKeyMaterial();
  if (!material) return null;
  return crypto.createHash('sha256').update(material).digest();
};

const isEncryptedMessage = (value) => {
  return typeof value === 'string' && value.startsWith(ENC_PREFIX);
};

const encryptMessageContent = (plainText) => {
  if (typeof plainText !== 'string' || plainText.length === 0) return plainText;
  if (isEncryptedMessage(plainText)) return plainText;

  const key = deriveKey();
  if (!key) return plainText;

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return `${ENC_PREFIX}${iv.toString('base64')}.${tag.toString('base64')}.${encrypted.toString('base64')}`;
};

const decryptMessageContent = (cipherText) => {
  if (typeof cipherText !== 'string' || cipherText.length === 0)
    return cipherText;
  if (!isEncryptedMessage(cipherText)) return cipherText;

  const key = deriveKey();
  if (!key) return '[Encrypted message]';

  try {
    const payload = cipherText.slice(ENC_PREFIX.length);
    const [ivB64, tagB64, dataB64] = payload.split('.');
    if (!ivB64 || !tagB64 || !dataB64) return '[Encrypted message]';

    const iv = Buffer.from(ivB64, 'base64');
    const tag = Buffer.from(tagB64, 'base64');
    const data = Buffer.from(dataB64, 'base64');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return decrypted.toString('utf8');
  } catch {
    return '[Encrypted message]';
  }
};

module.exports = {
  isEncryptedMessage,
  encryptMessageContent,
  decryptMessageContent,
};
