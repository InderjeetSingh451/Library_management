import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import cloudinary from "../config/cloudinary.js";
import generateLibraryId from "../utils/generateLibraryId.js";

/**
 * @desc    Add New Student
 * @route   POST /api/students
 * @access  Admin
 */
export const addStudent = async (req, res, next) => {
  try {
    const {
      name,
      fatherName,
      dob,
      age,
      gender,
      category,
      address,
      monthlyFees,
    } = req.body;

    if (!req.file) {
      res.status(400);
      throw new Error("Student image is required");
    }

    if (
      !name ||
      !fatherName ||
      !dob ||
      !age ||
      !gender ||
      !category ||
      !address ||
      !monthlyFees
    ) {
      res.status(400);
      throw new Error("All fields are required");
    }

    // Upload image
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "library_students",
    });

    // Generate unique Library ID
    let libraryId;
    let exists = true;

    while (exists) {
      libraryId = generateLibraryId();
      exists = await Student.findOne({ libraryId });
    }

    // Generate fees history from enrolled month
    const enrolledDate = new Date();
    const feesHistory = [];

    const startMonth = enrolledDate.getMonth();
    const startYear = enrolledDate.getFullYear();

    const monthName = enrolledDate.toLocaleString("default", {
      month: "long",
    });

    feesHistory.push({
      month: `${monthName} ${startYear}`,
      amount: monthlyFees,
      status: "UNPAID",
    });

    const student = await Student.create({
      name,
      fatherName,
      dob,
      age,
      gender,
      category,
      address,
      monthlyFees,
      libraryId,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      feesHistory,
      enrolledDate,
    });

    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get All Students
 * @route   GET /api/students
 * @access  Admin
 */
export const getStudents = async (req, res, next) => {
  try {
    const students = await Student.find({ isDeleted: false }).sort({
      createdAt: -1,
    });

    res.json(students);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Single Student Profile
 * @route   GET /api/students/:id
 * @access  Admin
 */
export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student || student.isDeleted) {
      res.status(404);
      throw new Error("Student not found");
    }

    const attendance = await Attendance.find({
      student: student._id,
    });

    res.json({ student, attendance });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Soft Delete Student
 * @route   DELETE /api/students/:id
 * @access  Admin
 */
export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      res.status(404);
      throw new Error("Student not found");
    }

    student.isDeleted = true;
    await student.save();

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    next(error);
  }
};
