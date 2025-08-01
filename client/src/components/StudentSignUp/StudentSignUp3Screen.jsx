import React, { useState, useContext } from "react";
import axios from "axios";
import LoadingScreen from "../Common/LoadingScreen";
import { StudentSignUpContext } from "../../contexts/StudentSignUpContext";
import { supabase } from "../Supabase/supabaseClient";
import { MdKeyboardArrowLeft } from "react-icons/md";
import SignUpModal from "./SignUpModal";
import "../../css/signUpStyles/signup.css";
import { useNavigate } from "react-router-dom";


function StudentSignUp3Screen() {
  const { studentSignUpData } = useContext(StudentSignUpContext);
  const [idPhoto, setIdPhoto] = useState(null);
  const [selfiePhoto, setSelfiePhoto] = useState(null);
  const [declarationConfirmed, setConfirmDeclaration] = useState(false);
  const [idPreview, setIdPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const navigate = useNavigate();

  async function signUpSuccesful(e) {
    e.preventDefault();
    setLoading(true);

    const { email, password, id_photo, selfie_photo, ...profileData } = studentSignUpData;
    const formData = new FormData();
    formData.append("email", email);
    formData.append("id_photo", idPhoto);
    formData.append("selfie_photo", selfiePhoto);

    Object.entries(profileData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/student-signup`, formData);
      const origin = window.location.origin; 
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/edit-student-profile`,
          data: {
            name: profileData.name
          }
        }
      });

      if (error) {
        setLoading(false);
        alert("Error al registrar usuario: " + error.message);
        return;
      }

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user-link-supabase`, {
        email,
        supabase_user_id: data.user.id
      });

      setShowModal(true);

    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.error || "Las imágenes no coinciden. Intenta de nuevo.");
      } else {
        alert("Error durante el registro. Intenta de nuevo.");
      }
      console.error("Error during signup:", error);
    } finally {
      setLoading(false);
    }
  }

  function handlePhotoSubmit (e){
    e.preventDefault();
    if (idPhoto && selfiePhoto && declarationConfirmed) {
      console.log("ID Photo:", idPhoto);
      console.log("Selfie Photo:", selfiePhoto);
      signUpSuccesful(e);
    } else {
      alert("Por favor, complete todos los campos y acepte la declaración.");
    }
  };

  function handleIDPhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['jpg','jpeg','png'].includes(ext)) {
      alert('Formato inválido. Solo .jpg, .jpeg o .png.');
      e.target.value = null;
      return;
    }

    setIdPhoto(file); 
    setIdPreview(URL.createObjectURL(file));
  }

  function handleSelfiePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return; 

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['jpg','jpeg','png'].includes(ext)) {
      alert('Formato inválido. Solo .jpg, .jpeg o .png.');
      e.target.value = null;
      return;
    }

    setSelfiePhoto(file);
    setSelfiePreview(URL.createObjectURL(file));
  }

  function goBack() {
    navigate(-1);
  }

  return (
    <div className="Student-sign-up-1">
      {loading === true ? (
        <LoadingScreen />
      ) : (
        <>
          <h1 className="title" onClick={goBack}> <MdKeyboardArrowLeft size={50}/> StudyCircle </h1>
          <div className="Sign-up-form">
            <form className="photo-form" onSubmit={handlePhotoSubmit}>
              <h1>Sube tus fotos</h1>

              <div className="photo-upload-container">
                <div className="upload-section">
                  <div className="photo-box">
                    <div className="photo-preview-container">
                      {idPreview && ( <img src={idPreview} alt="Previsualización cédula" className="photo-preview" />)}
                    </div>
                    <label htmlFor="id-photo" className="photo-label"> Subir cédula </label>
                    <input id="id-photo" name="id_photo" type="file" accept=".jpg, .jpeg, .png" onChange={handleIDPhotoChange} hidden/>
                  </div>

                  <div className="photo-box circular">
                    <div className="photo-preview-container">
                      {selfiePreview && ( <img src={selfiePreview} alt="Previsualización selfie" className="photo-preview circular" />)}
                    </div>
                    <label htmlFor="selfie-photo" className="photo-label"> Subir selfie </label>
                    <input id="selfie-photo" name="selfie_photo" type="file" accept=".jpg, .jpeg, .png" onChange={handleSelfiePhotoChange} hidden/>
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
                <p>Estas imágenes son recopiladas por motivos de seguridad, las mismas serán analizadas</p>
              </div>

              <button type="submit">Enviar</button>
            </form>
          </div>
          {showModal && (
            <SignUpModal isOpen={showModal} onClose={() => 
              { setShowModal(false)
                navigate("/login");
              }}/>
          )}
        </>
      )}
    </div>
  );
}

export default StudentSignUp3Screen;