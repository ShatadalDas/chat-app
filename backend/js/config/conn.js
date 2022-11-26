import mongoose from "mongoose";
export default () => {
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => console.log("Mongo Connected"))
        .catch((e) => console.log(e));
};
