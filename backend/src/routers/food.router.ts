import { Router } from 'express'
import { sample_foods, sample_tags } from '../data';
import asyncHandler from 'express-async-handler';
import { FoodModel } from '../models/food.model';

const router = Router();

//http://localhost:5000/api/foods/seed
router.get("/seed", asyncHandler(
    async (req, res) => {
        const foodsCount = await FoodModel.countDocuments();
        if (foodsCount > 0) {
            res.send("Seed is already done!");
            return;
        } else {
            await FoodModel.create(sample_foods);
            res.send("Seed is done Successfully!");
        }
    }
));


router.get("/", async (req, res) => {
    const foods = await FoodModel.find();
    res.send(foods)
});

router.get("/search/:searchName", asyncHandler(
    async (req, res) => {
        const searchRegex = new RegExp(req.params.searchName, 'i')

        const foods = await FoodModel.find({ name: { $regex: searchRegex } })
        res.send(foods)
    }
));

router.get("/tags", asyncHandler(
    async (req, res) => {
        const tags = await FoodModel.aggregate([
            {
                $unwind: '$tags'//find similar tags and group them
            },
            {
                $group: {
                    _id: '$tags',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    count: '$count'
                }
            }
        ]).sort({ count: -1 });
        const all = {
            name: 'All',
            count: await FoodModel.countDocuments()
        }

        tags.unshift(all);//unshift is add beginig 
        res.send(tags);

    }
));

router.get("/tag/:tagName", asyncHandler(
    async (req, res) => {

        const tasgRegex = new RegExp(req.params.tagName, 'i');
        const foods = await FoodModel.find({ tags: { $regex: tasgRegex } });
        res.send(foods);

        // const foods = await FoodModel.find({ tags: req.params.tagName })
        // res.send(foods)
    }
));

router.get("/:foodId", asyncHandler(
    async (req, res) => {
        const food = await FoodModel.findById(req.params.foodId);
        res.send(food);
    }));

export default router;