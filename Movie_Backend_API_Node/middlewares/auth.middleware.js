const jwt = require('jsonwebtoken');
const User = require('../model/user.model');
const { errorResponseBody } = require('../utils/responsebody');

const verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if (!token) {
        errorResponseBody.message = "No token provided!";
        return res.status(403).send(errorResponseBody);
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            errorResponseBody.message = "Unauthorized!";
            return res.status(401).send(errorResponseBody);
        }
        req.userId = decoded.id;
        next();
    });
};

const isAdmin = async (req, res, next) => {
    const user = await User.findById(req.userId);
    if (user && user.userType === "ADMIN") {
        next();
    } else {
        errorResponseBody.message = "Require Admin Role!";
        return res.status(403).send(errorResponseBody);
    }
};

module.exports = {
    verifyToken,
    isAdmin
};
