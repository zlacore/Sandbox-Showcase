import { DataTypes, Model } from 'sequelize'

export default class Build extends Model {
    id;
    title;
    url;
}
    
export function BuildFactory(sequelize) {

    Build.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING,
            },
            url: {
                type: DataTypes.STRING,
            },



        },
        {
            tableName: 'build',
            sequelize
        }
    )
    return Build
}