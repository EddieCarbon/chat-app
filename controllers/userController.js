const mongoose = require('mongoose');
const User = mongoose.model('User');
const sha256 = require('js-sha256');
const jwt = require('jwt-then');


exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

    if (!emailRegex.test(email)) throw 'Email is not valid';
    if (!passwordRegex.test(password)) throw 'Password is not valid';

    const user = new User({ 
        name,
        email,
        password: sha256(password + process.env.SALT),
    });

    await user.save();

    res.json({
        message: 'User [' + name + '] registered successfully!'
    });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ 
        email,
        password: sha256(password + process.env.SALT),
    });

    if (!user) throw 'Email or password is not valid';

    const token = await jwt.sign({ id: user.id }, process.env.SECRET);

    res.json({
        message: 'User [' + user.name + '] logged in successfully!',
        token,
    });
};