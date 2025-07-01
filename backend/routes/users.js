var express = require('express');
const userHelper = require('../helpers/userHelper');
const { response } = require('../app');
var router = express.Router();


/* GET users listing. */
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const { user, token } = await userHelper.signup(name, email, password);
    res.status(201).json({ message: "User registered", user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.post('/login', async (req, res) => {
  
  const { email, password } = req.body;
  try {
    const { user, token } = await userHelper.login(email, password);
    res.status(200).json({ message: "User logged in", user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
module.exports = router;
