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
            userType: joi.string().required(),
            student: joi.string().optional(),
            teacher: joi.string().optional(),
            accommodation: joi.string().required(),
            startDate: joi.date().required(),
            duration: joi.number().optional(),
        }),
        // edit: joi.object().keys({
        //     _id: joi.string().required(),
        //     name: joi.string().optional(),
        //     quota: joi.number().optional(),
        //     pricePerNight: joi.number().optional(),
        // }),
        delete: joi.object().keys({
            _id: joi.string().required(),
        }),
    }
}