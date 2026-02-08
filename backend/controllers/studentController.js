import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import cloudinary from "../config/cloudinary.js";
import generateLibraryId from "../utils/generateLibraryId.js";
import { getAttendanceDate } from "../utils/getAttendanceDate.js";
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
      email,
      phone,
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

    // Fees history
    const enrolledDate = new Date();
    const monthName = enrolledDate.toLocaleString("default", {
      month: "long",
    });

    const feesHistory = [
      {
        month: `${monthName} ${enrolledDate.getFullYear()}`,
        amount: monthlyFees,
        status: "UNPAID",
      },
    ];

    // Create student
    const student = await Student.create({
      name,
      fatherName,
      dob,
      age,
      gender,
      category,
      address,
      monthlyFees,
      email,
      phone,
      libraryId,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      feesHistory,
      enrolledDate,
    });

    // 🔥 CREATE TODAY'S ATTENDANCE AS ABSENT
    const today = new Date().toISOString().split("T")[0];

    // CREATE TODAY'S ATTENDANCE AS ABSENT (CORRECT)
    await Attendance.create({
      student: student._id,
      date: getAttendanceDate(),
      status: "ABSENT",
      openSession: false,
      logs: [],
    });

    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get All Students
 * @route   GET /api/students
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
 * @desc    Get Single Student
 * @route   GET /api/students/:id
 */
export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student || student.isDeleted) {
      res.status(404);
      throw new Error("Student not found");
    }

    const attendance = await Attendance.find({ student: student._id });
    res.json({ student, attendance });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Student
 * @route   PUT /api/students/:id
 */
export const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student || student.isDeleted) {
      res.status(404);
      throw new Error("Student not found");
    }

    const {
      name,
      fatherName,
      dob,
      age,
      gender,
      category,
      address,
      monthlyFees,
      email,
      phone,
    } = req.body;

    student.name = name ?? student.name;
    student.fatherName = fatherName ?? student.fatherName;
    student.dob = dob ?? student.dob;
    student.age = age ?? student.age;
    student.gender = gender ?? student.gender;
    student.category = category ?? student.category;
    student.address = address ?? student.address;
    student.monthlyFees = monthlyFees ?? student.monthlyFees;
    student.email = email ?? "";
    student.phone = phone ?? "";

    if (req.file) {
      if (student.image?.public_id) {
        await cloudinary.uploader.destroy(student.image.public_id);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "library_students",
      });

      student.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    await student.save();
    res.json(student);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Soft Delete Student
 * @route   DELETE /api/students/:id
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
