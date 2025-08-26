import { CommentFactory } from "../models/comment";
import { BuildFactory } from "../models/build.js";
import { sequelize } from "../models/index.js";
const Comment = CommentFactory(sequelize)
const Build = BuildFactory(sequelize)

// TODO: Create functions to get and upload comments to builds

export const commentOnBuild = async (req, res) => {
  const {
    buildId,
    comment,
    user
  } = req.body
  try {
    const newComment = await Comment.create({ buildId, user, comment })
    const build = await Build.findByPk(buildId)
    if (build) {
      build.commentCount += 1;
      await build.save()
    }
    res.status(201).json({ build, newComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not add comment!" });
  }
}

export const deleteComment = async (req, res) => {
  const { commentId, buildId } = req.body
  try {
    const deletedComment = await Comment.destroy({ where: { id: { commentId } } })
    const build = await Build.findByPk(buildId)
    if (build) {
      if (build.commentCount > 0) build.commentCount -= 1;
      await build.save()
    }
    res.status(200).json({ build, deletedComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete comment!" });
  }
}

export const getCommentsForBuild = async (req, res) => {
  const { buildId } = req.params;
  try {
    const comments = await Comment.findAll({ where: { buildId } });
    res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch comments!" });
  }
};