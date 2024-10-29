const crypto = require('crypto');
require('dotenv').config();

exports.dekripsi = (encryptedText, key, iv) => {
    // console.log('Decrypting data...');
    // console.log('Key:', key.toString('hex'));
    // console.log('IV:', iv.toString('hex'));

    // kalo di ilangin apakah K*N*T*L gw error ???
    if (iv.toString('hex').length !== 32) throw new Error("IV must be 32 characters long (hex representation of 16 bytes).");

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    // console.log('Decrypted Data:', decrypted);
    return decrypted;
};


// diemin aja
exports.enkripsi = (text, key, iv) => {
    // console.log('Encrypting data...');
    // console.log('Key:', key.toString('hex'));
    // console.log('IV:', iv.toString('hex'));

    // Periksa panjang IV dalam bentuk hexadecimal (32 karakter)
    if (iv.toString('hex').length !== 32) throw new Error("IV must be 32 characters long (hex representation of 16 bytes).");

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    console.log('Encrypted Data:', encrypted);
    return {
        encryptedData: encrypted,
        initializationVector: iv.toString('hex')
    };
};

module.exports = exports;
