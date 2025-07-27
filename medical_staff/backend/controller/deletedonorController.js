const db = require('../db');

exports.deleteDonor = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM users WHERE user_id = $1', [id]);
    res.status(200).json({ message: 'Donor deleted successfully' });
  } catch (err) {
    console.error('Error deleting donor:', err);
    res.status(500).json({ error: 'Failed to delete donor' });
  }
};
