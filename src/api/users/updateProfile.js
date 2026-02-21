import User from "../../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const { username, phone, country } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'Username already exists' });
      }
      user.username = username;
    }

    if (phone) user.phone = phone;
    if (country) user.country = country;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toObject({ versionKey: false })
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
