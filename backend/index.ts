import { sample_foods, sample_tags, sample_users } from '../backend/src/data';
import express from 'express';
import cors from "cors"
import jwt from 'jsonwebtoken'

const app = express();
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}));

app.get("/api/foods", (req, res) => {
    res.send(sample_foods)
});

app.get("/api/foods/search/:searchName", (req, res) => {
    const searchName = req.params.searchName;
    const foods = sample_foods.filter(food => food.name?.toLowerCase().includes(searchName.toLowerCase()));
    res.send(foods)
});

app.get("/api/foods/tags", (req, res) => {
    res.send(sample_tags)
});

app.get("/api/foods/tag/:tagName", (req, res) => {
    const tagName = req.params.tagName;
    const foods = sample_foods.filter(food => food.tags?.map((tag: string) => tag.toLowerCase()).includes(tagName.toLowerCase()));
    res.send(foods)
});

app.get("/api/foods/:foodId", (req, res) => {
    const foodId = req.params.foodId;
    const food = sample_foods.find(food => food.id == foodId)
    res.send(food)
});

app.post("/api/users/login", (req, res) => {
    const { email, password } = req.body; //destructuring assignment
    const user = sample_users.find(user => user.email === email && user.password === password);
    if (user) {
        res.send(generateTokenResponse(user));
    } else {
        res.send(400).send("user not found");
    }
});

const generateTokenResponse = (user: any) => {
    const token = jwt.sign(
        {
            email: user.email,
            isAdmin: user.isAdmin
        },
        "secretToken",
        { expiresIn: '1d' }
    );
    user.token = token;
    return user
}



const port = 5000;

app.listen(port, () => {
    console.log(" server is running on http://localhost:" + port)
});