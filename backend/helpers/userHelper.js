const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports = {
  signup: (name, email, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          return reject(new Error(" This Email already exists"));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword });

        const savedUser = await newUser.save();

          const token = jwt.sign(
          { id: savedUser._id, email: savedUser.email },
           process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );
        console.log(token);
        


        resolve({ user: savedUser, token }); 

      } catch (err) {
        reject(err);
      }
    });
  },
  login: (email, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return reject(new Error("Invalid email"));
        } else {
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return reject(new Error("Invalid password"));
          }else {
            const token = jwt.sign(
              { id: user._id, email: user.email },
              process.env.JWT_SECRET,
              { expiresIn: '1d' }
            );
            console.log(token);
            resolve({ user, token });
          }
        }
      } catch (err) {
        reject(err);
      }
    });
  }   
};
