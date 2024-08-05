const Asynchandler = require('express-async-handler');
const ExpenseModel = require('../../models/expense/expense_model');
const Category = require('../../models/category/category_model');
// const  convertDecimal128ToNumber  = require('../../utils/formatters');
const mongoose = require('mongoose');

const { SuccessResponse, ErrorResponse } = require('../../common/common');


const AddOrUpdateExpense = Asynchandler(async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { amount, description, date, categoryId, expenseId } = req.body;

        if (!amount) {
            return ErrorResponse(req, res, null, 'Amount is required');

        }
        else if (!description) {
            return ErrorResponse(req, res, null, 'Description is required');

        }
        else if (!date) {
            return ErrorResponse(req, res, null, 'Date is required');

        }
        else if (!categoryId) {
            return ErrorResponse(req, res, null, 'Category is required');

        }
        else {
            
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                return ErrorResponse(req, res, null, 'Invalid date format');
            }
            if (!expenseId) { //insert a new expense
                const isExist = await Category.findOne({ user: userId, _id: categoryId, isDeleted: false });
                if (!isExist) {
                    return ErrorResponse(req, res, null, 'Category not found');
                }
                else  // create a new expense and save it in db.
                {


                    const newExpense = new ExpenseModel({ amount, description, date : parsedDate, userId: userId, categoryId: categoryId });
                    await newExpense.save();

                    return SuccessResponse(req, res, newExpense, 'Expense added successfully');
                }
            }
            else { // update existing cat
                const expense = await ExpenseModel.findById(expenseId);
                if (!expense) {
                    return ErrorResponse(req, res, null, 'Expense not found');
                }
                else {
                    expense.amount = amount;
                    expense.description = description;
                    expense.date = date;

                    await expense.save();

                    return SuccessResponse(req, res, expense, 'Expense updated successfully');
                }

            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
        return ErrorResponse(req, res, null, 'Something went wrong! Please try again');

    }
});


const GetExpense = Asynchandler(async (req,res,next) => {
    const { startDate, endDate, categoryId, page = 1, limit = 10 } = req.query;
    const userId = req.user.id;
    // Validate the date range
    if (!startDate || !endDate) {
        return ErrorResponse(req, res, null, 'Start date and end date are required');
    }

 
    // Convert date strings to Date objects
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    console.log(parsedStartDate);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        return ErrorResponse(req, res, null, 'Invalid date format');
    }

    // Pagination and filtering
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    try {
        const query = {
            date: { $gte: parsedStartDate, $lte: parsedEndDate },
            userId,
            ...(categoryId && { categoryId }), // Add categoryId to query if provided
        };

        // Fetch expenses with pagination
        const expenses = await ExpenseModel.find(query)
            .skip(skip)
            .limit(pageSize);

     

        const totalExpenses = await ExpenseModel.countDocuments(query);
        // Calculate the total amount
        const allExpenses = await ExpenseModel.find(query);
        const totalAmount = allExpenses.reduce((sum, expense) => sum + expense.amount, 0);

        return SuccessResponse(req, res, {
            data:expenses,
            total: totalExpenses,
            page: pageNumber,
            totalAmount :totalAmount,
            limit: pageSize,
        }, 'Expenses retrieved successfully');
    } catch (error) {
        console.error(error);
        return ErrorResponse(req, res, error, 'Error retrieving expenses');
    }
});


module.exports = {
    AddOrUpdateExpense,
    GetExpense
};

