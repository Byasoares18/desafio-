import { Router } from "express";
import ProductManager from "../productManager.js";

const router = Router();
const productList = new ProductManager("./products.json");


router.get('/', async (req, res) => {
  try {
    const products = await productList.getProducts();
    res.render('home', {
      products: products,
      style: 'index.css'
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});


router.get('/realTimeProducts', async (req, res) => {
  try {
    const products = await productList.getProducts();
    res.render('realTimeProducts', {
      products: products,
      style: 'index.css'
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

export default router;