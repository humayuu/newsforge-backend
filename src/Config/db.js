import mongoose from "mongoose";

const conn = async (req, res) => {
  try {
  } catch (error) {
    console.log("Something Went Wrong ", error);

    return res.status(500).send({
      status: false,
      message: "Internal Server error",
    });
  }
};

export default conn;
