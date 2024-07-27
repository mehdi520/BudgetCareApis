const Asynchandler = require('express-async-handler');
const IncomeModel = require('../../models/income/income_model');
const Category = require('../../models/category/category_model');
const mongoose = require('mongoose');

const { SuccessResponse, ErrorResponse } = require('../../common/common');


const AddOrUpdateIncome = Asynchandler(async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { amount, description, date, catId, incomeId } = req.body;

        if (!amount) {
            return ErrorResponse(req, res, null, 'Amount is required');

        }
        else if (!description) {
            return ErrorResponse(req, res, null, 'Description is required');

        }
        else if (!date) {
            return ErrorResponse(req, res, null, 'Date is required');

        }
        else if (!catId) {
            return ErrorResponse(req, res, null, 'Category is required');

        }
        else {
            
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                return ErrorResponse(req, res, null, 'Invalid date format');
            }
            if (!incomeId) { //insert a new incomeId
                const isExist = await Category.findOne({ user: userId, _id: catId, isDeleted: false });
                if (!isExist) {
                    return ErrorResponse(req, res, null, 'Category not found');
                }
                else  // create a new income and save it in db.
                {


                    const newIncome = new IncomeModel({ amount, description, date : parsedDate, userId: userId, categoryId: catId });
                    await newIncome.save();

                    return SuccessResponse(req, res, newIncome, 'Income added successfully');
                }
            }
            else { // update existing income
                const income = await IncomeModel.findById(incomeId);
                if (!income) {
                    return ErrorResponse(req, res, null, 'Income not found');
                }
                else {
                    income.amount = amount;
                    income.description = description;
                    income.date = date;

                    await income.save();

                    return SuccessResponse(req, res, income, 'Income updated successfully');
                }

            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
        return ErrorResponse(req, res, null, 'Something went wrong! Please try again');

    }
});

const GetIncomes = Asynchandler(async (req,res,next) => {
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

        // Fetch income with pagination
        const incomes = await IncomeModel.find(query)
            .skip(skip)
            .limit(pageSize);

     

        const totalIncomes = await IncomeModel.countDocuments(query);
        // Calculate the total amount
        const allIncomes = await IncomeModel.find(query);
        const totalAmount = allIncomes.reduce((sum, income) => sum + income.amount, 0);

        return SuccessResponse(req, res, {
            incomes,
            total: totalIncomes,
            page: pageNumber,
            totalIncomes :totalAmount,
            limit: pageSize,
        }, 'Incomes retrieved successfully');
    } catch (error) {
        console.error(error);
        return ErrorResponse(req, res, error, 'Error retrieving Incomes');
    }
});


module.exports = {
    AddOrUpdateIncome,
    GetIncomes
};

