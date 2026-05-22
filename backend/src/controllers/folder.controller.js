import { Sheet } from "../models/sheet.model.js";
import { Folder } from "../models/folder.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import errorhandler from "../utils/errorhandler.js";
import responseHandler from "../utils/responseHandler.js";

import mongoose from "mongoose";
import { Qachat } from "../models/qachat.model.js";
import { User } from "../models/user.model.js";

const createfolder = asyncHandler(async (req, res) => {
  if (req.user.usertype === "free") {
    const userfolderscount = await Folder.countDocuments({
      owner: req.user._id,
    });
    if (userfolderscount >= 3) {
      throw new errorhandler(
        403,
        "free plan users can only create up to 3 folders. Please upgrade to pro to create more folders.",
        [],
      );
    }
  }
  const newfolder = await Folder.create({
    foldername: req.body.foldername,
    owner: req.user._id,
  });
  if (!newfolder) {
    throw new errorhandler(500, "folder not created", []);
  } else await User.findByIdAndUpdate(req.user._id, { $inc: { folders: 1 } });
  return res
    .status(200)
    .json(new responseHandler(200, "folder created successfully", newfolder));
});

const getalluserfolders = asyncHandler(async (req, res) => {
  const userfolders = await Folder.aggregate([
    {
      $match: {
        owner: req.user._id,
      },
    },
    {
      $lookup: {
        from: "sheets",
        localField: "_id",
        foreignField: "folder",
        as: "sheets",
      },
    },
    {
      $addFields: {
        sheetscount: { $size: "$sheets" },
      },
    },
    {
      $project: {
        sheets: 0,
      },
    },
  ]);
  if (req.user.usertype === "free" && userfolders.length > 3) {
    const limit = 3;
    userfolders.forEach((folder, idx) => {
      if (idx >= limit) {
        folder.disabled = true;
      }
    });
  }
  if (!userfolders || userfolders.length === 0) {
    throw new errorhandler(404, "folders not found", []);
  }
  res
    .status(200)
    .json(
      new responseHandler(
        200,
        "User folders fetched successfully",
        userfolders,
      ),
    );
});

const deletefolder = asyncHandler(async (req, res) => {
  const folderid = new mongoose.Types.ObjectId(req.params.folderid);
  const folder = await Folder.findOne({ _id: folderid });
  if (!folder) {
    throw new errorhandler(404, "folder not found", []);
  }
  await Sheet.deleteMany({ folder: folderid });
  const deletedfolder = await Folder.findByIdAndDelete(folderid);
  if (deletedfolder) {
    await User.findByIdAndUpdate(req.user._id, { $inc: { folders: -1 } });
  }
  return res
    .status(200)
    .json(
      new responseHandler(
        200,
        "folder deleted successfully",
        deletedfolder._id,
      ),
    );
});

const allsheetsinfolder = asyncHandler(async (req, res) => {
  const folderid = new mongoose.Types.ObjectId(req.params.folderid);
  const sheets = await Sheet.find({ folder: folderid });
  if (!sheets || sheets.length === 0) {
    throw new errorhandler(404, "folder not found", []);
  }
  return res
    .status(200)
    .json(
      new responseHandler(200, "sheets in folder fetched successfully", sheets),
    );
});

const getchathistory = asyncHandler(async (req, res) => {
  const folderid = new mongoose.Types.ObjectId(req.params.folderid);
  const chathistory = await Qachat.find({ folderid: folderid });
  if (!chathistory || chathistory.length === 0) {
    throw new errorhandler(404, "no chat history found for this folder", []);
  }
  return res
    .status(200)
    .json(
      new responseHandler(
        200,
        "chat history fetched successfully",
        chathistory,
      ),
    );
});
const queryfolder = asyncHandler(async (req, res) => {
  //calls fastapi api to query the folder and return the response
  //send the api req with body containing
  //chathistory(last 3) Qachat.find({userid:req.user._id,folderid:req.params.folderid}).sort({createdAt:-1}).limit(3)
  //userquery
  /* 
    
    const body={
        chathistory:chathistory||[],
        userquery:req.body.query||"first query"
        //if userquery is first quer....then fast api will return just pandas basic 
        //if user query is some question then fast api will send it to llm and return the response
    }
    */
  const newQachat = await Qachat.create({
    userid: req.user._id,
    folderid: req.params.folderid,
    userquery: req.body.query,
    llmresponse: "llm response placeholder",
  });

  return res
    .status(200)
    .json(new responseHandler(200, "folder queried successfully", newQachat));
});
export {
  createfolder,
  getalluserfolders,
  getchathistory,
  queryfolder,
  deletefolder,
  allsheetsinfolder,
};
