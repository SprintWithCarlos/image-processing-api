const router = require("express").Router();
const Post = require("../models/Post");
const mongoose = require("mongoose");
const upload = require("../upload");
const s3 = require("../filebase");

//Create One
router.post("/upload", upload.single("file"), async (req, res) => {
  const { title } = req.body;
  try {
    const locations = req.file.transforms.map((item) => {
      return { [item.id]: item.location };
    });
    let images = {};
    const [small, medium, large] = locations;
    images = { ...small, ...medium, ...large };

    const post = await new Post({
      title,
      images,
    });
    post.save();

    res.status(201).json({
      message: "Created",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
//Get All Posts
router.get("/", async (req, res) => {
  try {
    const list = await Post.find();
    // list = getData(result);

    res.status(200).json({
      total: list.length,
      data: list.sort((a, b) => b.createdAt - a.createdAt),
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { images } = await Post.findById(id);
    const { small, medium, large } = images;
    const data = [small, medium, large];
    const Bucket = "devchallenges";
    const deleteS3 = async (url, Bucket) => {
      let { pathname } = new URL(url, "http://example.org");
      pathname = pathname.substring(1);
      const params = {
        Bucket,
        Key: pathname,
      };
      await s3.deleteObject(params).promise();
    };

    data.forEach((url) => {
      deleteS3(url, Bucket);
    });
    await Post.findByIdAndDelete(id);

    res.status(200).json({
      message: "Post with ID " + id + " has been deleted",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// //Get All Posts by User ID
// // router.get("/:userId/publications", async (req, res) => {
// //   try {
// //     const { userId } = req.params;
// //     const checkUser = await User.exists({ _id: userId });
// //     !checkUser && res.status(404).json("User not found");
// //     const list = await Post.find({ userId }).sort({ createdAt: -1 });
// //     !list.length > 0 && res.status(200).json("This users has no posts");
// //     res.status(200).json(list);
// //   } catch (err) {
// //     res.status(500).json(err);
// //   }
// // });
// //Get All Posts by Username
// // router.get("/:username/publications", async (req, res) => {
// //   try {
// //     const { username } = req.params;
// //     const checkUser = await User.exists({ username });
// //     !checkUser && res.status(404).json("User not found");
// //     const user = await User.findOne({ username });
// //     const list = await Post.find({ author: user._id })
// //       .select({ __v: 0 })
// //       .sort({ createdAt: -1 });
// //     // !list.length > 0 && res.status(200).json("This users has no posts");
// //     res.status(200).json({
// //       total: list.length,
// //       data: list,
// //     });
// //   } catch (err) {
// //     res.status(500).json(err);
// //   }
// // });
// //Get One Post by ID
// router.get("/:postId", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.postId).select({ __v: 0 });
//     !post && res.status(404).json("Post not found");
//     res.status(200).json(post);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
// //Update One
// router.put("/:postId", async (req, res) => {
//   const { postId } = req.params;
//   try {
//     const payload = req.body;
//     const post = await Post.findById(postId);
//     !post && res.status(404).json("Post not found");
//     if (post.author == req.body.userId) {
//       await post.update(payload, { upsert: true });
//       const updatedPost = await Post.findById(postId).select({ __v: 0 });
//       res.status(200).json({
//         message: "Updated",
//         data: updatedPost,
//       });
//     } else {
//       res.status(401).json("Unauthorized");
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
// //Delete One
// router.delete("/:postId", async (req, res) => {
//   const { postId } = req.params;
//   try {
//     const payload = req.body;
//     const post = await Post.findById(postId);
//     !post && res.status(404).json("Post not found");
//     if (post.author == req.body.userId) {
//       const author = await User.findById(post.author);
//       await author.updateOne({ $pull: { posts: postId } });
//       await post.delete();
//       res.status(200).json({
//         message: "Deleted",
//       });
//     } else {
//       res.status(401).json("Unauthorized");
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
//   try {
//     const { postId } = req.params;
//     const post = await Post.findById(postId);
//     !post && res.status(404).json("Post not found");
//     const author = await User.findById(post.author);

//     await author.updateOne({ $pull: { posts: postId } });
//     await post.delete();
//     res.status(200).json("Deleted");
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
// //Like Post
// router.put("/:postId/like", async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const { userId } = req.body;
//     const post = await Post.findById(postId);
//     // !post && res.status(404).json("Post not found");
//     if (!post.likes.includes(userId)) {
//       await post.updateOne({ $push: { likes: userId } });
//       await User.findByIdAndUpdate(userId, { $push: { likedPosts: postId } });
//       res.status(200).json("Liked");
//     } else {
//       await post.updateOne({ $pull: { likes: userId } });
//       await User.findByIdAndUpdate(userId, { $pull: { likedPosts: postId } });
//       res.status(200).json("Unliked");
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
// // //Unlike post
// // router.put("/:postId/:userId/unlike", async (req, res) => {
// //   try {
// //     const { postId, userId } = req.params;
// //     const post = await Post.findById(postId);
// //     !post && res.status(404).json("Post not found");
// //     if (post.likes.includes(userId)) {
// //     } else {
// //       res.status(403).json("You haven't liked this post");
// //     }
// //     res.status(201).json("Unliked");
// //   } catch (err) {
// //     res.status(500).json(err);
// //   }
// // });
// //TimeLine
// router.get("/timeline/:userId", async (req, res) => {
//   let timeline = [];
//   try {
//     const { userId } = req.params;
//     const checkUser = await User.exists({ _id: userId });
//     !checkUser && res.status(404).json("User not found");
//     // const currentUser = await User.findById(userId)
//     // // const userPosts = await Post.find({userId: currentUser._id})
//     // const friendPosts = await Promise.all(
//     //     currentUser.following.map(friendId=>{
//     //         return Post.find({userId: friendId})
//     //     })
//     // )

//     const friendPosts = await User.findById(userId)
//       .select("following")
//       .select("posts")
//       .populate({
//         path: "following",
//         populate: {
//           path: "posts",
//         },
//       });
//     friendPosts.following.map((friend) => {
//       return friend.posts.map((post) => {
//         return timeline.push(post);
//       });
//     });
//     const result = timeline.sort((a, b) => b.createdAt - a.createdAt);
//     res.status(200).json(result);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;
