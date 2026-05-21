import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const sheetschema = new Schema(
  {
    sheetlink: {
      type: String,
      required: true,
    },
    sheetname: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    filesize: {
      type: Number,
      required: true,
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
    },
    filepreviewsheets: {
      type: String, //url cloudinary
      default:
        "https://res.cloudinary.com/dzcmadjlq/sheet/upload/v1696543783/ClauseValidator/default_pdf_oyh3v0.png",
    },
    parquetPath: {
      type: String,
    },
    processingStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    fileschema: {
      fileid: {
        type: String,
      },
      columns: [
        {
          name: String,
          type: String,
          description: String,
        },
      ],

      sampleRows: {
        type: [Schema.Types.Mixed],
      },
    },
  },
  {
    timestamps: true,
  },
);
sheetschema.plugin(mongooseAggregatePaginate);
export const Sheet = mongoose.model("Sheet", sheetschema);
