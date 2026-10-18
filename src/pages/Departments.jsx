
import { useEffect, useState } from "react";
import api from "../services/api";

function Departments() {
    const [departments, setDepartments] = useState([]);
    const [departmentName, setDepartmentName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchDepartments = async () => {
        try {
            setError("");
            const response = await api.get("/departments");
            setDepartments(response.data);
        } catch (err) {
            console.error("Error fetching departments:", err);
            setError("Departments could not be loaded.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const resetForm = () => {
        setDepartmentName("");
        setEditingId(null);
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const name = departmentName.trim();

        if (!name) {
            setError("Department name cannot be blank.");
            return;
        }

        try {
            setError("");
            setSuccess("");

            if (editingId !== null) {
                await api.put(`/departments/${editingId}`, { name });
                setSuccess("Department updated successfully.");
            } else {
                await api.post("/departments", { name });
                setSuccess("Department added successfully.");
            }

            setDepartmentName("");
            setEditingId(null);
            setLoading(true);
            await fetchDepartments();
        } catch (err) {
            console.error("Error saving department:", err);

            setError(
                err.response?.data?.message ||
                (err.response?.status === 409
                    ? "A department with this name already exists."
                    : "Department could not be saved.")
            );
        }
    };

    const handleEdit = (department) => {
        setEditingId(department.id);
        setDepartmentName(department.name);
        setError("");
        setSuccess("");
    };

    const handleDelete = async (department) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${department.name}" (ID: ${department.id})?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(`/departments/${department.id}`);

            if (editingId === department.id) {
                resetForm();
            }

            setSuccess("Department deleted successfully.");
            setLoading(true);
            await fetchDepartments();
        } catch (err) {
            console.error("Error deleting department:", err);

            setError(
                err.response?.data?.message ||
                "Department could not be deleted. It may have assigned students."
            );
        }
    };

    return (
        <div className="students-page">
            <div className="students-header">
                <div>
                    <h1>Departments</h1>
                    <p>Manage your departments</p>
                </div>
            </div>

            <form className="student-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Department name"
                    value={departmentName}
                    onChange={(event) =>
                        setDepartmentName(event.target.value)
                    }
                    required
                />

                <button type="submit">
                    {editingId !== null
                        ? "Update Department"
                        : "Add Department"}
                </button>

                {editingId !== null && (
                    <button type="button" onClick={resetForm}>
                        Cancel
                    </button>
                )}
            </form>

            {error && <p className="error-message">{error}</p>}
            {success && <p>{success}</p>}

            {loading ? (
                <p>Loading departments...</p>
            ) : (
                <div className="students-table-wrapper">
                    <table className="students-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Department Name</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {departments.length === 0 ? (
                            <tr>
                                <td colSpan="3">
                                    No departments found.
                                </td>
                            </tr>
                        ) : (
                            departments.map((department) => (
                                <tr key={department.id}>
                                    <td>{department.id}</td>
                                    <td>{department.name}</td>
                                    <td>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(department)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="delete-button"
                                            onClick={() =>
                                                handleDelete(department)
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
                Total departments: {departments.length}
            </p>
        </div>
    );
}

export default Departments;
