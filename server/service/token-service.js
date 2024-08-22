const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');

class TokenService {

    // Генерация токенов с указанным временем жизни
    async generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

        return { accessToken, refreshToken };
    }

    // Сохранение или обновление токена в базе данных
    async saveToken(userId, refreshToken) {
        try {
            // Используем findOneAndUpdate с опцией upsert для обновления или создания токена
            const token = await tokenModel.findOneAndUpdate(
                { user: userId },
                { refreshToken },
                { new: true, upsert: true }
            );
            return token;
        } catch (error) {
            console.error('Error saving token:', error);
            throw error; // Прокидываем ошибку дальше, чтобы её можно было обработать выше по цепочке
        }
    }
}

module.exports = new TokenService();
