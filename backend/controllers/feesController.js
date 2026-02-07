import Student from "../models/Student.js";

/**
 * @desc    Get Fees Details (with filters)
 * @route   GET /api/fees?status=PAID|UNPAID
 * @access  Admin
 */
export const getFeesDetails = async (req, res, next) => {
  try {
    const { status } = req.query;

    let students = await Student.find({ isDeleted: false });

    if (status === "PAID") {
      students = students.filter((student) =>
        student.feesHistory.every((fee) => fee.status === "PAID"),
      );
    }

    if (status === "UNPAID") {
      students = students.filter((student) =>
        student.feesHistory.some((fee) => fee.status === "UNPAID"),
      );
    }

    res.json(students);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle Fees Status
 * @route   PUT /api/fees/:studentId
 * @access  Admin
 */
export const updateFeesStatus = async (req, res, next) => {
  try {
    const { month } = req.body;

    const student = await Student.findById(req.params.studentId);

    if (!student || student.isDeleted) {
      res.status(404);
      throw new Error("Student not found");
    }

    const fee = student.feesHistory.find((f) => f.month === month);

    if (!fee) {
      res.status(404);
      throw new Error("Fee record not found");
    }

    fee.status = fee.status === "PAID" ? "UNPAID" : "PAID";

    await student.save();

    res.json(student);
  } catch (error) {
    next(error);
  }
};
