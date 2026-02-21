import Session from "../../models/Session.js";

export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.id })
      .sort({ lastActive: -1 });

    res.json({
      success: true,
      sessions
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
