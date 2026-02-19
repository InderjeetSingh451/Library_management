import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudents } from "../context/StudentContext";
import Loader from "../components/Loader";
import {
  Search,
  UserCircle,
  ChevronRight,
  Filter,
  MoreHorizontal,
  Mail,
  Fingerprint,
} from "lucide-react";

const Students = () => {
  const { students, fetchStudents, loading } = useStudents();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = search
    ? students.filter(
        (s) =>
          s.libraryId.toLowerCase().includes(search.toLowerCase()) ||
          s.name.toLowerCase().includes(search.toLowerCase()),
      )
    : students;

  if (loading) return <Loader />;

  return (
    <div className="p-4 sm:p-8 md:p-10 min-h-screen bg-[#FDFDFF]">
      {/* Header Section */}
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight sm:text-4xl">
            Students <span className="text-indigo-600">Directory</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            {students.length} Total Members Enrolled
          </p>
        </div>

        {/* Action Bar: Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative group flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 w-5 h-5 transition-colors" />
            <input
              type="text"
              placeholder="Search ID or Name..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
          <div className="p-6 bg-indigo-50 rounded-full mb-4">
            <UserCircle className="w-12 h-12 text-indigo-200" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No students found</h3>
          <p className="text-gray-500">Try adjusting your search terms</p>
        </div>
      ) : (
        <>
          {/* MOBILE & TABLET VIEW (Cards) - Hidden on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {filteredStudents.map((student) => (
              <div
                key={student._id}
                onClick={() => navigate(`/students/${student._id}`)}
                className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={student.image?.url}
                    alt={student.name}
                    className="h-16 w-16 rounded-2xl object-cover ring-4 ring-gray-50"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-900 leading-tight">
                        {student.name}
                      </h4>
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md">
                        {student.category}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-gray-400 mt-1 flex items-center gap-1">
                      <Fingerprint className="w-3 h-3" /> {student.libraryId}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW (Table) - Hidden on Mobile */}
          <div className="hidden lg:block bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">
                    Basic Info
                  </th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">
                    ID Credentials
                  </th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 text-center">
                    Gender
                  </th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">
                    Status
                  </th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStudents.map((student) => (
                  <tr
                    key={student._id}
                    className="group hover:bg-indigo-50/30 transition-all cursor-pointer"
                    onClick={() => navigate(`/students/${student._id}`)}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={student.image?.url}
                          alt={student.name}
                          className="h-12 w-12 rounded-xl object-cover ring-2 ring-white shadow-md transition-transform group-hover:scale-110"
                        />
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {student.name}
                          </p>
                          <p className="text-xs text-gray-400 font-medium">
                            Regular Member
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Fingerprint className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="font-mono text-sm font-bold text-gray-700">
                          {student.libraryId}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-5 text-center">
                      <span className="text-sm font-semibold text-gray-600 px-4 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                        {student.gender}
                      </span>
                    </td>

                    <td className="px-8 py-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-black uppercase tracking-wider">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                        {student.category}
                      </span>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-2">
                        <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all active:scale-90">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        <button className="p-2.5 bg-gray-900 rounded-xl text-white hover:bg-indigo-600 transition-all shadow-lg shadow-gray-200 active:scale-90">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Students;
