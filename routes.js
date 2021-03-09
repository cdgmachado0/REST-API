const express = require('express');
const { User, Course } = require('./models');
const router = express.Router();

const {
    asyncHandler, 
    authenticateUser, 
    getNextId,
    processSequelizeError
} = require('./middleware/helper-func');



router.get('/users', authenticateUser, (req, res) => {
    const user = req.currentUser
    res.json({
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddress
    });
});


router.post('/users', asyncHandler(async (req, res) => {
    try {
        const nextId = await getNextId(User);
        req.body.id = nextId;
        await User.create(req.body);
        res.status(201).location('/').end();
    } catch(error) {
        processSequelizeError(error, res);
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
        await Course.create(req.body);
        res.status(201).location(`/courses/${nextId}`).end();
    } catch(error) {
        console.log(error.name);
        console.log(error);
        processSequelizeError(error, res);
    }
}));


router.put('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    await course.update(req.body);
    res.status(204).end();
}));


router.delete('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    await course.destroy();
    res.status(204).end();
}));

module.exports = router;


//try the app with the provided tests

