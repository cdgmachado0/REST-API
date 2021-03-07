const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.authenticateUser = async (req, res, next) => {
    let message;
    const credentials = auth(req);

    if (credentials) {
        const user = await User.findOne({ where: { emailAddress: credentials.name }});
        if (user) {
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);
            if (authenticated) {
                console.log(`Authentication successful for ${user.emailAddress}`);
                req.currentUser = user;
            } else {
                message = `Incorrect password for ${credentials.name}`;
            }
        } else {
            message = `User not found: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }

    if (message && message.length > 0) {
        console.log(message);
        res.status(401).json({ message: 'Access denied'})
    } else {
        next();
    }
}