import { sample_foods, sample_tags } from '../backend/src/data';
import express from 'express';
import cors from "cors"

const app = express();

app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}));

app.get("/api/foods", (req, res) => {
    res.send(sample_foods)
})

app.get("/api/foods/search/:searchName", (req, res) => {
    const searchName = req.params.searchName;
    const foods = sample_foods.filter(food => food.name?.toLowerCase().includes(searchName.toLowerCase()));
    res.send(foods)
})

app.get("/api/foods/tags", (req, res) => {
    res.send(sample_tags)
})

app.get("/api/foods/tag/:tagName", (req, res) => {
    const tagName = req.params.tagName;
    const foods = sample_foods.filter(food => food.tags?.map((tag: string) => tag.toLowerCase()).includes(tagName.toLowerCase()));
    res.send(foods)
})

app.get("/api/foods/:foodId", (req, res) => {
    const foodId = req.params.foodId;
    const food = sample_foods.find(food => food.id == foodId)
    res.send(food)
})


const port = 5000;
app.listen(port, () => {
    console.log(" server is running on http://localhost:" + port)
})