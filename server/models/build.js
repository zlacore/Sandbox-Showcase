import { DataTypes, Model } from 'sequelize'

export default class Build extends Model {
}
    
export function BuildFactory(sequelize) {

    Build.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            publicId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'user',
                    key: 'username'
                }
            },
            title: {
                type: DataTypes.STRING,
            },
            url: {
                type: DataTypes.STRING,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true
            }



        },
        {
            tableName: 'build',
            sequelize
        }
    )
    return Build
}