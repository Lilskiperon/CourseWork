const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    sessionId: { type: String, unique: true, required: true },
    username: { type: String,  default: null },
    email: { type: String, match: [/^\S+@\S+\.\S+/, 'Please use a valid email address'],default: null },
    password: { type: String,  minlength: 8, default: null},
    firstName: { type: String, default: null },
    lastName: { type: String,default: null },
    phone: { type: String, match: [/^[0-9]+$/, 'Please use a valid phone number'] },
    isGuest: { type: Boolean, default: true },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Flavor",
            },
            quantity: {
                type: Number,
                default: 1,
            }, 
        },
    ],
    wishlist: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Packaging",
            },
        },
    ],
    comparison: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Packaging",
            },
        },
    ],
    expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), index: { expires: "7d" } }
},{ timestamps: true });

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }
    next();
});

userSchema.methods.comparePassword = async function(inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
