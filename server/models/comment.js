import { DataTypes, Model } from 'sequelize'

export class Comment extends Model { }

export function CommentFactory(sequelize) {
    Comment.init(
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            buildId: { type: DataTypes.STRING, allowNull: false }, // or INTEGER if your build PK is int
            user: { type: DataTypes.STRING, allowNull: false }, // or userId if you prefer
            text: { type: DataTypes.TEXT, allowNull: false },
            createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        },
        {
      tableName: "comments",
      sequelize,
    }
    )
    return Comment
}