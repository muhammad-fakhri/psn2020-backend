let joi = require('joi');

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = joi.validate(req.body, schema);
            console.log(result);
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
        createSubadmin: joi.object().keys({
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
        createSuperadmin: joi.object().keys({
            name: joi.string().required(),
            email: joi.string().email().required(),
            isSuperAdmin: joi.boolean().required(),
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
                }),
            secret: joi.string().required(),
        }),
        deleteSubadmin: joi.object().keys({
            email: joi.string().email().required()
        })
    }
}