import Admin from "@/Layouts/AdminLayout";
import { React, useState, useEffect } from "react";
import InputError from "@/Components/InputError";
import axios from "axios";

export default function Enrollment() {
    const [students, setStudents] = useState([]);
    const [schoolYears, setSchoolYears] = useState([]);
    const [gradeLevels, setGradeLevels] = useState([]);
    const [sections, setSections] = useState([]);
    const [errors, setErrors] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        student_id: "",
        school_year_id: "",
        grade_level_id: "",
        section_id: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const fetchStudents = async () => {
        try {
            const res = await axios.get("/api/students");
            setStudents(res.data.students);
        } catch (err) {
            console.error("Error fetching students", err);
        }
    };

    const fetchSchoolYears = async () => {
        try {
            const res = await axios.get("/api/sy");
            setSchoolYears(res.data.schoolYear);
        } catch (err) {
            console.error("Error fetching school years", err);
        }
    };

    const fetchGradeLevels = async () => {
        try {
            const res = await axios.get("/api/gl");
            setGradeLevels(res.data.gradeLevel);
        } catch (err) {
            console.error("Failed fetching gradeLevels", err);
        }
    };

    const fetchSections = async () => {
        try {
            const res = await axios.get("/api/sections");
            setSections(res.data.sections);
        } catch (err) {
            console.error("Failed fetching sections", err);
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchSchoolYears();
        fetchGradeLevels();
        fetchSections();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (editingId) {
                await axios.put(`/api/enrollments/${editingId}`, formData);
            } else {
                await axios.post("/api/enrollments", formData);
            }
        } catch (err) {
            console.error("Failed to create enrollment", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Admin>
            <h1>Hello, World</h1>
        </Admin>
    );
}
