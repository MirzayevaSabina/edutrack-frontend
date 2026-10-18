
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
    const [studentCount, setStudentCount] = useState(0);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setError("");

                const [studentsResponse, departmentsResponse] =
                    await Promise.all([
                        api.get("/students"),
                        api.get("/departments"),
                    ]);

                const studentsData = studentsResponse.data;

                setStudentCount(
                    studentsData.totalElements ??
                    studentsData.content?.length ??
                    studentsData.length ??
                    0
                );

                setDepartments(departmentsResponse.data);
            } catch (err) {
                console.error("Error loading dashboard:", err);
                setError("Dashboard data could not be loaded.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="students-page">
            <div className="students-header">
                <div>
                    <h1>EduTrack Dashboard</h1>
                    <p>Overview of your student management system</p>
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            {loading ? (
                <p>Loading dashboard...</p>
            ) : (
                <>
                    <div className="dashboard-stats">
                        <div className="dashboard-card">
                            <h3>Total Students</h3>
                            <p className="dashboard-number">
                                {studentCount}
                            </p>
                        </div>

                        <div className="dashboard-card">
                            <h3>Total Departments</h3>
                            <p className="dashboard-number">
                                {departments.length}
                            </p>
                        </div>
                    </div>

                    <div className="students-header">
                        <div>
                            <h2>Departments Overview</h2>
                            <p>Departments currently registered in EduTrack</p>
                        </div>
                    </div>

                    <div className="students-table-wrapper">
                        <table className="students-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Department Name</th>
                            </tr>
                            </thead>

                            <tbody>
                            {departments.length === 0 ? (
                                <tr>
                                    <td colSpan="2">
                                        No departments found.
                                    </td>
                                </tr>
                            ) : (
                                departments.map((department) => (
                                    <tr key={department.id}>
                                        <td>{department.id}</td>
                                        <td>{department.name}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>

                    <div className="dashboard-links">
                        <Link to="/students">Manage Students</Link>
                        <Link to="/departments">Manage Departments</Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default Dashboard;
