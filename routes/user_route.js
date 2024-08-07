const express = require('express');
const router = express.Router();

const {requireAuth} = require('../middlewares/auth_middleware');

const {UserById,UpdateUser,chnagePasswords,getSummary,getMonthlyGraphSummary} = require('../controllers/user/user_controller');

router.get('/me', requireAuth, UserById);
router.put('/updateProfile', requireAuth, UpdateUser);
router.post('/changepass', requireAuth,chnagePasswords);
router.get('/summary', requireAuth,getSummary);
router.get('/graphSummary', requireAuth,getMonthlyGraphSummary);

module.exports = router;
