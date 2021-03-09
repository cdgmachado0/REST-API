const express = require('express');
const { User, Course } = require('./models');
const router = express.Router();
const bcrypt = require('bcrypt');

const {
    asyncHandler, 
    authenticateUser, 
    getNextId,
    processSequelizeError
} = require('./middleware/helper-func');



router.get('/users', authenticateUser, (req, res) => {
    const user = req.currentUser
    res.json({
        id: `${user.id}`,
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddress
    });
});


router.post('/users', asyncHandler(async (req, res) => {
    try {
        const nextId = await getNextId(User);
        req.body.id = nextId;
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        await User.create(req.body);
        res.status(201).location('/').end();
    } catch(error) {
        processSequelizeError(error, res);
    }
}));


router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
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
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
        include: {
            model: User,
            as: 'Student',
            attributes: ['id', 'firstName', 'lastName']
        }
    });
    if (course) {
        res.json({ course });
    } else {
        res.status(400).json({ message: 'Course not found in database' });
    }
}));


router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const nextId = await getNextId(Course);
        req.body.id = nextId;
        await Course.create(req.body);
        res.status(201).location(`/courses/${nextId}`).end();
    } catch(error) {
        processSequelizeError(error, res);
    }
}));


router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            await course.update(req.body);
            res.status(204).end();
        } else {
            res.status(400).json({ message: 'Course not found in database' });
        }
    } catch(error) {
        processSequelizeError(error, res);
    }
}));


router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        await course.destroy();
        res.status(204).end();
    } else {
        res.status(400).json({ message: 'Course not found in database' });
    }
}));

module.exports = router;



