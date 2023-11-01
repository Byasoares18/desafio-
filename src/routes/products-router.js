import { Router } from 'express';
import ProductManager from '../productManager.js';
import { uploader } from '../ultis/multer.js';

const router = Router();

const products = new ProductManager('./products.json');

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const productList = await products.getProducts();

    if (!limit || isNaN(limit)) {
      return res.send({ products: productList });
    }

    const limitProducts = productList.slice(0, limit);
    return res.send({ products: limitProducts });
  } catch (error) {
    res.status(500).send({ status: 'error', result: error.message });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await products.getProductById(productId);

    if (!product) return res.status(404).send({ error: "Product not found" });

    return res.send({ product: product });
  } catch (error) {
    res.status(500).send({ status: 'error', result: error.message });
  }
});

router.post('/', uploader.array('thumbnails', 3), async (req, res) => {
  try {
    if (req.files) {
      req.body.thumbnails = [];
      req.files.forEach((file) => req.body.thumbnails.push(file.filename));
    }

    const Listproducts = await products.getProducts();
    const productRepeat = Listproducts.some((prod) => prod.code === req.body.code);

    if (productRepeat) {
      return res.status(400).send({ status: "Este producto ya existe, por favor verifique" });
    }

    const requiredFields = ['title', 'description', 'price', 'stock', 'code', 'status', 'category'];

    const missingFields = requiredFields.filter((field) => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).send({ status: "Valores incompletos, por favor verifique" });
    }

    const newProduct = await products.addProduct(req.body);

    res.status(201).send({ status: "Producto Creado correctamente", result: newProduct });
  } catch (error) {
    res.status(500).send({ status: 'error', result: "No se pudo crear el producto" });
  }
});

router.put("/:pid", uploader.array('thumbnails', 3), async (req, res) => {
  try {
    if (req.files) {
      req.body.thumbnails = [];
      req.files.forEach((file) => req.body.thumbnails.push(file.filename));
    }

    const productUpdated = await products.updateProduct(req.params.pid, req.body);

    if (!productUpdated) {
      return res.status(404).send({ status: "Product not found" });
    }

    res.send({ status: "Producto actualizado", result: req.body });
  } catch (error) {
    res.status(500).send({ status: 'error', message: "No se pudo actualizar el producto" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const deleteProduct = await products.deletProduct(req.params.pid);

    if (deleteProduct === "not found") {
      return res.status(404).send({ status: "Product not found" });
    }

    res.send({ status: "Producto Eliminado Correctamente", payload: deleteProduct });
  } catch (error) {
    res.status(500).send({ status: 'error', result: error.message });
  }

  
});



export default router;