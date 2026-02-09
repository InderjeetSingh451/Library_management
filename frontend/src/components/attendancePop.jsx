import toast from "react-hot-toast";

export const showAttendancePop = ({ type, name, time, message }) => {
  toast.custom(
    (t) => (
      <div
        className={`
          ${t.visible ? "animate-enter" : "animate-leave"}
          w-full max-w-md bg-white rounded-xl shadow-lg
          border-l-8
          ${
            type === "ENTRY"
              ? "border-l-emerald-500"
              : type === "EXIT"
                ? "border-l-blue-500"
                : "border-l-red-500"
          }
        `}
      >
        <div className="p-6">
          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900">
            {type === "ENTRY"
              ? "Welcome to the Library"
              : type === "EXIT"
                ? "Thank You for Visiting"
                : "Invalid Library ID"}
          </h2>

          {/* Name */}
          {type && (
            <p className="mt-1 text-lg font-medium text-gray-800">{name}</p>
          )}

          {/* Message */}
          <p className="mt-4 text-gray-600 leading-relaxed">
            {type === "ENTRY" && (
              <>
                Your entry has been recorded at{" "}
                <span className="font-semibold text-emerald-600">{time}</span>
                .
                <br />
                Please maintain silence and make the best use of your study
                time. 📚
              </>
            )}

            {type === "EXIT" && (
              <>
                Your exit has been recorded at{" "}
                <span className="font-semibold text-blue-600">{time}</span>
                .
                <br />
                We hope you had a productive session. Have a great day ahead.
              </>
            )}

            {!type && (
              <>
                {
                  "The Library ID entered does not exist. Please verify your ID or contact the library staff."
                }
              </>
            )}
          </p>
        </div>
      </div>
    ),
    { duration: 5000 },
  );
};
