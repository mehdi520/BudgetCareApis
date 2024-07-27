const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema(
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

const IncomeModel = mongoose.model('Income', incomeSchema);

module.exports = IncomeModel;