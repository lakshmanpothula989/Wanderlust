const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;


const userSchema = new Schema({
    email : {
        type : String,
        required : true,
    }
});

userSchema.plugin(passportLocalMongoose);
// above plugin is mainly used because we don't need to create any functions
// because nodejs automatically create hashing,salting and username and password
module.exports = mongoose.model("User",userSchema);


