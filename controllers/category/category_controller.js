const Asynchandler  = require('express-async-handler');
const Category = require('../../models/category/category_model');
const { SuccessResponse, ErrorResponse } = require('../../common/common');



// Get categories by user
const getCategoriesByUser = Asynchandler(async (req, res) => {
    const userId = req.user.id;

    try {
        const categories = await Category.find({ user: userId ,isDeleted : false});
        return SuccessResponse(req, res, categories, 'Categories retrieved successfully');
    } catch (error) {
        return ErrorResponse(req, res, error, 'Error retrieving categories');
    }
});

const AddOrUpdateCat = Asynchandler( async (req, res) => {
    try {
        const userId = req.user.id;
        const {title,description,catId} = req.body;

        if(!title){
            return ErrorResponse(req, res, null, 'Title is required');

        }
        else if(!description){
            return ErrorResponse(req, res, null, 'Description is required');

        }
        else{
            if(!catId){ //insert a new cat
                const isExist = await Category.findOne({ user: userId,title: title,isDeleted : false});
                if(isExist){
                    return ErrorResponse(req, res, null, 'Category with same title already exists');
                }
                else  // create a new category and save it in db.
                {
                const newCat = new Category({title, description, user: userId});
                await newCat.save();

                return SuccessResponse(req, res, newCat, 'Cat added successfully');
                }
            }
            else{ // update existing cat
                const category = await Category.findById(catId);
                if(!category){
                    return ErrorResponse(req, res, null, 'Category not found');
                }
                else
                {
                    category.title = title;
                    category.description = description;
                    await category.save();

                    return SuccessResponse(req, res, category, 'Cat updated successfully');
                }

            }
        }
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
            return ErrorResponse(req, res, null, 'Something went wrong! Please try again');

        }
});

const deleteCategory = Asynchandler(async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id);

        if (!category) {
            return ErrorResponse(req, res, null, 'Category not found', 404);
        }

        category.isDeleted = true;
        await category.save();
        return SuccessResponse(req, res, category, 'Category deleted successfully');
    } catch (error) {
        return ErrorResponse(req, res, error, 'Error deleting category');
    }
});

module.exports = {
    getCategoriesByUser,
    AddOrUpdateCat,
    deleteCategory
};