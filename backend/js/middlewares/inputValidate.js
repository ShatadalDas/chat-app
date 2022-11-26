export default (req, res, next) => {
    const { phone, password } = req.body;
    const regex = new RegExp("^[0-9]{10}$");
    if (!phone || !password || phone.length !== 10 || !regex.test(phone)) {
        res.status(400).json({ code: 400, msg: "invalid input(s)" });
    }
    else {
        next();
    }
};
