const passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    models = require('./models.js'),
    passportJWT = require('passport-jwt');

let users = models.user,
    jwtStrategy = passportJWT.Strategy
    extractJWT = passportJWT.ExtractJwt;

passport.use(new localStrategy({
    usernameField: 'Username',
    passwordField: 'Password'
}, (username, password, callback) => {
    console.log(username + '  ' + password);
    users.findOne({Username: username}, (error, user) => {
        if (error) {
            console.log(error);
            return callback(error);
        }

        if (!user) {
            console.log('incorrect username');
            return callback(null, false, {message: 'Username or Password are incorrect.'});
        }

        console.log('finished');
        return callback(null, user);
    });

}));

passport.use(new jwtStrategy({
    jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
    return users.findById(jwtPayload._id)
    .then((user) => {
        return callback(null, user);
    })
    .catch((error) => {
        return callback(error)
    });
}));
