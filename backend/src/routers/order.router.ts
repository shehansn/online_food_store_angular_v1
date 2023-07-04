import { Order, OrderModel } from './../models/order.model';
import { Router } from 'express'
import asyncHandler from 'express-async-handler';
import { HTTP_BAD_REQUEST } from '../constants/http_status';
import { OrderStatus } from '../constants/order_status';
import auth from '../middlewares/auth.middleware';
import { UserModel } from '../models/user.model';

const router = Router();
router.use(auth);

router.post('/create',
    asyncHandler(async (req: any, res: any) => {
        const requestOrder = req.body;
        console.log('requestOrder', requestOrder);

        if (requestOrder.items.length <= 0) {
            res.status(HTTP_BAD_REQUEST).send('Cart Is Empty!');
            return;
        }

        await OrderModel.deleteOne({
            user: req.body.user.id,
            status: OrderStatus.NEW
        });

        const newOrder = new OrderModel({ ...requestOrder, user: req.body.user.id, items: req.body.items });
        await newOrder.save();
        console.log('newOrder', newOrder);
        res.send(newOrder);
    })
);

router.get('/newOrderForCurrentUser', asyncHandler(async (req: any, res) => {
    //const order = await getNewOrderForCurrentUser(req);
    console.log('Order req', req.user);
    const user = await UserModel.findOne({ email: req.user.email });
    console.log('user ', user);
    const order = await OrderModel.findOne({ user: user?.id, status: OrderStatus.NEW });
    if (order) res.send(order);
    else res.status(HTTP_BAD_REQUEST).send();
}));

router.post('/pay', asyncHandler(async (req: any, res) => {
    console.log('pay req', req);
    console.log('pay paymentId req', req.body);
    const { paymentId } = req.body;
    const user = await UserModel.findOne({ email: req.user.email });
    console.log('user ', user);
    const order = await OrderModel.findOne({ user: user?.id, status: OrderStatus.NEW });
    //const order = await getNewOrderForCurrentUser(req);
    if (!order) {
        res.status(HTTP_BAD_REQUEST).send('Order Not Found!');
        return;
    }

    order.paymentId = paymentId;
    order.status = OrderStatus.PAYED;
    await order.save();

    res.send(order._id);
}))

router.get('/track/:id', asyncHandler(async (req, res) => {
    const order = await OrderModel.findById(req.params.id);
    res.send(order);
}))


export default router;

async function getNewOrderForCurrentUser(req: any) {
    return await OrderModel.findOne({ user: req.body.user.id, status: OrderStatus.NEW });
}

