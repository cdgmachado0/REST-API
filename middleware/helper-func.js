const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User, Course } = require('../models');


const asyncHandler = (cb) => {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch(err) {
            next(err);
        }
    }
}

const authenticateUser = async (req, res, next) => {
    async function allowUserUpdateOrDelete(user, next) {
        if (req.params.id) {
            const course = await Course.findByPk(req.params.id);
            const { userId } = course;
            const possibleUser = await User.findOne({ where: { id: userId } });
            const checkMethodAndUser = method => req.method === method && possibleUser.dataValues.id !== user.dataValues.id;

            if (checkMethodAndUser('PUT') || checkMethodAndUser('DELETE')) {
                res.status(403).end();
                return true;
            } else {
                next();
            }
        } else {
            res.end(); //the issue here is that it terminates the request and exits the middle, without
        } //passing by through "authenticated" so "user" ends up as undefined
    }

    let message;
    const credentials = auth(req);

    if (credentials) {
        const user = await User.findOne({ where: { emailAddress: credentials.name }});
        if (user) {
            if (allowUserUpdateOrDelete(user, next)) {
                return;
            } else {
                console.log('hello2');
                const authenticated = bcrypt.compareSync(credentials.pass, user.password);
                if (authenticated) {
                    console.log(`Authentication successful for ${user.emailAddress}`);
                    req.currentUser = user;
                } else {
                    message = `Incorrect password for ${credentials.name}`;
                }
            }  
        } else {
            message = `User not found: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }

    if (message && message.length > 0) {
        res.status(401).json({ message: 'Access denied'})
    } else {
        next();
    }
}

const getNextId = async (element) => {
    let model = element;
    const idsArr = [];
    const fetchedModels = await model.findAll();
    for (let model of fetchedModels) {
      const id = model.dataValues.id;
      idsArr.push(id);
    }
    return Math.max(...idsArr) + 1;
  }

  const processSequelizeError = (error, res) => {
    if (error['name'] === 'SequelizeValidationError' || error['name'] === 'SequelizeUniqueConstraintError') {
        let errors = error['errors'];
        errors = errors.map(error => error.message);
        res.status(400).json({ errors });
    } else {
        throw error;
    }
  }


  module.exports = {
      asyncHandler,
      authenticateUser,
      getNextId,
      processSequelizeError
  };