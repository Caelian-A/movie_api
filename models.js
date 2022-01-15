const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String,
    },
    Directors: [{ Name: String, Bio: String, Birth: Date, Death: Date }],
    ImageURL: String, 
    Featured: Boolean, 
    Rating: Number,
    ReleaseDate: Date
    
});

let userSchema = mongoose.Schema({
Username: {type: String, required: true},
Password: {type: String, required: true},
Email: {type: String, required: true},
Birth: Date,
City: String,
FavouriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'movie'}]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};

let movie = mongoose.model('movie', movieSchema);
let user = mongoose.model('user', userSchema);

module.exports.movie = movie;
module.exports.user = user;
