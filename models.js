const mongoose = require('mongoose');
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
email: {type: String, required: true},
birth: Date,
City: String,
FavouriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
