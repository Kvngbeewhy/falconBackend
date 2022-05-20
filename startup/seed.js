const { User } = require("../models/user");
const { Item } = require("../models/item")
const bcrypt = require("bcryptjs");

module.exports = async () => {
  const userExists = await User.findOne({
    email: "godmode@falcon.com",
    phone: "0123456789",
    status: "active",
  });

  if (!userExists) {
    const password = "12345678";
    const user = await User.create({
      firstName: "Test",
      lastName: "tester",
      email: "godmode@falcon.com",
      phone: "0123456789",
      password,
      status: "active",
      isVerified: true,
    });

    //create salt for user password hash
    const salt = await bcrypt.genSalt(10);

    //replace user password with the hashed password
    user.password = await bcrypt.hash(password, salt);

    // save user to db
    await user.save();
    console.log('seed user "admin" created...');
  }
  console.log(":-)");

  const itemExist = await Item.findOne({
    name: "Galaxy A5"
  });

  if (!itemExist) {
    const item = await Item.create({
      name: "Galaxy A5",
      price: "100000",
      quantity: "50",
      description: "A new model whatever"
    });
    await item.save();
    console.log('seed item created...');
};
}
