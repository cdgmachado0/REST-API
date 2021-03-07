const express = require('express');
const { User, Course } = require('./models');
const router = express.Router();

const { asyncHandler } = require('./middleware/async-handler');
const { authenticateUser } = require('./middleware/auth-user');


router.get('/', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser
    res.json({
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddress
    });
}));


module.exports = router;

