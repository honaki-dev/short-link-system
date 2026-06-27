export const me = async (req, res) => {
    return res.json({ ...req.user });
};
