import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auths",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

   
    weight: {
      type: Number,
      min: 0,
    },

 
    chest: {
      type: Number,
      min: 0,
    },

    waist: {
      type: Number,
      min: 0,
    },

    hips: {
      type: Number,
      min: 0,
    },

    arms: {
      type: Number,
      min: 0,
    },

    thighs: {
      type: Number,
      min: 0,
    },

    
    runTime: {
      type: Number,
      min: 0,
    },

    liftingWeight: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Progress =
  mongoose.models.Progress || mongoose.model("Progress", progressSchema);

export default Progress;
export { Progress };