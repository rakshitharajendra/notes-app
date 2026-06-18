require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Note = require("./models/Note");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// GET ALL NOTES
app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes" });
  }
});

// CREATE NOTE
app.post("/notes", async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const note = new Note({
      title,
      content,
      tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await note.save();

    res.json({ message: "Saved" });
  } catch (error) {
    res.status(500).json({ message: "Error saving note" });
  }
});

// DELETE NOTE
app.delete("/notes/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note" });
  }
});

// UPDATE NOTE (FIXED)
app.put("/notes/:id", async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        tags,
        updatedAt: new Date(), // ✅ FIX: timestamp update
      },
      { new: true }
    );

    res.json({
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating note" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});