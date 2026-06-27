import LinkModel from "../models/Link.model.js";

export const redirect = async (req, res) => {
    const { code } = req.params;
    const link = await LinkModel.findOne({ shortCode: code });
    if (link) {
        return res.redirect(link.originalURL);
    }
    return res.status(400).send("Page not found.");
};
