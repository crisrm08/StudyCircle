import React, { useEffect, useState, useContext } from "react";
import Header from "../Common/Header";
import AdminSidebar from "./AdminSidebar";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../Common/LoadingScreen"
import { useUser } from "../../contexts/UserContext";
import { SidebarContext } from "../../contexts/SidebarContext";
import axios from "axios";
import "../../css/adminscreen.css";

function AdminScreen() {
  const [reports, setReports] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user, loading } = useUser();
  const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadReports() {
      const resp = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/reports`);
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
  console.log("CurrentReport object " + JSON.stringify(currentReport));
  
  const handleNext = () => {
    if (currentIndex < reports.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleDiscard = async () => {
    const id = currentReport.report_id;
    try {
      const resp = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/report/${id}`, {
        method: 'DELETE'
      });
      const body = await resp.json();
      if (!resp.ok) throw new Error(body.error || 'Error del servidor');

      setReports(prev => {
        const updated = prev.filter(r => r.report_id !== id);
        if (currentIndex >= updated.length && updated.length > 0) {
          setCurrentIndex(updated.length - 1);
        }
        return updated;
      });
    } catch (err) {
      console.log( 'No se pudo descartar: ' + err.message);
    }
  };

  function handleSuspend() {
    const id = currentReport.report_id;
    axios.patch(`${process.env.REACT_APP_BACKEND_URL}/user/suspend/${currentReport.reported_user_id}`)
      .then(() => {
        setReports(prev => {
        const updated = prev.filter(r => r.report_id !== id);
        if (currentIndex >= updated.length && updated.length > 0) {
          setCurrentIndex(updated.length - 1);
        }
        return updated;
      });
      });
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
                <button className="danger" onClick={handleSuspend}>Suspender Usuario</button>
                <button className="neutral" onClick={handleDiscard}>Descartar Reporte</button>
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
