const express = require('express');
const { User, Course } = require('./models');
const router = express.Router();


router.get('/', (req, res) => {
    res.json({message: 'All good'});
});

module.exports = router;