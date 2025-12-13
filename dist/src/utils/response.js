export const response = ({ res, status = 200, message = "Message Response", data = null, meta = null, errors = null }) => {
    return res.status(status).json({ message, data, meta, errors });
};
