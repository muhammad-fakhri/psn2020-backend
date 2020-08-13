let joi = require('joi');

const delete1 = joi.object().keys({
    schoolId: joi.string().required()
});
const delete2 = joi.object().keys({
    schoolIds: joi.array().required()
});

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
        updateSchoolDetail: joi.object().keys({
            schoolId: joi.string().required(),
            name: joi.string().required(),
            email: joi.string().email().required(),
            address: joi.string().required(),
            phone: joi.string().required()
        }),
        deleteSchool: joi.alternatives().try(delete1, delete2)
    }
}