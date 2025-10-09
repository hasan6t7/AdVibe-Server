const User = require("./user.model");

const userRegistration = async (req, res) => {
  try {
    const user = new User({ ...req.body });
    await user.save();
    res.status(200).send({message: "Registration Successful"})
  } catch (error) {
    console.log("registering on user: ", error);
    res.status(500).send({ message: "Registration Failed" });
  }
};

module.exports = {
  userRegistration,
};
