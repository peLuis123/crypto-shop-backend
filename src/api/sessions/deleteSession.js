import Session from "../../models/Session.js";

export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const session = await Session.findById(id);
    
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    if (session.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    await Session.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Session terminated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
