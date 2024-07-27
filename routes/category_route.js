const express = require('express');
const router = express.Router();
const {requireAuth} = require('../middlewares/auth_middleware');



const { getCategoriesByUser, AddOrUpdateCat,deleteCategory } = require('../controllers/category/category_controller');

router.get('/getUserCats',requireAuth, getCategoriesByUser);
router.post('/addOrUpdateCat',requireAuth, AddOrUpdateCat);
router.delete('/deleteCat/:id',requireAuth, deleteCategory);

module.exports = router;