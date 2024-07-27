const express = require('express')
const router = express.Router();

const authRouter = require('./auth_route');
const categoryRouter = require('./category_route');
const userRouter = require('./user_route');
const expenseRouter = require('./expense_route');
const incomeRouter = require('./income_route');


router.use('/auth', authRouter);
router.use('/category', categoryRouter);
router.use('/user', userRouter);
router.use('/expense', expenseRouter);
router.use('/income', incomeRouter);

console.log('app_route.js: authRouter loaded');

module.exports = router;