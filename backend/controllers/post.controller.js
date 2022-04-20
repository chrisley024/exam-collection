import Post from "../models/post.model";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const createPost = async (req, res) => {
  const { semester, course, dateString, pdf } = req.body;

  try {
    const post = new Post({
      semester,
      course,
      dateString,
      pdf,
      postedBy: req.user._id,
    });
    await post.save();

    res.json(post);
  } catch (error) {
    res.sendStatus(400);
  }
};

export const uploadPdf = async (req, res) => {
  try {
    const uploadedPdfUrl = await cloudinary.uploader.upload(req.files.pdf.path);

    res.json({
      url: uploadedPdfUrl.secure_url,
      public_id: uploadedPdfUrl.public_id,
    });
  } catch (error) {
    console.log(error);
  }
};

export const uploads = async (req, res) => {
  try {
    const uploads = await Post.find({ course: req.params.courseCode })
      .populate("postedBy", "_id username")
      .populate("comments.postedBy", "_id username")
      .sort({ createdAt: -1 });

    res.json(uploads);
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.body._id,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    console.log(error);
  }
};

export const unlikePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.body._id,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const { examId, comment } = req.body;
    const result = await Post.findByIdAndUpdate(
      examId,
      {
        $push: { comments: { text: comment, postedBy: req.user._id } },
      },
      { new: true }
    )
      .populate("postedBy", "_id username")
      .populate("comments.postedBy", "_id username");

    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

export const removeComment = async (req, res) => {
  try {
    const { examId, comment } = req.body;
    const result = await Post.findByIdAndUpdate(
      examId,
      {
        $pull: { comments: { _id: comment._id } },
      },
      { new: true }
    );

    res.json(result);
  } catch (error) {
    console.log(error);
  }
};
