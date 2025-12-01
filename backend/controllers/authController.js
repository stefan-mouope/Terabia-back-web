const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AuthUser, User } = require('../models');
const config = require('../config/config');
const { USER_ROLE } = require('../constants/enums');
const { sequelize } = require('../models');

const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, { expiresIn: '1h' });
};

exports.registerUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { email, role, name, phone, city, gender, cni, avatar_url, password } = req.body;

    let authUser = await AuthUser.findOne({ where: { email } });
    if (authUser) {
      await transaction.rollback();
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const encrypted_password = await bcrypt.hash(password, salt);

    authUser = await AuthUser.create({
      email,
      encrypted_password,
    }, { transaction });

    const newUser = await User.create({
      id: authUser.id,
      role: role || USER_ROLE.BUYER,
      name,
      phone,
      city,
      gender,
      cni,
      avatar_url,
    }, { transaction });

    await transaction.commit();

    const token = generateToken(newUser.id);

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    await transaction.rollback();
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const authUser = await AuthUser.findOne({ where: { email } });

    if (authUser && (await bcrypt.compare(password, authUser.encrypted_password))) {
      const user = await User.findByPk(authUser.id);
      if (!user) {
        return res.status(404).json({ error: 'User details not found' });
      }
      const token = generateToken(user.id);
      res.status(200).json({ user, token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
