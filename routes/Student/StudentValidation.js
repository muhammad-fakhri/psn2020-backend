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
        create: joi.object().keys({
            name: joi.string().required(),
            email: joi.string().email().required(),
            phone: joi.string().required(),
            gender: joi.string().valid('male', 'female').required()
        }),
        update: joi.object().keys({
            _id: joi.string().required(),
            name: joi.string().required(),
            email: joi.string().email().required(),
            phone: joi.string().required(),
            gender: joi.string().valid('male', 'female').required()
        }),
        delete: joi.object().keys({
            _id: joi.string().required(),
        }),
    }
}