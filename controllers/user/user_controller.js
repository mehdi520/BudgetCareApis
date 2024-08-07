const AsyncHandler = require('express-async-handler');
const User = require('../../models/user/user_model');
const bcrypt = require('bcryptjs');
const IncomeModel = require('../../models/income/income_model');
const ExpenseModel = require('../../models/expense/expense_model');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const { SuccessResponse, ErrorResponse } = require('../../common/common');

const UserById = AsyncHandler(
    async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId);
            if (!user) {

                return ErrorResponse(req, res, null, 'User not found');

            }
            else {
                return SuccessResponse(req, res, user, 'Success');

            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
            return ErrorResponse(req, res, null, 'Something went wrong! Please try again');

        }
    }
);

const UpdateUser = AsyncHandler(
    async (req, res) => {
        try {
            const userId = req.user.id;
            const { name, phone } = req.body;

            if (!name) {
                return ErrorResponse(req, res, null, 'Name is required');

            }
            else if (!phone) {
                return ErrorResponse(req, res, null, 'Phone is required');

            }
            else {
                const user = await User.findByIdAndUpdate(userId, { name, phone }, { new: true });
                if (!user) {
                    return ErrorResponse(req, res, null, 'User not found');

                }
                else {
                    return SuccessResponse(req, res, user, 'User updated successfully');

                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
            return ErrorResponse(req, res, null, 'Something went wrong! Please try again');

        }
    });

const chnagePasswords = AsyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword) {
            return ErrorResponse(req, res, null, 'oldPassword is required');

        }
        if (!newPassword) {
            return ErrorResponse(req, res, null, 'newPassword is required');

        }
        const user = await User.findById(userId);
        if (!user) {
            return ErrorResponse(req, res, null, 'User not found');

        }

        else {

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return ErrorResponse(req, res, null, 'Incorrect old password');
            }
            user.password = await bcrypt.hash(newPassword, 10);

            await user.save();
            return SuccessResponse(req, res, null, 'Password updated successfully');

        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
        return ErrorResponse(req, res, null, 'Something went wrong! Please try again');

    }
});

const getSummary = AsyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const now = new Date();

        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        const startOfMonth = currentYear + '-' + currentMonth + '-' + '01';
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

        const query = {
            date: { $gte: startOfMonth, $lte: endOfMonth },
            userId,
        };

        const allExpenses = await ExpenseModel.find(query);
        const totalExpenseAmount = allExpenses.reduce((sum, expense) => sum + expense.amount, 0);

        const allIncomes = await IncomeModel.find(query);
        const totalIncomesAmount = allIncomes.reduce((sum, incomes) => sum + incomes.amount, 0);

        const startOfYear = currentYear + '-01-' + '01';
        const endOfYear = new Date(currentYear, 12, 0, 23, 59, 59, 999);

        console.log(startOfYear);
        console.log(endOfYear);

        const yearlyQuery = {
            date: { $gte: startOfYear, $lte: endOfYear },
            userId,
        };

        const allYearExpenses = await ExpenseModel.find(yearlyQuery);
        const totalYearExpenseAmount = allYearExpenses.reduce((sum, expense) => sum + expense.amount, 0);

        const allYearIncomes = await IncomeModel.find(yearlyQuery);
        const totalYearIncomesAmount = allYearIncomes.reduce((sum, incomes) => sum + incomes.amount, 0);


        const data = {
            totalThisMonthIncome: totalIncomesAmount || 0,
            totalThisMonthExpense: totalExpenseAmount || 0,
            totalThisYearIncome: totalYearIncomesAmount || 0,
            totalThisYearExpense: totalYearExpenseAmount || 0,
            // monthlyWiseIncomeAndExpenseOfCurrentYear
        };

        return SuccessResponse(req, res, data, 'Summary retrieved successfully');



    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
        return ErrorResponse(req, res, null, 'Something went wrong! Please try again');

    }
});

const getMonthlyGraphSummary = AsyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;

        const objectId = new mongoose.Types.ObjectId(userId);
        const pipeline = [
         { $match: { userId: objectId } },
          { $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" }
            },
            totalIncome: { $sum: "$amount" }
          } },
       
        ];
        const results = await IncomeModel.aggregate(pipeline).exec();
        const expenseResults = await ExpenseModel.aggregate(pipeline).exec();
        var finalResults = [];
        for (let i = 1; i <13; i++) {
            console.log(i); 
            const income = results.find(x => x._id.month === i);
            const expense = expenseResults.find(x => x._id.month === i);
            finalResults.push({
                 month: i,
                  totalIncome: income?.totalIncome || 0 ,
                   totalExpens: expense?.totalIncome || 0
                });
          }
        return SuccessResponse(req, res, finalResults, 'Monthly Graph Summary retrieved successfully');
    } catch (error) {
        console.error(error);
        return ErrorResponse(req, res, null, 'Something went wrong! Please try again');

    }
});




module.exports = {
    UserById,
    UpdateUser,
    chnagePasswords,
    getSummary,
    getMonthlyGraphSummary
};