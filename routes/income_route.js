const express = require('express');
const router = express.Router();


const { requireAuth } = require('../middlewares/auth_middleware');

const { AddOrUpdateIncome,GetIncomes} = require('../controllers/income/income_controller');

router.post('/addOrUpdateIncome',requireAuth, AddOrUpdateIncome);
router.get('/getIncomes',requireAuth, GetIncomes);

module.exports = router;

