// models/Resume.ts
import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  filename: String,
  fileBuffer: mongoose.Schema.Types.Buffer // or use Buffer directly
});

export default mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);
