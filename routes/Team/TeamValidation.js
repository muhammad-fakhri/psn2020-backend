let joi = require('joi');

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = joi.validate(req.body, schema);
            if (result.error) {
                return res.status(400).json({ message: result.error.details[0].message });
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
            contest: joi.string().required(),
            students: joi.array().required(),
        }),
        update: joi.object().keys({
            _id: joi.string().required(),
            name: joi.string().required(),
            contest: joi.string().required(),
            students: joi.array().required(),
        })
    }
}