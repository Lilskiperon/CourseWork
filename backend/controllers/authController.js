const jwt = require('jsonwebtoken');
const { User} = require("../models");
const crypto = require('crypto');
require('dotenv').config();
const redis = require("../config/redis.js");
exports.checkOrCreateGuest = async (req, res) => {
    try {
        let sessionId = req.cookies.NgMassa;
        if (!sessionId) {
            sessionId = generateSessionId();
            res.cookie("NgMassa", sessionId, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: false, secure: false, sameSite: "Lax" });
            const guestUser = await User.create({ sessionId, isGuest: true });
            return res.json({
                _id: guestUser._id,
                sessionId: guestUser.sessionId,
                isGuest: true,
            });
        }
        let user = await User.findOne({ sessionId });

        return res.json({
                _id: user._id,
				email: user.email,
				isGuest: user.isGuest,
                phone: user.phone,
                firstName: user.firstName,
                lastName: user.lastName});
    } catch (error) {
        console.error("Ошибка создания гостя:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const generateTokens = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});

	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});

	return { accessToken, refreshToken };
};

const generateSessionId = () => {
    return 'ngmassa-' + crypto.randomBytes(16).toString('hex');
};

const storeRefreshToken = async (userId, refreshToken) => {
	await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7days
};

const setCookies = (res, accessToken, refreshToken) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true, // prevent XSS attacks, cross site scripting attack
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
		maxAge: 15 * 60 * 1000, // 15 minutes
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true, // prevent XSS attacks, cross site scripting attack
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});
};

exports.signupUser = async (req, res) => {
    try {
        let sessionId = req.cookies.NgMassa;
        const { email, password, firstName, lastName, phone } = req.body;
        console.log('Полученные данные:', {email, password, firstName, lastName, phone });
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email уже зарегистрирован!" });
        }

        let user = await User.findOne({ sessionId });


        user.email = email;
        user.password = password;
        user.firstName = firstName;
        user.lastName = lastName;
        user.phone = phone;
        user.isGuest = false; 
        await user.save();

        res.status(201).json({ message: "Регистрация успешна!", user: {  
                _id: user._id,
				email: user.email,
				isGuest: user.isGuest,
                phone: user.phone,
                firstName: user.firstName,
                lastName: user.lastName
             } });
    } catch (error) {
        console.error("Ошибка регистрации пользователя:", error);
        res.status(500).json({ error: "Ошибка сервера. Попробуйте снова." });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password, rememberMe } = req.body;
    console.log('Полученные данные:', { email, password, rememberMe });
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Пользователь не найден' });
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Неверный пароль' });
        
        const guestSessionId = req.cookies.NgMassa;
        if (guestSessionId) {
            const guestUser = await User.findOne({ sessionId: guestSessionId, isGuest: true });
            if (guestUser && guestUser._id.toString() !== user._id.toString()) {
                if (guestUser.cartItems && guestUser.cartItems.length > 0) {
                
                    if (!user.cartItems || user.cartItems.length === 0) {
                        user.cartItems = guestUser.cartItems;
                    }
                    await user.save();
                }
                await User.deleteOne({ _id: guestUser._id });
            }
        }
        res.cookie("NgMassa", user.sessionId, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: false,
            secure: false,
            sameSite: "Lax"
        });

        const { accessToken, refreshToken } = generateTokens(user._id);
	    await storeRefreshToken(user._id, refreshToken);
	    setCookies(res, accessToken, refreshToken);
        res.json({ message: 'Успешный вход',
                _id: user._id,
				email: user.email,
				isGuest: user.isGuest,
                phone: user.phone,
                firstName: user.firstName,
                lastName: user.lastName,
            });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
};
exports.logoutUser = (req, res) => {
    try {
        res.clearCookie('authToken', { httpOnly: true, sameSite: 'Lax' }); 
        return res.json({ message: 'Вы успешно вышли из системы' });
    } catch (error) {
        return res.status(500).json({ message: 'Ошибка при выходе', error });
    }
};

exports.refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ message: "No refresh token provided" });
		}

		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

		if (storedToken !== refreshToken) {
			return res.status(401).json({ message: "Invalid refresh token" });
		}

		const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 15 * 60 * 1000,
		});

		res.json({ message: "Token refreshed successfully" });
	} catch (error) {
		console.log("Error in refreshToken controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

exports.getProfile = async (req, res) => {
	try {
        let sessionId = req.cookies.NgMassa;
        const user = await User.findOne({ sessionId });
        res.json(user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};