import React, { useState } from "react";
import "../../css/signUpStyles/signup.css";
import { useNavigate } from "react-router-dom";

function StudentSignUp3Screen() {
  const [idPhoto, setIdPhoto] = useState(null);
  const [selfiePhoto, setSelfiePhoto] = useState(null);
  const [declarationConfirmed, setConfirmDeclaration] = useState(false);
  const [idPreview, setIdPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);

  const navigate = useNavigate();

  function handleSubmit (e){
    e.preventDefault();
    if (idPhoto && selfiePhoto && declarationConfirmed) {
      console.log("ID Photo:", idPhoto);
      console.log("Selfie Photo:", selfiePhoto);
      navigate("/student-profile");
    } else {
      alert("Por favor, complete todos los campos y acepte la declaración.");
    }
  };

  return (
    <div className="Student-sign-up-1">
      <h1 className="title">StudyCircle</h1>
      <div className="Sign-up-form">
        <form className="photo-form" onSubmit={handleSubmit}>
          <h1>Sube tus fotos</h1>

          <div className="photo-upload-container">
            <div className="upload-section">
              <div className="photo-box">
                <div className="photo-preview-container">
                  {idPreview && ( <img src={idPreview} alt="Previsualización cédula" className="photo-preview" />)}
                </div>
                <label htmlFor="id-photo" className="photo-label"> Subir cédula </label>
                <input
                  id="id-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setIdPhoto(file);
                      setIdPreview(URL.createObjectURL(file));
                    }
                  }}
                  hidden
                />
              </div>

              <div className="photo-box circular">
                <div className="photo-preview-container">
                  {selfiePreview && ( <img src={selfiePreview} alt="Previsualización selfie" className="photo-preview circular" />)}
                </div>
                <label htmlFor="selfie-photo" className="photo-label"> Subir selfie </label>
                <input
                  id="selfie-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setSelfiePhoto(file);
                      setSelfiePreview(URL.createObjectURL(file));
                    }
                  }}
                  hidden
                />
              </div>
            </div>
          </div>

          <div className="declaration-container">
            <div className="declaration-checkbox">
              <input
                id="declaration"
                type="checkbox"
                checked={declarationConfirmed}
                onChange={(e) => { setConfirmDeclaration(e.target.checked);}}
              />
              <label htmlFor="declaration"> Declaro que la información proporcionada es verdadera</label>
            </div>
            <p>Estas imágenes son recopiladas por motivos de seguridad, las mismas serán analizadas por nuestro equipo</p>
          </div>

          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
}

export default StudentSignUp3Screen;