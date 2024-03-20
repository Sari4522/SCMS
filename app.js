const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();
const port = 3000;
// Use MongoDB session store
const store = new MongoDBStore({
    uri: 'mongodb+srv://saritha:Sari4522@cluster0.omlduk9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    collection: 'sessions'
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); 
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: store
}));

mongoose.connect('mongodb+srv://saritha:Sari4522@cluster0.omlduk9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const User = mongoose.model('user', userSchema);

app.get('/', (req, res) => {
    res.render('login.ejs');
});

app.get('/signup', (req, res) => {
    res.render('signup.ejs');
});

app.post('/signup', async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    const user = await User.findOne({ email });
    
    if (user) {
        res.status(400).send('User already exists.');
    } else {
        if (password === confirmPassword) {
            const newUser = new User({
                email: email,
                password: password,
            });
            await newUser.save();
            res.redirect("/");
        } else {
            res.redirect('/signup?error=passwordMismatch');
        }
    }
});

app.post('/login', async (req, res) => {
    const { email, password, rememberMe } = req.body; // Added rememberMe from the form data
    const user = await User.findOne({ email });

    if (user) {
        if (password === user.password) {
            req.session.loggedIn = true;
            // If Remember Me checkbox is checked, set cookies with username and password
            if (rememberMe === 'on') {
                res.cookie('email', email, { maxAge: 900000, httpOnly: true }); // Set cookie for email with a 15-minute expiry
                res.cookie('password', password, { maxAge: 900000, httpOnly: true }); // Set cookie for password with a 15-minute expiry
            }
            res.render('home.ejs');
        } else {
            res.render('login.ejs')
        }
    }
    else {
        res.render('login.ejs')
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
