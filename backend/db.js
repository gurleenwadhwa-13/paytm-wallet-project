import { Schema, model} from "mongoose"

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        minLength: 6,
        select: false,
    },
    firstName: String,
    lastName: String
});

const bankAccountSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true},
    walletBalance: {
        type: Number,
        required: true
    }
});

//User logic to hash passwords
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     confirm.log(this.password);
//     next();
// })

// // // Match password during login
// userSchema.methods.matchPassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };


const Users = model('Users', userSchema);
const Accounts = model('Accounts', bankAccountSchema);

module.exports = {
    Accounts, Users
}