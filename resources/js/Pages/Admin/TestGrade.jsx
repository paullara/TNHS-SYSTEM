import Admin from "@/Layouts/AdminLayout";
import { useState } from "react";
import axios from "axios";

// modules
import SearchBar from "@/Components/Grades/SearchBar";
import ReportHeader from "@/Components/Grades/ReportHeader";
import LearnerInformation from "@/Components/Grades/LearnerInformation";
import EligibilitySection from "@/Components/Grades/EligibilitySection";
import SemesterHeader from "@/Components/Grades/SemesterHeader";
import GradeTable from "@/Components/Grades/GradeTable";
import RemedialHeader from "@/Components/Grades/RemedialHeader";
import RemedialTable from "@/Components/Grades/RemedialTable";

export default function TestGrade() {
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
            const res = await axios.get(
                `/all-student-grades?lrn=${encodeURIComponent(queryLrn)}`,
            );

            setData(Array.isArray(res.data) ? res.data : []);
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

    const handleSearch = (e) => {
        e.preventDefault();
        setSearching(true);
        setHasSearched(true);
        fetchStudentGrades(lrn.trim());
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <Admin>
            <SearchBar
                lrn={lrn}
                setLrn={setLrn}
                handleSearch={handleSearch}
                handlePrint={handlePrint}
                searching={searching}
                onReset={() => {
                    setLrn("");
                    setHasSearched(false);
                    setData([]);
                    setError(null);
                }}
            />

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="printable p-3 w-full flex justify-center items-center">
                {!hasSearched && (
                    <p>Please search a student LRN to display grade data.</p>
                )}

                {hasSearched && data.length === 0 && !loading && !error && (
                    <p>No grades found for this LRN.</p>
                )}

                {data.length > 0 && (
                    <div className="w-full bf-red-500">
                        <ReportHeader />
                        <LearnerInformation data={data[0]} />
                        <EligibilitySection />

                        {data
                            .sort((a, b) => a.sy.localeCompare(b.sy))
                            .map((item, index) => (
                                <div key={index} className="mb-10">
                                    {item.first_sem.subjects.length > 0 && (
                                        <>
                                            <SemesterHeader
                                                item={item}
                                                semesterLabel="1ST"
                                            />

                                            <GradeTable
                                                subjects={
                                                    item.first_sem.subjects
                                                }
                                                label="1st Semester"
                                                columns={["q1", "q2"]}
                                                avg={item.first_sem.average}
                                                finalKey="first_sem_final"
                                                adviser={item?.section?.adviser}
                                            />

                                            <RemedialHeader />

                                            <RemedialTable
                                                subjects={
                                                    item.first_sem.subjects
                                                }
                                                finalKey="first_sem_final"
                                            />
                                        </>
                                    )}

                                    {item.second_sem.subjects.length > 0 && (
                                        <>
                                            <SemesterHeader
                                                item={item}
                                                semesterLabel="2ND"
                                            />

                                            <GradeTable
                                                subjects={
                                                    item.second_sem.subjects
                                                }
                                                label="2nd Semester"
                                                columns={["q3", "q4"]}
                                                avg={item.second_sem.average}
                                                finalKey="second_sem_final"
                                                adviser={item?.section?.adviser}
                                            />

                                            <RemedialHeader />

                                            <RemedialTable
                                                subjects={
                                                    item.second_sem.subjects
                                                }
                                                finalKey="second_sem_final"
                                            />
                                        </>
                                    )}
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </Admin>
    );
}
