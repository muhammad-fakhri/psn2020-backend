let joi = require('joi');

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = joi.validate(req.body, schema);
            if (result.error) {
                return res.status(400).json(result.error);
            }
            if (!req.value) {
                req.value = {};
            }
            req.value['body'] = result.value;
            next();
        }
    },
    schemas: {
        schoolRegistration: joi.object().keys({
            name: joi.string().required(),
            email: joi.string().email().required(),
            address: joi.string().required(),
            phone: joi.string().required(),
            password: joi.string()
                .required()
                .alphanum()
                .min(8)
                .regex(new RegExp(".[0-9]"))
                .error(errors => {
                    errors.forEach(err => {
                        if (err.type === "string.regex.base") {
                            err.message = "Password must begin with a letter and contain at least one numeric digit";
                        }
                    })
                    return errors;
                })
        }),
        schoolLogin: joi.object().keys({
            email: joi.string().email().required(),
            password: joi.string().required()
        }),
        adminRegistration: joi.object().keys({
            name: joi.string().required(),
            email: joi.string().email().required(),
            password: joi.string()
                .required()
                .alphanum()
                .min(8)
                .regex(new RegExp(".[0-9]"))
                .error(errors => {
                    errors.forEach(err => {
                        if (err.type === "string.regex.base") {
                            err.message = "Password must begin with a letter and contain at least one numeric digit";
                        }
                    })
                    return errors;
                })
        }),
        adminLogin: joi.object().keys({
            email: joi.string().email().required(),
            password: joi.string().required()
        }),
        resendVerifyEmail: joi.object().keys({
            email: joi.string().email().required()
        }),
    }
}