const express = require('express');
const router = express.Router();

const {requireAuth} = require('../middlewares/auth_middleware');

const {UserById,UpdateUser,chnagePasswords} = require('../controllers/user/user_controller');

router.get('/me', requireAuth, UserById);
router.put('/updateProfile', requireAuth, UpdateUser);
router.post('/changepass', requireAuth,chnagePasswords);

module.exports = router;
