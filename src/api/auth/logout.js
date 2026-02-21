export const logout = (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logout successful' });
};
