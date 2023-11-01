import { Router } from 'express';
import CartManager from '../cartManager.js';

const router = Router();
const carts = new CartManager('./carrito.json');

router.post('/', (req, res) => {
  try {
    const cartList = carts.createCart();
    res.send({ status: 'Cart created' });
  } catch (error) {
    res.status(500).send({ status: 'Error creating cart', error: error.message });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const idCart = parseInt(req.params.cid);
    const cartFound = await carts.getCartById(idCart);

    if (!cartFound) {
      res.status(400).send({ status: 'Error cart not found' });
    } else {
      res.send({ status: cartFound });
    }
  } catch (error) {
    res.status(500).send({ status: 'Error', error: error.message });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    const product = await carts.addProductCart(cid, pid);

    if (product === 'Producto not found' || product === 'Cart not found') {
      res.status(400).send({ status: product });
    } else {
      res.send({ result: product });
    }
  } catch (error) {
    res.status(500).send({ status: 'Error adding product to cart', error: error.message });
  }
});

export default router;