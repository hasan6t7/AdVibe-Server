const generateToken = require("../middleware/generateToken");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const User = require("./user.model");

const userRegistration = async (req, res) => {
  try {
    const user = new User({ ...req.body });
    await user.save();
    res.status(200).send({ message: "Registration Successful" });
  } catch (error) {
    console.log("registering on user: ", error);
    res.status(500).send({ message: "Registration Failed" });
  }
};

const userLoggedIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ message: "User Not Found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid Password!" });
    }

    const token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    successResponse(res, 200, "Login Successfully Done", {
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        bio: user.bio,
        profileImage: user.profileImage,
        profession: user.profession,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Logging on user: ", error);
    res.status(500).send({ message: "Login Failed" });
  }
};

const userLoggedOut = async (req, res) => {
  try {
    res.clearCookie("token");

    successResponse(res, 200, "LogOut Successful");
  } catch (error) {
    errorResponse(res, 500, "LogOut Failed", error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const user = await User.find(
      {},
      "email role profession createdAt profileImage"
    ).sort({ createdAt: -1 });
    successResponse(res, 200, "All Users Fetch Successfully", user);
  } catch (error) {
    errorResponse(res, 500, "Failed to fetch all user");
  }
};

const userDelete = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      errorResponse(res, 404, "User Not Found");
    }
    return successResponse(res, 200, "User Successfully Deleted!");
  } catch (error) {
    errorResponse(res, 500, "Failed to delete user", error);
  }
};
const userUpadate = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const updateUserRole = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );
    if (!updateUserRole) {
      return errorResponse(res, 404, "User Not Found");
    }
    return successResponse(
      res,
      200,
      "User Role Updated Successfully!",
      updateUserRole
    );
  } catch (error) {
    errorResponse(res, 500, "Failed to Update User");
  }
};

const userProfileUpdate = async (req, res) => {
  const { id } = req.params;
  const updatedDoc = req.body;

  try {
    const updatedUserProfile = await User.findByIdAndUpdate(id, updatedDoc, {
      new: true,
    });
    if (!updatedUserProfile) {
      return errorResponse(res, 404, "User Not Found");
    }
    return successResponse(
      res,
      200,
      "User Profile Updated Successfully!",
      updatedUserProfile
    );
  } catch (error) {
    errorResponse(res, 500, "Profile Edit Failed", error);
  }
};

module.exports = {
  userRegistration,
  userLoggedIn,
  userLoggedOut,
  getAllUsers,
  userDelete,
  userUpadate,
  userProfileUpdate,
};
