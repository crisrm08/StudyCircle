import React, { useEffect, useState } from "react";
import Header from "../Common/Header";
import "../../css/adminscreen.css";

function AdminScreen() {
  const [reports, setReports] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Simulación de datos, más adelante usarás fetch
    const dummyReports = [
      {
        report_id: 1,
        reported_user_id: 12,
        reporter_user_id: 45,
        report_motive: "El tutor intentó causarme daño físico, emocional o económico",
        report_description: "El tutor usó lenguaje agresivo y me amenazó durante la tutoría.",
        evidence: [
          "https://via.placeholder.com/200",
          "https://via.placeholder.com/201",
          "https://via.placeholder.com/200",
          "https://via.placeholder.com/201"
        ]
      },
      {
        report_id: 2,
        reported_user_id: 18,
        reporter_user_id: 60,
        report_motive: "Estudiante evitó el pago de tutoría",
        report_description: "El estudiante no realizó el pago acordado después de la tutoría.",
        evidence: []
      }
    ];
    setReports(dummyReports);
  }, []);

  const currentReport = reports[currentIndex];

  const handleNext = () => {
    if (currentIndex < reports.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  if (!currentReport) return <div className="admin-screen">Cargando reporte...</div>;

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
    </div>
  );
}

export default AdminScreen;
