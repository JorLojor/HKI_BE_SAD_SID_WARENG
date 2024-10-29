const db = require('../../models');
const userModel = db.user_DB.user;
const jwt = require('jsonwebtoken');

exports.wargaValidation = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const secretKey = process.env.LOGIN_TOKEN;
    try {
    
        if (!authHeader) {
            console.log('1');
            return res.status(403).send({
                message: "Forbidden. kamu tidak diizinkan mengakses ini.  karena tidak ada token."
            });
        }

        const tokenArray = authHeader.split('Bearer ');

        if (tokenArray.length !== 2) {
            console.log('2');
            return res.status(403).send({
                message: "Forbidden. kamu tidak diizinkan mengakses ini. 2 karena token tidak valid."
            });
        }

        const token = tokenArray[1];
        jwt.verify(token, secretKey, async (err, decoded) => {
            if (err) {
                console.log('3');
                return res.status(403).send({
                    message: "Forbidden. kamu tidak diizinkan mengakses ini. Terjadi kesalahan saat memverifikasi token. 3"
                });
            }

            const decodedId = decoded.id;

            const user = await userModel.findById(decodedId);
            if (!user) {
                console.log('4');
                return res.status(403).send({
                    message: "Forbidden. kamu tidak diizinkan mengakses ini. 4"
                });
            }

            req.user = user;
            next();
        });

    } catch (error) {
        console.log('5');
        console.error(error);
        res.status(500).send({
            message: error.message || "Some error occurred while validating user."
        });
    }
};

module.exports = exports;
