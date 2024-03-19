const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect('mongodb+srv://saritha:Sari4522@cluster0.omlduk9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
});

const User = mongoose.model('user', userSchema)

app.get('/', (req, res) => {
    res.render('login.ejs');
});

app.get('/signup', (req, res) => {
    res.render('signup.ejs');
});

app.post('/login', async (req, res) => {
    const { userName, password } = req.body;
    console.log(req.body);
    console.log(userName, password);
    const user = await User.findOne({ userName });

    if (user) {
        if (password === user.password) {
            
            res.renser('home.ejs');
        } else {
            res.render('login.ejs')
        }
    }
    else {
        res.render('login.ejs')
    }}
);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});