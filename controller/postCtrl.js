const mediaModel = require("../model/mediaModel");

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res
        .status(422)
        .send({ message: "Please add all the fields", success: false });
    }

    const post = new mediaModel({
      title,
      content,
      postedBy: req.user.id,
    });

    const result = await post.save();
    return res
      .status(201)
      .send({ message: "Post Created", data: result, success: true });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ message: "An error occurred", success: false });
  }
};

const getAllPost = async (req, res) => {
  try {
    const posts = await mediaModel
      .find()
      .populate("postedBy", "_id username")
      .populate("comments.postedBy", "_id username")
      .populate("likes", "username")
      .sort("-createdAt");

    return res.status(200).send({ data: posts, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "An error occurred while fetching posts",
      success: false,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { content, title } = req.body;

    // Find the post by ID
    const post = await mediaModel.findById(id);

    if (!post) {
      return res
        .status(404)
        .send({ message: "Post not found", success: false });
    }

    // Check if the post was created by the same user
    if (post.postedBy.toString() !== userId.toString()) {
      return res.status(403).send({
        message: "You are not authorized to update this post",
        success: false,
      });
    }

    // Update the post
    const updatedPost = await mediaModel.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );

    return res.send({ data: updatedPost, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "An error occurred", success: false });
  }
};

const deleteAPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the post by ID
    const post = await mediaModel.findById(id);

    if (!post) {
      return res
        .status(404)
        .send({ message: "Post not found", success: false });
    }

    // Check if the post was created by the same user
    if (post.postedBy.toString() !== userId.toString()) {
      return res.status(403).send({
        message: "You are not authorized to delete this post",
        success: false,
      });
    }

    const result = await mediaModel.findByIdAndDelete(id);
    res.send({ message: "Post deleted", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "An error occurred", success: false });
  }
};

const like = async (req, res) => {
  try {
    const { _id } = req.body;

    const post = await mediaModel.findById(_id);

    if (!post) {
      return res
        .status(404)
        .send({ message: "Post not found", success: false });
    }

    const isLiked = await mediaModel.findOne({ _id, likes: req.user.id });

    if (isLiked) {
      return res.status(200).send({ message: "Already liked", success: false });
    }

    const result = await mediaModel.findByIdAndUpdate(
      _id,
      {
        $push: { likes: req.user.id },
        $inc: { like: 1 },
      },
      {
        new: true,
      }
    );

    return res.status(200).send({ data: result, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "An error occurred", success: false });
  }
};

const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.username;

    const post = await mediaModel.findById(id);
    if (!post) {
      return res
        .status(404)
        .send({ message: "Post not found", success: false });
    }

    const updatedPost = await mediaModel.findByIdAndUpdate(
      id,
      {
        $push: { comments: { userId, text } },
      },
      { new: true }
    );

    if (!updatedPost) {
      return res
        .status(500)
        .send({ message: "Failed to add comment", success: false });
    }

    return res
      .status(200)
      .send({ message: "Comment added", data: updatedPost, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "An error occurred", success: false });
  }
};

module.exports = {
  createPost,
  getAllPost,
  updatePost,
  deleteAPost,
  like,
  commentPost,
};
