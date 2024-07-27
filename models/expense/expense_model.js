const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now(),
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const ExpenseModel = mongoose.model('Expense', expenseSchema);

module.exports = ExpenseModel;