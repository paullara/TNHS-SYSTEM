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
            <SearchBar />
        </Admin>
    );
}
