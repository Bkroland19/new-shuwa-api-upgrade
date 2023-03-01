import mongoose from "mongoose";
import { Ladies } from "../models/ladiesModel.js";

export const getLadies = async (req, res) => {
  try {
    const doc = await Ladies.find();
    res.status(200).json(doc);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createLadies = async (req, res) => {
  const body = req.body;
  try {
    let doc = await Ladies.create(body);
    await doc.save();
    res.status(201).json(doc);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateLadies = async (req, res) => {
  const { name, age, color, status, images } = req.body;
  const { id } = req.params;
  const updatedDoc = { name, age, color, status, images, _id: id };
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No post with id: ${id}`);
    let doc = await Ladies.findByIdAndUpdate({ _id: id }, updatedDoc, {
      new: true,
    });
    res.json(doc);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deleteLadies = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No post with id: ${id}`);
    await Ladies.findByIdAndRemove(id);
    res.json({ message: "Lady deleted successfully." });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
