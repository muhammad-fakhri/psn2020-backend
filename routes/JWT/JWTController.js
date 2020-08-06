const AdminModel = require('../Admin/AdminModel');
let JWT = require('jsonwebtoken');
let JWT_SECRET = "#$iNd3xL1br0ruMpR0h!b1toRum$*"
class JWtController {
    static signTokenToSchool(user) {
        if (user == null) return null;
        return JWT.sign({
            iss: 'Pesta Sains Nasional',
            sub: user._id,
            iat: new Date().getTime(),
            exp: new Date().setDate(new Date().getDate() + 5),
            privilege: "school"
        }, JWT_SECRET);
    }
    static signTokenToAdmin(user) {
        if (user == null) return null;
        return JWT.sign({
            iss: 'Pesta Sains Nasional',
            sub: user._id,
            iat: new Date().getTime(),
            exp: new Date().setDate(new Date().getDate() + 5),
            privilege: "admin"
        }, JWT_SECRET);
    }
    static checkToken(req, res, next) {
        let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase      
        if (token) {
            if (token.startsWith('Bearer ')) {
                token = token.slice(7, token.length);
            }
            JWT.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: 'Auth token is invalid' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(401).json({ message: 'Auth token is not supplied' });
        }
    }
    static isAdmin(req, res, next) {
        let { privilege } = req.decoded;
        if (privilege === "admin") next();
        else return res.status(403).json({ message: "You do not have access to this resource" });
    }
    static isSuperAdmin(req, res, next) {
        let { privilege, sub } = req.decoded;
        if (privilege === "admin") {
            AdminModel.findById(sub, function (err, admin) {
                if (!admin.isSuperAdmin) {
                    return res.status(403)
                        .json({ message: "You do not have access to this resource, not a super admin" });
                }
                next();
            })
        }
        else return res.status(403).json({ message: "You do not have access to this resource" });
    }
    static isSchool(req, res, next) {
        let { privilege } = req.decoded;
        if (privilege === "school") next();
        else return res.status(403).json({ message: "You do not have access to this resource" });
    }
}

module.exports = JWtController;