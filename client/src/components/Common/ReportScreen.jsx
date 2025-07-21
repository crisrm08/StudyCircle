import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import Header from "./Header";
import { useUser } from "../../contexts/UserContext";
import { SidebarContext } from "../../contexts/SidebarContext";
import TutorSidebar from "./TutorSidebar";
import StudentSidebar from "./StudentSidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/reportscreen.css";

function ReportScreen() {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [ showToast, setShowToast ] = useState(false)
  const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
  const { id, tutorship } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const tutorOptions = [
    { value: "evitopago", label: "Estudiante evitó el pago de tutoría" },
    { value: "ofensa", label: "El estudiante utilizó un lenguaje ofensivo o inapropaido" },
    { value: "violenta", label: "Conducta violenta o intimidatoria por parte del estudiante"},
    { value: "incumplimiento", label: "El estudiante no asistió a la tutoría" },
    { value: "estafa", label: "El estudiante intentó estafarme o perjudicarme"},
    { value: "otro", label: "Otro (Descríbelo)"}
  ];
    
  const studentOptions = [
    { value: "noimpartio", label: "El tutor no impartió la tutoría como fue acordado"},
    { value: "violentatutor", label: "Conducta violenta o intimidatoria por parte del tutor"},
    { value: "ofensatutor", label: "El tutor utilizó un lenguaje ofensivo o inapropaido" },
    { value: "perjudicar", label: "El tutor intentó estafarme o perjudicarme"},
    { value: "nocapaz", label: "El tutor no tiene la preparación adecuada para impartir tutorías"},
    { value: "otra", label: "Otro (Descríbelo)" },
  ];

  function handleFileChange(e) {
    const fileList = Array.from(e.target.files);
    setFiles(fileList);
    setPreviews(fileList.map(f => URL.createObjectURL(f)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedIssue || !description) {
      alert('Por favor completa todos los campos');
      return;
    }
    const form = new FormData();
    form.append('reporter_user_id', user.user_id);
    form.append('report_motive', selectedIssue.label);
    form.append('report_description', description);
    form.append('tutorship_request_id', tutorship);
    files.forEach(file => form.append('evidence', file));

    try {
      await axios.post(`http://localhost:5000/user/report/${id}`,form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setShowToast(true);
      setTimeout(() => {
          setShowToast(false);
          navigate("/chat");
      }, 2000);
    } catch (err) {
      console.error('Error sending report:', err.response || err);
      alert('Falló el envío del reporte');
    }
  }

  if (!user) return null; 
    
  return (
    <div>
        <Header />
        <div className="report-screen">
        {user.profile_type === "tutor" ? (
           <h1>Reportar estudiante</h1>
        ) : (
           <h1>Reportar tutor</h1>
        )}
       
        <form onSubmit={handleSubmit} className="report-form">
            <label>Selecciona el tipo de falta</label>
            {user.profile_type === "tutor"  ? (
              <Select options={tutorOptions} value={selectedIssue} onChange={setSelectedIssue} placeholder="Selecciona una opción..."/>
            ) : (
              <Select options={studentOptions} value={selectedIssue} onChange={setSelectedIssue} placeholder="Selecciona una opción..."/>
            )}

            <label>Descripción</label>
            <textarea placeholder="Describe lo sucedido..." value={description} onChange={(e) => setDescription(e.target.value)}/>

            <label>Evidencias (imágenes)</label>
            <input type="file" accept="image/*" multiple onChange={handleFileChange}/>

            <div className="image-preview">
                {previews.map((src, idx) => (
                  <img key={idx} src={src} alt="preview" width={100} />
                ))}
            </div>
            <button type="submit" className="send-button">Enviar reporte</button>
        </form>
        </div>
        {showToast && <div className="toast">✅ Reporte enviado</div>}
        {isSidebarClicked && user.profile_type === "tutor" && (
          <>
            <div className="overlay" onClick={() => setIsSidebarClicked(false)} />
            <TutorSidebar />
          </>
        )}
        {isSidebarClicked && user.profile_type === "student" && (
          <>
            <div className="overlay" onClick={() => setIsSidebarClicked(false)} />
            <StudentSidebar />
          </>
        )}
    </div>
  );
}

export default ReportScreen;
