import { useState, useEffect } from "react";
import Admin from "@/Layouts/AdminLayout";
import axios from "axios";

export default function StudentGrades() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lrn, setLrn] = useState("");
    const [searching, setSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const fetchStudentGrades = async (queryLrn = "") => {
        if (!queryLrn) {
            setData([]);
            setError(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const url = `/all-student-grades?lrn=${encodeURIComponent(queryLrn)}`;
            const res = await axios.get(url);

            setData(Array.isArray(res.data) ? res.data : []);
            console.log("Data", res.data);
        } catch (err) {
            if (err.response?.status === 404) {
                setData([]);
                setError("Student not found.");
            } else {
                setError("Failed to fetch student grades.");
            }
        } finally {
            setLoading(false);
            setSearching(false);
        }
    };

    useEffect(() => {
        // don't fetch anything on load
    }, []);

    const handlePrint = () => {
        if (typeof window !== "undefined" && window.print) {
            window.print();
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearching(true);
        setHasSearched(true);
        fetchStudentGrades(lrn.trim());
    };

    const renderRemedialTable = (subjects, label, finalKey) => {
        const failedSubjects = subjects.filter(
            (subj) => subj[finalKey] != null && subj[finalKey] < 75,
        );

        return (
            <>
                <table className="w-full border mb-4 border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2 w-[250px] text-[14px]">
                                Indicate if Subject is CORE, APPLIED, or
                                SPECIALIZED
                            </th>
                            <th className="border p-2">SUBJECTS</th>
                            <th className="border p-2 w-[100px]">
                                SEM FINAL GRADE
                            </th>
                            <th className="border p-2 w-[100px]">
                                REMEDIAL CLASS MARK
                            </th>
                            <th className="border p-2 w-[100px]">
                                RECOMPUTED FINAL GRADE
                            </th>
                            <th className="border p-2 w-[100px]">
                                ACTION TAKEN
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {failedSubjects.map((subj, i) => (
                            <tr key={i}>
                                {/* SUBJECT INDICATOR */}
                                <td className="border p-2 text-center font-normal">
                                    {subj.subject_indicate
                                        ? subj.subject_indicate
                                              .charAt(0)
                                              .toUpperCase() +
                                          subj.subject_indicate
                                              .slice(1)
                                              .toLowerCase()
                                        : ""}
                                </td>

                                {/* SUBJECT NAME */}
                                <td className="border p-2">{subj.subject}</td>

                                {/* SEM FINAL GRADE */}
                                <td className="border p-2 text-center">
                                    {subj[finalKey] ?? ""}
                                </td>

                                {/* REMEDIAL CLASS MARK */}
                                <td className="border p-2 text-center">
                                    {subj.remedial ?? ""}
                                </td>

                                {/* RECOMPUTED FINAL GRADE */}
                                <td className="border p-2 text-center">
                                    {subj.final_grade ?? subj[finalKey] ?? ""}
                                </td>

                                {/* ACTION TAKEN */}
                                <td className="border p-2 text-center">
                                    {(subj.final_grade ?? subj[finalKey]) !=
                                    null
                                        ? (subj.final_grade ??
                                              subj[finalKey]) >= 75
                                            ? "Passed"
                                            : "Failed"
                                        : "-"}
                                </td>
                            </tr>
                        ))}
                        {[...Array(Math.max(0, 4 - failedSubjects.length))].map(
                            (_, i) => (
                                <tr key={`blank-${i}`}>
                                    <td className="border p-2 text-center"></td>
                                    <td className="border p-2"></td>
                                    <td className="border p-2 text-center"></td>
                                    <td className="border p-2 text-center"></td>
                                    <td className="border p-2 text-center"></td>
                                    <td className="border p-2 text-center"></td>
                                </tr>
                            ),
                        )}
                    </tbody>
                </table>
                <div className="w-full flex items-end text-[13px] mt-[-14px]">
                    <div className="w-3/4 flex items-end gap-1">
                        <span className="leading-none">
                            Name of Teacher/Adviser.
                        </span>
                        <input className="border-0 border-b border-black bg-transparent w-4/5 text-center leading-none p-0" />
                    </div>
                    <div className="w-1/4 flex items-end gap-1">
                        <span className="leading-none">Signature</span>
                        <input className="border-0 border-b border-black bg-transparent w-full text-center leading-none p-0" />
                    </div>
                </div>
            </>
        );
    };

    const renderSemesterHeader = (item, semesterLabel) => (
        <div className="mb-2 text-[13px] mt-6">
            <div className="w-full text-[13px] mt-1 space-y-1">
                {/* Line 1 */}
                <div className="flex w-full items-end gap-4 text-[13px] whitespace-nowrap">
                    <div className="flex items-end gap-1 w-[390px]">
                        <span className="leading-none">School:</span>
                        <span className="w-[317px] border-b border-black text-center font-semibold leading-none">
                            TAMAYO NATIONAL HIGH SCHOOL
                        </span>
                        {/* <input className="border-0 border-b border-black bg-transparent w-[40px] text-center leading-none p-0" /> */}
                    </div>
                    <div className="flex items-end gap-1 w-[390px]">
                        <span className="leading-none">School ID:</span>
                        <span className="w-[100px] border-b border-black text-center font-semibold leading-none">
                            300389
                        </span>
                        {/* <input className="border-0 border-b border-black bg-transparent w-[40px] text-center leading-none p-0" /> */}
                    </div>
                    <div className="flex items-end gap-1 w-[390px]">
                        <span className="leading-none">GRADE LEVEL:</span>
                        <span className="w-[100px] border-b border-black text-center font-semibold leading-none">
                            {item?.grade_level ?? "-"}
                        </span>
                        {/* <input className="border-0 border-b border-black bg-transparent w-[40px] text-center leading-none p-0" /> */}
                    </div>
                    <div className="flex items-end gap-1 w-[390px]">
                        <span className="leading-none">SY:</span>
                        <span className="w-[200px] border-b border-black text-center font-semibold leading-none">
                            {item.sy ?? "-"}
                        </span>
                        {/* <input className="border-0 border-b border-black bg-transparent w-[40px] text-center leading-none p-0" /> */}
                    </div>
                    <div className="flex items-end gap-1 w-[100px]">
                        <span className="leading-none">SEM:</span>
                        <span className="w-[90px] border-b border-black text-center font-semibold leading-none">
                            {semesterLabel}
                        </span>
                        {/* <input className="border-0 border-b border-black bg-transparent w-[40px] text-center leading-none p-0" /> */}
                    </div>
                </div>
                <div className="flex w-full items-end gap-4 text-[13px] whitespace-nowrap">
                    <div className="flex items-end gap-1 w-1/2">
                        <span className="leading-none">TRACK/STRAND:</span>
                        <span className="w-5/6 border-b border-black text-center font-semibold leading-none">
                            Academic Track/{item?.strand}
                        </span>
                        {/* <input className="border-0 border-b border-black bg-transparent w-[40px] text-center leading-none p-0" /> */}
                    </div>
                    <div className="flex items-end gap-1 w-1/2">
                        <span className="leading-none">SECTION:</span>
                        <span className="w-full border-b border-black text-center font-semibold leading-none">
                            {item?.section?.name ?? "-"}
                        </span>
                        {/* <input className="border-0 border-b border-black bg-transparent w-[40px] text-center leading-none p-0" /> */}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderRemedialHeader = () => (
        <div className="mb-1 text-[13px] mt-[60px]">
            <div className="w-full mt-1 space-y-1">
                <div className="flex w-full items-end gap-4 whitespace-nowrap">
                    <div className="flex items-end gap-1">
                        <span className="leading-none">REMEDIAL CLASSES</span>
                    </div>
                    <div className="flex items-end gap-1 w-[500px]">
                        <span className="leading-none">
                            Conducted from (MM/DD/YYYY):
                        </span>

                        <input className="border-0 border-b border-black bg-transparent w-[100px] text-center leading-none p-0" />
                        <span clasName="leading-none">to (MM/DD/YYYY)</span>
                        <input className="border-0 border-b border-black bg-transparent w-[100px] text-center leading-none p-0" />
                    </div>
                    <div className="flex items-end gap-1 w-[500px]">
                        <span className="leading-none">SCHOOL:</span>
                        <input className="border-0 border-b border-black bg-transparent w-full text-center leading-none p-0" />
                    </div>
                    <div className="flex items-end gap-1 w-[200px]">
                        <span className="leading-none">SCHOOL ID:</span>
                        <input className="border-0 border-b border-black bg-transparent w-full text-center leading-none p-0" />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTable = (subjects, label, columns, avg, finalKey) => {
        // Calculate overall semester status
        const allSubjectsPassed = subjects.every(
            (subj) => subj[finalKey] != null && subj[finalKey] >= 75,
        );
        const semesterStatus = allSubjectsPassed ? "PASSED" : "FAILED";

        return (
            <>
                {/* <h3 className="font-semibold mt-4 mb-2">{label}</h3> */}
                <table className="w-full border mb-4">
                    <thead>
                        {/* TOP HEADER */}
                        <tr className="bg-gray-100">
                            <th
                                rowSpan="2"
                                className="border p-2 w-[250px] text-[14px]"
                            >
                                Indicate if Subject is CORE, APPLIED, or
                                SPECIALIZED
                            </th>
                            <th rowSpan="2" className="border p-2">
                                SUBJECTS
                            </th>

                            {/*  QUARTER GROUP */}
                            <th
                                colSpan={columns.length}
                                className="border p-2 text-center"
                            >
                                QUARTER
                            </th>

                            <th rowSpan="2" className="border p-2 w-[100px]">
                                SEM FINAL GRADE
                            </th>
                            <th rowSpan="2" className="border p-2 w-[100px]">
                                ACTION TAKEN
                            </th>
                        </tr>

                        {/*  SUB HEADER (Q1, Q2, etc.) */}
                        <tr className="bg-gray-100">
                            {columns.map((col) => (
                                <th key={col} className="border p-2">
                                    {col.toUpperCase()}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map((subj, i) => (
                            <tr key={i}>
                                {/*  SUBJECT INDICATOR */}
                                <td className="border p-2 text-center font-normal">
                                    {subj.subject_indicate
                                        ? subj.subject_indicate
                                              .charAt(0)
                                              .toUpperCase() +
                                          subj.subject_indicate
                                              .slice(1)
                                              .toLowerCase()
                                        : "-"}
                                </td>

                                {/*  SUBJECT NAME */}
                                <td className="border p-2">{subj.subject}</td>

                                {/*  QUARTER GRADES */}
                                {columns.map((col) => (
                                    <td
                                        key={col}
                                        className="border p-2 text-center"
                                    >
                                        {subj[col] ?? "-"}
                                    </td>
                                ))}

                                {/*  FINAL */}
                                <td className="border p-2 text-center">
                                    {subj[finalKey] ?? "-"}
                                </td>

                                {/*  ACTION */}
                                <td className="border p-2 text-center">
                                    {subj[finalKey] != null
                                        ? subj[finalKey] >= 75
                                            ? "Passed"
                                            : "Failed"
                                        : "-"}
                                </td>
                            </tr>
                        ))}
                        <tr className="font-bold">
                            {/* merge first 2 + all quarter columns */}
                            <td
                                colSpan={2 + columns.length}
                                className="border p-2 text-right bg-gray-200"
                            >
                                General Ave. for the Semester:
                            </td>

                            {/* FINAL GRADE */}
                            <td className="border p-2 text-center">
                                {avg ?? "-"}
                            </td>

                            {/* STATUS */}
                            <td className="border p-2 text-center">
                                {semesterStatus}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="w-full p-1 mt-[-14px]">
                    <div className="flex flex-row items-end gap-2 text-[13px]">
                        <span className="font-semibold whitespace-nowrap">
                            REMARKS:
                        </span>

                        <div className="flex-1 flex flex-col gap-1">
                            <span className="border-b border-black text-start font-semibold">
                                {label.includes("1st")
                                    ? "Eligible for Grade 11 Second Semester Admission"
                                    : "Eligible for Grade 12 Admission"}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full p-1 mt-2 text-[13px]">
                    <div className="flex items-end gap-10">
                        {/*  PREPARED BY */}
                        <div className="flex flex-col items-start gap-1 flex-1">
                            <span className="whitespace-nowrap text-start">
                                Prepared by:
                            </span>
                            <span className="flex-1 border-b border-black text-center font-semibold w-[300px] mt-2">
                                {data[0]?.section?.adviser ?? "-"}
                            </span>
                            <span className="flex-1 text-center w-[300px]">
                                Signature of Adviser over Printed Name
                            </span>
                        </div>

                        <div className="flex flex-col items-start gap-1 flex-1">
                            <span className="whitespace-nowrap text-start">
                                Prepared by:
                            </span>
                            <span className="flex-1 border-b border-black text-center font-semibold w-[410px] mt-2">
                                JEFFREY D. MUNOZ, PRINCIPAN ll
                            </span>
                            <span className="flex-1 text-center w-[400px]">
                                Signature of Authorized Person over Printed
                                Name, Designation
                            </span>
                        </div>

                        <div className="flex h-[67px] flex-col items-start gap-1 flex-1">
                            <span className="whitespace-nowrap text-start">
                                Date Checked (MM/DD/YYYY)
                            </span>
                            <span className="flex-1 border-b border-black text-center font-semibold w-[320px]">
                                {new Date().toLocaleDateString("en-US")}
                            </span>
                            <span className="flex-1 text-center w-[320px]"></span>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    if (loading)
        return (
            <Admin>
                <p>Loading...</p>
            </Admin>
        );

    if (error)
        return (
            <Admin>
                <p className="text-red-500">{error}</p>
            </Admin>
        );

    return (
        <Admin>
            {/* SEARCH */}
            <form
                onSubmit={handleSearch}
                className="mb-2 flex gap-2 items-end no-print"
            >
                <input
                    value={lrn}
                    onChange={(e) => setLrn(e.target.value)}
                    placeholder="Enter LRN"
                    className="border rounded px-3 py-2"
                />

                <button className="bg-indigo-600 text-white px-4 py-2 rounded">
                    {searching ? "Searching..." : "Search"}
                </button>

                <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded no-print"
                    onClick={() => {
                        setLrn("");
                        setHasSearched(false);
                        setData([]);
                        setError(null);
                    }}
                >
                    Reset
                </button>

                <button
                    type="button"
                    onClick={handlePrint}
                    className="bg-green-600 text-white px-4 py-2 rounded no-print"
                >
                    Print Grades
                </button>
            </form>

            {/* DATA */}
            <div className="printable p-3">
                {!hasSearched && (
                    <p>Please search a student LRN to display grade data.</p>
                )}

                {hasSearched && data.length === 0 && !loading && !error && (
                    <p>No grades found for this LRN.</p>
                )}

                {data.length > 0 && (
                    <>
                        <div className="w-full h-header flex flex-row">
                            <div className="w-1/3 flex items-center justify-center">
                                <img
                                    src="logo/deoo.png"
                                    className="h-30 w-28"
                                />
                            </div>

                            <div className="w-1/2 flex flex-col items-center justify-center">
                                <h1>REPUBLIC OF THE PHILIPPINES</h1>
                                <h1>DEPARTMENT OF THE EDUCTATION</h1>
                                <h1 className="font-bold  mt-4 text-lg">
                                    SENIOR HIGH SCHOOL STUDENT PERMANENT RECORD
                                </h1>
                            </div>

                            <div className="w-1/3 flex items-center justify-center">
                                <img
                                    src="logo/deped.png"
                                    className="h-30 w-28"
                                />
                            </div>
                        </div>

                        {/*  LEARNERS INFORMATION (ONCE) */}
                        <div className="w-full text-[13px] bg-gray-400 flex items-center justify-center">
                            <h1 className="font-semibold">
                                LEARNERS INFORMATION
                            </h1>
                        </div>

                        <div className="w-full text-[13px] mt-1 space-y-1">
                            {/* LINE 1 */}
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <span className="w-[60px]">LAST NAME:</span>
                                <span className="flex-1 border-b border-black text-center font-semibold">
                                    {data[0]?.student?.name
                                        ?.split(" ")[2]
                                        .toUpperCase()}
                                </span>

                                <span className="w-[60px]">FIRST NAME:</span>
                                <span className="flex-1 border-b border-black text-center font-semibold">
                                    {data[0]?.student?.name
                                        ?.split(" ")[0]
                                        .toUpperCase()}
                                </span>

                                <span className="w-[70px]">MIDDLE NAME:</span>
                                <span className="flex-1 border-b border-black text-center font-semibold">
                                    {data[0]?.student?.name
                                        ?.split(" ")[1]
                                        .toUpperCase()}
                                </span>
                            </div>

                            {/* LINE 2 */}
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <span className="w-[18px]">LRN:</span>
                                <span className="w-[300px] border-b border-black text-center font-semibold">
                                    {data[0]?.student?.lrn}
                                </span>

                                <span className="w-[168px]">
                                    Date of Birth (MM/DD/YYYY):
                                </span>
                                <span className="w-[300px] border-b border-black text-center font-semibold">
                                    {data[0]?.student?.date_of_birth
                                        ? new Date(
                                              data[0].student.date_of_birth,
                                          ).toLocaleDateString()
                                        : "-"}
                                </span>

                                <span className="w-[12px]">Sex:</span>
                                <span className="w-[100px] border-b border-black text-center font-semibold">
                                    {data[0]?.student?.sex.toUpperCase()}
                                </span>

                                <span className="w-[130px]">
                                    Date of SHS Admission:
                                </span>
                                <span className="w-[440px] border-b border-black text-center font-semibold">
                                    {data[0]?.admission
                                        ? new Date(
                                              data[0].admission,
                                          ).toLocaleDateString()
                                        : "-"}
                                </span>
                            </div>
                        </div>

                        {/*  ELIGIBILITY */}
                        <div className="w-full text-[13px] bg-gray-400 flex items-center justify-center mt-2">
                            <h1 className="font-semibold">
                                ELIGIBILITY FOR SHS ENROLLMENT
                            </h1>
                        </div>

                        <div className="w-full text-[13px] mt-1 space-y-1">
                            {/* Line 1 */}
                            <div className="flex w-[660px] items-end gap-10 text-[13px] whitespace-nowrap">
                                {/* 1 */}
                                <div className="flex items-end gap-1 w-[150px]">
                                    <input
                                        type="checkbox"
                                        className="w-[20px]"
                                    />
                                    <span className="leading-none">
                                        High School Completer*
                                    </span>
                                </div>

                                <div className="w-[110px] flex items-end gap-1">
                                    <span className="leading-none">
                                        Gen Ave.
                                    </span>
                                    <input className="border-0 border-b border-black bg-transparent w-[40px] text-center leading-none p-0" />
                                </div>

                                <div className="flex items-end gap-1 w-[190px]">
                                    <input
                                        type="checkbox"
                                        className="w-[20px]"
                                    />
                                    <span className="leading-none">
                                        Junior High School Completer*
                                    </span>
                                </div>

                                <div className="w-[110px] flex items-end gap-1">
                                    <span className="leading-none">
                                        Gen Ave.
                                    </span>
                                    <input className="border-0 border-b border-black bg-transparent w-[40px] text-center leading-none p-0" />
                                </div>
                            </div>
                            <div className="w-full flex items-end gap-4 text-[13px] whitespace-nowrap mt-3">
                                <div className="flex items-end gap-1 w-[320px]">
                                    <span className="leading-none">
                                        Date of Graduation/Completion
                                        (MM/DD/YYYY):
                                    </span>
                                    <input className="border-0 border-b border-black bg-transparent w-[60px] text-center leading-none p-0" />
                                </div>
                                <div className="flex items-end gap-1 w-[350px] ml-[18px]">
                                    <span className="leading-none">
                                        Name of School:
                                    </span>
                                    <span className="w-[350px] border-b border-black text-center font-semibold leading-none">
                                        TAMAYO NATIONAL HIGH SCHOOL
                                    </span>
                                    {/* <input className="border-0 border-b border-black bg-transparent w-[40px] text-center leading-none p-0" /> */}
                                </div>
                                <div className="flex items-end gap-1 w-[400px]">
                                    <span className="leading-none">
                                        School Address:
                                    </span>
                                    <span className="w-[390px] border-b border-black text-center font-semibold leading-none">
                                        TAMAYO, SAN CARLOS CITY, PANGASINAN
                                    </span>
                                    {/* <input className="border-0 border-b border-black bg-transparent w-[40px] text-center leading-none p-0" /> */}
                                </div>
                            </div>
                            <div className="flex w-full items-end gap-10 text-[13px] whitespace-nowrap">
                                {/* 1 */}
                                <div className="flex items-end gap-1 w-[150px]">
                                    <input
                                        type="checkbox"
                                        className="w-[20px]"
                                    />
                                    <span className="leading-none">
                                        PEPT Passer*
                                    </span>
                                </div>

                                <div className="w-[110px] flex items-end gap-1">
                                    <span className="leading-none">
                                        Rating.
                                    </span>
                                    <input className="border-0 border-b border-black bg-transparent w-[40px] text-center leading-none p-0" />
                                </div>

                                <div className="flex flex-row ">
                                    <div className="flex items-end gap-1 w-[190px]">
                                        <input
                                            type="checkbox"
                                            className="w-[20px]"
                                        />
                                        <span className="leading-none">
                                            ALS A&E PASSER**
                                        </span>
                                    </div>

                                    <div className="w-[110px] flex items-end gap-1">
                                        <span className="leading-none">
                                            Rating.
                                        </span>
                                        <input className="border-0 border-b border-black bg-transparent w-[40px] text-center leading-none p-0" />
                                    </div>
                                </div>

                                <div className="flex items-end gap-1 w-[500px]">
                                    <input
                                        type="checkbox"
                                        className="w-[20px]"
                                    />
                                    <span className="leading-none">
                                        Others (Pls. Specify):
                                    </span>
                                    <input className="border-0 border-b border-black bg-transparent w-[325px] text-center leading-none p-0" />
                                </div>
                            </div>
                            <div className="w-full flex items-end gap-8 text-[13px] whitespace-nowrap mt-3">
                                <div className="flex items-end gap-1 w-[320px]">
                                    <span className="leading-none">
                                        Date of Examination/Assessment
                                        (MM/DD/YYYY):
                                    </span>
                                    <input className="border-0 border-b border-black bg-transparent w-[90px] text-center leading-none p-0" />
                                </div>

                                <div className="flex items-end gap-1 w-[790px] ml-20">
                                    <span className="leading-none">
                                        Name and Address of Community Learning
                                        Center:
                                    </span>
                                    {/* <span className="w-full border-b border-black text-center font-semibold leading-none">
                                        TAMAYO, SAN CARLOS CITY, PANGASINAN
                                    </span> */}
                                    <input className="border-0 border-b border-black bg-transparent w-[389px] text-center leading-none p-0" />
                                </div>
                            </div>
                            <div className="w-[930px] flex items-end gap-8 text-[11px] whitespace-nowrap mt-3">
                                <div className="w-1/2 flex flex-col items-start justify-center">
                                    <h1 className="italic">
                                        *High School Completers are students who
                                        graduated from secondary school under
                                        the curriculum
                                    </h1>
                                    <h1 className="italic">
                                        **PEPT - Philippines Educational
                                        Placement Test for JHS
                                    </h1>
                                </div>
                                <div className="w-1/2 h-[31px] flex flex-col items-start justify-start ml-10">
                                    <h1 className="italic">
                                        *** ALS A&E - Alternative Learning
                                        System Accreditation and Equivalency
                                        Test for JHS
                                    </h1>
                                </div>
                            </div>
                        </div>

                        <div className="w-full text-[13px] bg-gray-400 flex items-center justify-center mt-2">
                            <h1 className="font-semibold">SCHOLASTIC RECORD</h1>
                        </div>

                        {/*  LOOP PER SCHOOL YEAR - SHOWING PROGRESSION */}
                        {data
                            .sort((a, b) => a.sy.localeCompare(b.sy)) // Sort by school year
                            .map((item, index) => (
                                <div key={index} className="mb-10">
                                    {/*                                    
                                    <div className="w-full text-[13px] bg-yellow-100 border p-2 mt-4">
                                        <h2 className="font-bold text-center">
                                            SCHOOL YEAR: {item.sy} - GRADE{" "}
                                            {item.grade_level}
                                        </h2>
                                    </div> */}

                                    {item.first_sem.subjects.length > 0 && (
                                        <>
                                            {renderSemesterHeader(item, "1ST")}
                                            {renderTable(
                                                item.first_sem.subjects,
                                                "1st Semester",
                                                ["q1", "q2"],
                                                item.first_sem.average,
                                                "first_sem_final",
                                            )}
                                            {renderRemedialHeader()}
                                            {renderRemedialTable(
                                                item.first_sem.subjects,
                                                "1st Semester",
                                                "first_sem_final",
                                            )}
                                        </>
                                    )}

                                    {item.second_sem.subjects.length > 0 && (
                                        <>
                                            {renderSemesterHeader(item, "2ND")}
                                            {renderTable(
                                                item.second_sem.subjects,
                                                "2nd Semester",
                                                ["q3", "q4"],
                                                item.second_sem.average,
                                                "second_sem_final",
                                            )}
                                            {renderRemedialHeader()}
                                            {renderRemedialTable(
                                                item.second_sem.subjects,
                                                "2nd Semester",
                                                "second_sem_final",
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                    </>
                )}
            </div>
        </Admin>
    );
}
