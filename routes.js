const express = require('express');
const { User, Course } = require('./models');
const router = express.Router();

const {
    asyncHandler, 
    authenticateUser, 
    getNextId
} = require('./middleware/helper-func');



router.get('/', authenticateUser, (req, res) => {
    const user = req.currentUser
    res.json({
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddress
    });
});


router.post('/', asyncHandler(async (req, res) => {
    try {
        const nextId = await getNextId();
        req.body.id = nextId;
        await User.create(req.body);
        res.status(201).end();
    } catch(error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(error => error.message);
            res.status(401).json({ errors });
        } else {
            throw error;
        }
    }
}));


router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        attributes: ['id', 'title'],
        include: {
            model: User,
            as: 'Student',
            attributes: ['id', 'firstName', 'lastName', 'description'],
        }
    });
    res.json({ courses });
}));


router.get('/courses/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const course = await Course.findOne({
        where: { id },
        attributes: ['id', 'title', 'description'],
        include: {
            model: User,
            as: 'Student',
            attributes: ['id', 'firstName', 'lastName']
        }
    });
    res.json({ course });
}));


module.exports = router;

