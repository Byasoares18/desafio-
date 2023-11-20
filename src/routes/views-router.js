import { Router } from "express";
import ProductManager from "../DAO/fileSystem/productManager.js";
import { productModel } from "../DAO/models/productModel.js";

const router=Router();

const productList= new ProductManager("./products.json");
const products= await productList.getProducts();

//---------------------------------------------------------------------

router.get('/', async (req,res)=>{

try {

    const productsDB= await productModel.find().lean().exec();

    res.render('home',{
        products:productsDB,
        style: 'index.css'
    });
} catch (error) {
    return error;
}

});

//---------------------------------------------------------------------

router.get('/realTimeProducts', async (req,res)=>{

try {

    const productsDB= await productModel.find().lean().exec();

    res.render('realTimeProducts',{
        products:productsDB,
        style: 'index.css'
    });
} catch (error) {
    return error;
}

});


export default router