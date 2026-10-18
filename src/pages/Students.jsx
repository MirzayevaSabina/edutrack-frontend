
import { useEffect, useState } from "react";
import api from "../services/api";

function Students() {
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [departmentId, setDepartmentId] = useState("");

    const fetchDepartments = async () => {
        try {
            const response = await api.get("/departments");
            setDepartments(response.data);
        } catch (err) {
            console.error("Error fetching departments:", err);
            setError("Departments could not be loaded.");
        }
    };

    const fetchStudents = async () => {
        try {
            setError("");
            const response = await api.get("/students");
            const data = response.data;
            setStudents(data.content ?? data);
        } catch (err) {
            console.error("Error fetching students:", err);
            setError("Students could not be loaded.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchDepartments();
    }, []);

    const resetForm = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setDepartmentId("");
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const studentData = {
            firstName,
            lastName,
            email,
            departmentId: departmentId ? Number(departmentId) : null,
        };

        try {
            setError("");

            if (editingId !== null) {
                await api.put(`/students/${editingId}`, studentData);
            } else {
                await api.post("/students", studentData);
            }

            resetForm();
            setLoading(true);
            await fetchStudents();
        } catch (err) {
            console.error("Error saving student:", err);
            setError(
                editingId !== null
                    ? "Student could not be updated."
                    : "Student could not be added. Check the required fields and department."
            );
        }
    };

    const handleEditStudent = (student) => {
        setEditingId(student.id);
        setFirstName(student.firstName ?? "");
        setLastName(student.lastName ?? "");
        setEmail(student.email ?? "");
        setDepartmentId(
            student.departmentId != null
                ? String(student.departmentId)
                : ""
        );
        setShowForm(true);
        setError("");
    };

    const handleDeleteStudent = async (id) => {
        if (!window.confirm("Are you sure you want to delete this student?")) {
            return;
        }

        try {
            setError("");
            await api.delete(`/students/${id}`);

            setStudents((current) =>
                current.filter((student) => student.id !== id)
            );
        } catch (err) {
            console.error("Error deleting student:", err);
            setError("Student could not be deleted.");
        }
    };

    const filteredStudents = students.filter((student) => {
        const search = searchTerm.trim().toLowerCase();

        return (
            (student.firstName ?? "").toLowerCase().includes(search) ||
            (student.lastName ?? "").toLowerCase().includes(search) ||
            (student.email ?? "").toLowerCase().includes(search)
        );
    });

    return (
        <div className="students-page">
            <div className="students-header">
                <div>
                    <h1>Students</h1>
                    <p>Manage your student records</p>
                </div>

                <button
                    onClick={() => {
                        if (showForm) {
                            resetForm();
                        } else {
                            resetForm();
                            setShowForm(true);
                        }
                    }}
                >
                    {showForm ? "Cancel" : "+ Add Student"}
                </button>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by first name, last name or email..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>

            {showForm && (
                <form className="student-form" onSubmit={handleSubmit}>
                    <input
                        placeholder="First name"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        required
                    />

                    <input
                        placeholder="Last name"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    <select
                        value={departmentId}
                        onChange={(event) => setDepartmentId(event.target.value)}
                    >
                        <option value="">No department</option>

                        {departments.map((department) => (
                            <option key={department.id} value={department.id}>
                                {department.name} (ID: {department.id})
                            </option>
                        ))}
                    </select>

                    <button type="submit">
                        {editingId !== null ? "Update Student" : "Save Student"}
                    </button>
                </form>
            )}

            {error && <p className="error-message">{error}</p>}

            {loading ? (
                <p>Loading students...</p>
            ) : (
                <div className="students-table-wrapper">
                    <table className="students-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filteredStudents.length === 0 ? (
                            <tr>
                                <td colSpan="6">
                                    {searchTerm.trim()
                                        ? "No matching students found."
                                        : "No students found."}
                                </td>
                            </tr>
                        ) : (
                            filteredStudents.map((student) => (
                                <tr key={student.id}>
                                    <td>{student.id}</td>
                                    <td>{student.firstName}</td>
                                    <td>{student.lastName}</td>
                                    <td>{student.email}</td>
                                    <td>
                                        {student.departmentName ?? "Not assigned"}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleEditStudent(student)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                handleDeleteStudent(student.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            <p className="student-count">
                Total students: {filteredStudents.length}
            </p>
        </div>
    );
}

export default Students;
