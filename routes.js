const express = require('express');
const { User, Course } = require('./models');
const router = express.Router();

const asyncHandler = require('./async-handler');
const authenticateUser = require('./auth-user');


router.get('/', authenticateUser, asyncHandler((req, res) => {
    const user = req.currentUser
    res.json({
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddress
    });
}));


module.exports = router;

//getting this first route to work