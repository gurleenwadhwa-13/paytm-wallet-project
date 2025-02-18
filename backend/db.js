import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email: String,
    password: {
        type: String,
        select: false,
    },
    firstName: String,
    lastName: String,
    walletBalance: {
        type: Number,
        required: false
    },
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


export default mongoose.model('Users', userSchema);