const express = require('express');
const router = express.Router();


const { requireAuth } = require('../middlewares/auth_middleware');

const { AddOrUpdateExpense,GetExpense} = require('../controllers/expense/expense_controller');

router.post('/addOrUpdateExpense',requireAuth, AddOrUpdateExpense);
router.get('/getExpense',requireAuth, GetExpense);

module.exports = router;