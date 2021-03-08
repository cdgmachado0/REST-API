const express = require('express');
const { User, Course } = require('./models');
const router = express.Router();

const {
    asyncHandler, 
    authenticateUser, 
    getNextId,
    processSequelizeError
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
        const nextId = await getNextId(User);
        req.body.id = nextId;
        await User.create(req.body);
        res.status(201).end();
    } catch(error) {
        processSequelizeError(error);
    }
}));


router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        attributes: ['id', 'title', 'description'],
        include: {
            model: User,
            as: 'Student',
            attributes: ['id', 'firstName', 'lastName']
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


router.post('/courses', asyncHandler(async (req, res) => {
    try {
        const nextId = await getNextId(Course);
        req.body.id = nextId;
        // req.body.userId = req.body.userId || null;  
        await Course.create(req.body);
        res.status(201).end();
    } catch(error) {
        processSequelizeError(error);
    }
}));


module.exports = router;

