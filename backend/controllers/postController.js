import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import { v2 as cloudinary } from "cloudinary"; 

const createPost = async (req, res) => {
  try {
    const {      
      postedBy,
      text,
      img, // Assuming this is an array of base64 encoded images or URLs
      header,
      price,
      phoneNumber, 
      location,
      categories,
      condition,
      pricePoint,
    } = req.body;

    // Check required fields: only postedBy and text are mandatory
    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ error: "Posted by and text fields are required" });
    } 

    // Validate user
    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure user is authorized to create a post
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to create post" });
    }

    // Text length validation
    const maxLength = 1000;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` });
    }

    // Handle image upload (if provided)
    let imageUrls = [];
    if (img && img.length > 0) {
      // Assuming 'img' is an array of images 
      for (const image of img) {  
        const uploadedResponse = await cloudinary.uploader.upload(image);
        imageUrls.push(uploadedResponse.secure_url);
      }
    }

    // Build post data with optional fields
    const postData = {
      postedBy, 
      text,
      img: imageUrls.length > 0 ? imageUrls : undefined, // Store all image URLs in the img field
    };

    // Include optional fields only if they are provided
    if (header) postData.header = header;
    if (price) postData.price = price;
    if (phoneNumber) postData.phoneNumber = phoneNumber;
    if (location) postData.location = location;      
    if (categories) postData.categories = categories;
    if (condition !== undefined) postData.condition = condition;
    if (pricePoint !== undefined) postData.pricePoint = pricePoint;

    // Create and save the new post
    const newPost = new Post(postData);
    await newPost.save();

    // Respond with the newly created post
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err);
  }
};

// Get Post
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user is authorized to delete the post
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to delete post" });
    }

    // Handle the img field safely
    if (post.img) {
      if (typeof post.img === "string") {
        const imgId = post.img.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imgId);
      } else if (Array.isArray(post.img)) {
        // If post.img is an array, handle each image id
        for (const img of post.img) {
          const imgId = img.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(imgId);
        }
      }
      // If post.img is neither a string nor an array, you can log or handle it here as needed
    }

    // Delete the post from the database
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

// Like or Unlike Post
const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // Unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // Like post
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reply
const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const reply = { userId, text, userProfilePic, username };

    post.replies.push(reply);
    await post.save();

    res.status(200).json(reply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// // Delete Reply from Post
// const deletePostReply = async (req, res) => {
//   try {
//     const { postId, replyId } = req.params; // Get postId and replyId from request parameters
//     const userId = req.user._id; // Get the current user's ID from the request

//     // Find the post by postId
//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     // Find the reply within the post.replies array
//     const reply = post.replies.id(replyId);
//     if (!reply) {
//       return res.status(404).json({ error: "Reply not found" });
//     }

//     // Check if the user is authorized to delete the reply
//     if (reply.userId.toString() !== userId.toString()) {
//       return res.status(401).json({ error: "Unauthorized to delete this reply" });
//     }

//     // Remove the reply directly from the database using MongoDB's $pull operator
//     await Post.updateOne(
//       { _id: postId },
//       { $pull: { replies: { _id: replyId } } } // Pulls the reply out of the replies array
//     );

//     // Respond with success message
//     res.status(200).json({ message: "Reply deleted successfully" });
//   } catch (err) {
//     // Catch and respond with any errors
//     res.status(500).json({ error: err.message });
//   }
// };
 
//Get Feed Post
const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const following = user.following;

    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });

    res.status(200).json(feedPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Get User Post
const getUserPosts = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
};
