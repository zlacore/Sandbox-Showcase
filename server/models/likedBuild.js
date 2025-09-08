import { DataTypes, Model } from "sequelize";

export default class LikedBuild extends Model {}

export function LikedBuildFactory(sequelize) {
  LikedBuild.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user: { type: DataTypes.STRING, allowNull: false }, // or userId
      buildId: { type: DataTypes.INTEGER, allowNull: false }, // or INTEGER
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "liked_builds",
      sequelize,
    }
  );
  return LikedBuild;
}