const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('../service/token-service')
const UserDto = require('../dtos/user-dto')

class UserService{
    async registration(email, password) {

        // Проверяем, существует ли пользователь с данным email
        const candidate = await UserModel.findOne({ email });
        if (candidate) {
            throw new Error(`Пользователь с email ${email} уже существует`);
        }

        // Хешируем пароль
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4(); // Генерируем уникальную ссылку активации

        // Создаем нового пользователя
        const user = await UserModel.create({ email, password: hashPassword, activationLink });
        await mailService.sendActivationMail(email, activationLink); // Отправляем письмо для активации

        const userDto = new UserDto(user); // Создаем DTO пользователя для удобства передачи данных

        // Генерация токенов с использованием асинхронной функции
        const tokens = await tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken); // Сохраняем refreshToken в базе данных

        // Возвращаем токены и информацию о пользователе
        return { ...tokens, user: userDto };
    }
    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }
}

module.exports = new UserService()