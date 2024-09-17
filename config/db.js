const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const connect = async () => {
  return await mongoose.connect(
    "mongodb+srv://r:g@cluster0.hsmeq1z.mongodb.net/chatApp?retryWrites=true&w=majority",
    {}
  );
};

module.exports = connect;
