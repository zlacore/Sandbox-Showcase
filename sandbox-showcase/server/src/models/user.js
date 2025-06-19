import { DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import bcrypt from 'bcrypt'
export class User {
    constructor() {
        id,
        username,
        email,
        password,
        images
    }
    async setPassword(password) {
        this.password = await bcrypt.hash(password, 10);
    }

    async checkPassword(testPassword) {
        return await bcrypt.compare(testPassword, this.password)
    }
}
