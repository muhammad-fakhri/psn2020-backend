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
        create: joi.object().keys({
            name: joi.string().required(),
            img: joi.string().required(),
            memberPerTeam: joi.number().required(),
            maxTeam: joi.number().required(),
            pricePerStudent: joi.number().required(),
            registrationStatus: joi.string().required(),
        }),
        edit: joi.object().keys({
            _id: joi.string().required(),
            img: joi.string().required(),
            name: joi.string().required(),
            memberPerTeam: joi.number().required(),
            maxTeam: joi.number().required(),
            pricePerStudent: joi.number().required(),
            registrationStatus: joi.string().required(),
        }),
        delete: joi.object().keys({
            _id: joi.string().required(),
        }),
    }
}