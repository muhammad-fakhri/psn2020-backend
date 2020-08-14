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
            memberPerTeam: joi.number().required(),
            maxTeam: joi.number().required(),
            registrationStatus: joi.string().valid('open', 'close').required(),
            pricePerStudent: joi.number().required(),
        }),
        update: joi.object().keys({
            _id: joi.string().required(),
            name: joi.string().required(),
            memberPerTeam: joi.number().required(),
            maxTeam: joi.number().required(),
            registrationStatus: joi.string().valid('open', 'close').required(),
            pricePerStudent: joi.number().required(),
        }),
        delete: joi.object().keys({
            contestIds: joi.array().required(),
        })
    }
}