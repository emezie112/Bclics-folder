import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      maxLength: 1000,
    },
    img: {
      // Change to an array of strings to store multiple image URLs
      type: [String],
    },
    likes: {
      // Array of user IDs
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    replies: [
      {
        userId: {  
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        userProfilePic: {
          type: String,
        },
        username: {
          type: String,
        },
      },
    ],
    // New fields
    header: {
      type: String,
    },
    price: {
      type: Number,
    },
    phoneNumber: {
      type: Number,
    },
    location: {
      type: String,
    },
    categories: {
      type: String,
      enum: ["Electronics", "Furniture", "Clothing", "Services", "Others"], // Example categories
    },
    condition: {
      type: String,
    },
    pricePoint: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
