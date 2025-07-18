import React, { useEffect, useState, useContext } from "react";
import Header from "../Common/Header";
import AdminSidebar from "./AdminSidebar";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../Common/LoadingScreen"
import { useUser } from "../../contexts/UserContext";
import { SidebarContext } from "../../contexts/SidebarContext";
import "../../css/adminscreen.css";

function AdminScreen() {
  const [reports, setReports] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user, loading } = useUser();
  const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadReports() {
      const resp = await fetch('http://localhost:5000/user/reports');
      const data = await resp.json();
      setReports(data);
    }
    loadReports();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else if (user.profile_type !== "admin") {
        navigate("/login");
      }
    }
  }, [user, loading, navigate]);

  if (loading) return null;

  const currentReport = reports[currentIndex];

  const handleNext = () => {
    if (currentIndex < reports.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  if (!currentReport) return <LoadingScreen />

  return (
    <div>
        <Header />
        <div className="admin-screen">
        <h1 className="admin-title">Gestión de Reportes</h1>
        <div className="report-card">
            <header>
            <h2>Reporte #{currentReport.report_id}</h2>
            </header>
            <div className="report-body">
            <div className="report-details">
                <p><strong>Usuario reportado (ID):</strong> {currentReport.reported_user_id}</p>
                <p><strong>Reportado por (ID):</strong> {currentReport.reporter_user_id}</p>
                <p><strong>Motivo:</strong> {currentReport.report_motive}</p>
                <p><strong>Descripción:</strong> {currentReport.report_description}</p>
            </div>
            <div className="report-evidence">
                <h3>Evidencias:</h3>
                {currentReport.evidence.length > 0 ? (
                <div className="evidence-grid">
                    {currentReport.evidence.map((src, index) => (
                    <img key={index} src={src} alt={`evidencia-${index}`} />
                    ))}
                </div>
                ) : (
                <p>No se adjuntaron evidencias.</p>
                )}
            </div>
            </div>
            <div className="report-footer">
            <div className="nav-buttons">
                <button onClick={handlePrev} disabled={currentIndex === 0}>Anterior</button>
                <button onClick={handleNext} disabled={currentIndex === reports.length - 1}>Siguiente</button>
            </div>
            <div className="admin-actions">
                <button className="danger">Suspender Usuario</button>
                <button className="neutral">Descartar Reporte</button>
            </div>
            </div>
        </div>
        </div>
        {isSidebarClicked && (
          <>
            <div className="overlay" onClick={() => setIsSidebarClicked(false)} />
            <AdminSidebar />
          </>
        )}
    </div>
  );
}

export default AdminScreen;
