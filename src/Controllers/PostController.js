import Post from "../Models/Post.js";
import slugify from "slugify";

// Shared error handler for Post controllers
const handleError = (res, error) => {
  if (error.code === 11000) {
    return res.status(409).send({
      status: false,
      message: "Post with this title already exists",
    });
  }

  if (error.name === "CastError") {
    return res.status(404).send({
      status: false,
      message: "Invalid Post id",
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).send({
      status: false,
      message: error.message,
    });
  }

  console.error("Something went wrong ", error);
  return res.status(500).send({
    status: false,
    message: "Internal Server Error",
  });
};

// For get all Post
const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find({ isPublished: true });

    return res.status(200).send({ status: true, data: posts });
  } catch (error) {
    return handleError(res, error);
  }
};

// For get all posts - admin/author dashboard
const getAllPostForDashboard = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "author") {
      filter = { user: req.user.id };
    }

    const posts = await Post.find(filter);

    return res.status(200).send({ status: true, data: posts });
  } catch (error) {
    return handleError(res, error);
  }
};

// For get post by ID
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).send({
        status: false,
        message: "Invalid Post id",
      });
    }

    return res.status(200).send({ status: true, data: post });
  } catch (error) {
    return handleError(res, error);
  }
};

// For Create Post
const createPost = async (req, res) => {
  try {
    const { category, title, content, isPublished, publishedAt, status } =
      req.body;

    // generate Slug
    const generateSlug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

    const newPost = await Post.create({
      user: req.user.id,
      category,
      title,
      slug: generateSlug,
      content,
      isPublished,
      publishedAt,
      status,
    });

    return res.status(201).send({
      status: true,
      message: "Post Created Successfully",
      data: newPost,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// For update Post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, title, content, isPublished, publishedAt, status } =
      req.body;

    // Fetch first so we can check ownership before writing anything
    const existingPost = await Post.findById(id);

    if (!existingPost) {
      return res.status(404).send({
        status: false,
        message: "Invalid Post id",
      });
    }

    // Admin can edit any post. Author can only edit their own.
    if (
      req.user.role === "author" &&
      existingPost.user.toString() !== req.user.id
    ) {
      return res.status(403).send({
        status: false,
        message: "You can only edit your own posts",
      });
    }

    const update = {};

    if (category !== undefined) {
      update.category = category;
    }

    if (title !== undefined) {
      update.title = title;
      update.slug = slugify(title, {
        lower: true,
        strict: true,
        trim: true,
      });
    }

    if (content !== undefined) {
      update.content = content;
    }

    if (isPublished !== undefined) {
      update.isPublished = isPublished;
    }

    if (publishedAt !== undefined) {
      update.publishedAt = publishedAt;
    }

    if (status !== undefined) {
      update.status = status;
    }

    const post = await Post.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    return res.status(200).send({
      status: true,
      message: "Post updated Successfully",
      data: post,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// For delete Post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch first so we can check ownership before deleting
    const existingPost = await Post.findById(id);

    if (!existingPost) {
      return res.status(404).send({
        status: false,
        message: "Invalid Post id",
      });
    }

    // Admin can delete any post. Author can only delete their own.
    if (
      req.user.role === "author" &&
      existingPost.user.toString() !== req.user.id
    ) {
      return res.status(403).send({
        status: false,
        message: "You can only delete your own posts",
      });
    }

    await Post.findByIdAndDelete(id);

    return res
      .status(200)
      .send({ status: true, message: "Post deleted Successfully" });
  } catch (error) {
    return handleError(res, error);
  }
};

export {
  getAllPost,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getAllPostForDashboard,
};
