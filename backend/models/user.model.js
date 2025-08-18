import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/dl9nti2kz/image/upload/v1755486728/upload_area_hzoqgg.png",
  },
  address: {
    type: Object,
    default: { line1: "", line2: "" },
  },
  gender: { type: String, default: "Not Selected" },
  dob: { type: String, default: "Not Selected" },
  phone: { type: String, default: "0000000000" },

  role: {
    type: String,
    enum: ["user", "admin", "doctor"],
    default: "user",
  },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
