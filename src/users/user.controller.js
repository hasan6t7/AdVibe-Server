const generateToken = require("../middleware/generateToken");
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

    res.status(200).send({
      message: "Login Successfully Done",
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
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

module.exports = {
  userRegistration,
  userLoggedIn,
};
