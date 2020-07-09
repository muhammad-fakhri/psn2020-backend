let joi = require('joi');

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = joi.validate(req.body, schema);
            if (result.error){
                return res.status(400).json(result.error);
            }
            if (!req.value) {
                req.value = {};
            }
            req.value['body'] = result.value;
            next();
        }
    },
    schemas:{
        schoolRegistration: joi.object().keys({
            name: joi.string().required(),
            address: joi.string().required(),
            email: joi.string().email().required(),
            phone: joi.string().required(),
            username: joi.string().required(),
            password: joi.string().required(),
        }),
        schoolLogin: joi.object().keys({
            username: joi.string().required(),
            password: joi.string().required()
        }),
        adminRegistration: joi.object().keys({
            name: joi.string().required(),
            username: joi.string().required(),
            email: joi.string().email().required(),
            password: joi.string().required(),
        }),
        adminLogin: joi.object().keys({
            username: joi.string().required(),
            password: joi.string().required()
        }),
    }
}