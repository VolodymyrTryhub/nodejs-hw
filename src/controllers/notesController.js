import createHttpError from 'http-errors';

import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;

  const limit = Number(perPage);
  const skip = (Number(page) - 1) * limit;

  let notesQuery = Note.find({ userId: req.user._id });
  let countQuery = Note.find({ userId: req.user._id });

  if (tag) {
    notesQuery = notesQuery.where('tag').equals(tag);
    countQuery = countQuery.where('tag').equals(tag);
  }

  if (search) {
    const searchFilter = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    };

    notesQuery = notesQuery.where(searchFilter);
    countQuery = countQuery.where(searchFilter);
  }

  const totalNotes = await countQuery.countDocuments();

  const notes = await notesQuery.skip(skip).limit(limit);

  res.status(200).json({
    page: Number(page),
    perPage: limit,
    totalNotes,
    totalPages: Math.ceil(totalNotes / limit),
    notes,
  });
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;

  const note = await Note.findOne({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    return next(createHttpError(404, 'Note not found'));
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create({
    ...req.body,
    userId: req.user._id,
  });

  res.status(201).json(note);
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;

  const updatedNote = await Note.findOneAndUpdate(
    {
      _id: noteId,
      userId: req.user._id,
    },
    req.body,
    {
      returnDocument: 'after',
    },
  );

  if (!updatedNote) {
    return next(createHttpError(404, 'Note not found'));
  }

  res.status(200).json(updatedNote);
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    return next(createHttpError(404, 'Note not found'));
  }

  res.status(200).json(note);
};
