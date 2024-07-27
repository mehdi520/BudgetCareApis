const express = require('express');
const router = express.Router();

const {requireAuth} = require('../middlewares/auth_middleware');

const {UserById} = require('../controllers/user/user_controller');

router.get('/me', requireAuth, UserById);

module.exports = router;
