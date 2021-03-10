const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User, Course } = require('../models');


//Handles async errors
const asyncHandler = (cb) => {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch(err) {
            next(err);
        }
    }
}

//Checks if the owner of the course is the one calling the route
const isOwner = async (req, res, next) => {
    const credentials = auth(req);
    const course = await Course.findByPk(req.params.id);
    if (course) {
        const { userId } = course;
        const possibleUser = await User.findOne({ where: { id: userId } });
        const userEmail = credentials ? credentials.name : '';
        //Compares the owner of the course with the user calling the route
        const compareUsers = () => possibleUser.dataValues.emailAddress === userEmail ? true : false;
        if (compareUsers()) {
            next();
        } else {
            res.status(403).end();
        }
    } else {
        res.status(400).json({ message: 'Course not found in database' });
    }
}

//Authenticates the user calling the route through their log-in credentials
const authenticateUser = async (req, res, next) => {
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
        res.status(401).json({ message: 'Access denied'})
    } else {
        next();
    }
}

//Adds the following ID in the queue to the model that is being created
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

//Process Sequelize's validation and constraint errors
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
      processSequelizeError,
      isOwner
  };