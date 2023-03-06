import express, { request, response } from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import dbConnect from './db/dbConnect.js';
import User from './db/models/user.js';
import auth from './auth.js';

const app = express();

dbConnect()
    .then(() => console.log('Successfully connected to local MongoDB'))
    .catch((err) => console.log(err));

// cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    next();
});

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (request, response, next) => {
    response.json({ message: 'Hey! This is your server response!' });
    next();
});

// register endpoint
app.post('/register', async (request, response) => {
    const { email, password } = request.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // hash password before saving in database

        // create a new user instance and collect the data
        const user = new User({
            email,
            password: hashedPassword,
        });

        const savedUser = await user.save(); // save user

        // return success if the new user is added to the database successfully
        response.status(201).send({
            message: 'New user created successfully!',
            savedUser,
        });
    } catch (err) {
        // hash password error
        response.status(500).send({
            message: 'Creating a new user was not successful!',
            err,
        });
    }
});

app.post('/login', async (request, response) => {
    const { email, password } = request.body;

    try {
        const user = await User.findOne({ email }); // try to find user in db

        // check if user with given email is registred
        if (!user) {
            throw { message: 'Email not found!', status: 404 };
        }

        const isPasswordsMatch = await bcrypt.compare(password, user.password); // compare user password and password from requset

        // send error if passwords are not the same
        if (!isPasswordsMatch) {
            throw { message: 'Passwords does not match', status: 400 };
        }

        // create jwt token
        const token = jwt.sign(
            {
                userId: user._id,
                userEmail: user.email,
            },
            'RANDOM-SECRET-TOKEN',
            { expiresIn: '24h' }
        );

        // success res
        response.status(200).send({
            message: 'Login Successful',
            email: user.email,
            token,
        });
    } catch (err) {
        response.status(err.status).send({
            message: err.message,
        });
    }
});

// free endpoint
app.get('/free-endpoint', (request, response) => {
    response.json({ message: 'You are free to access me anytime' });
});

// authentication endpoint
app.get('/auth-endpoint', auth, (request, response) => {
    response.json({ message: 'You are authorized to access me' });
});

export { app };
