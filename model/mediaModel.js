const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      //required:true
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },

    like: { type: Number, default: 0 },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    dislikes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    comments: [
      {
        text: String,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      },
    ],
  },

  {
    timestamps: true,
  }
);

const mediaModel = mongoose.model("Media", mediaSchema);

module.exports = mediaModel;
