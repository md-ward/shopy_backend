const product_categoryModel = require("../models/product_categoryModel")

exports.createProductCategory = async (req, res) => {

    console.log(req.body)
    try {
        const newCategory = new product_categoryModel({
            product_Category: req.body.product_category

        })

        await newCategory.save()
        res.status(201).json({ message: 'new category added' })
        console.log('added')



    } catch (error) {

        console.log(error)

        res.status(500).json({ message: 'problem adding category' })

    }


}

exports.getAllProductCategories = async (req, res) => {

    try {

        const allCategories = await product_categoryModel.find();

        res.status(200).json({ allCategories })
    } catch (error) {
        res.status(500).json({ message: 'problem in retriving categories' })



    }

}
