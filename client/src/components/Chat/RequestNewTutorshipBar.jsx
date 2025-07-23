import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Request from "../TutorFacts/Request"
import RatingModal from "./RatingModal";
import "../../css/chatStyles/sessioncontrolbar.css";

function RequestNewTutorshipBar({needsRating, onRate, loggedUserRole }) {
    const [renderRequest, setRenderRequest] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const navigate = useNavigate();

    function hanldeOpenRating(params) {
        setShowRatingModal(true);
    }

    function handleSubmitRating(values) {
        onRate(values);
    }

    function handleClose() {
        setRenderRequest(false);
        setShowRatingModal(false);
    }

    function handleNewRequest() {
        setRenderRequest(true);
    }

    return (
        <div className="session-bar">
            { needsRating ? (
                <div className="session-control-buttons">
                    {loggedUserRole  === "student" ? (
                        <button className="end-session-button" onClick={hanldeOpenRating}> Pagar y calificar tutoría </button>
                    ) : (
                        <button className="end-session-button" onClick={hanldeOpenRating}> Calificar estudiante </button>
                    )}
                </div>
            ) : (
                <div className="session-control-buttons">
                    {loggedUserRole === "student" ? (
                        <button className="end-session-button" onClick={handleNewRequest}> Solicitar otra tutoría </button>
                    ) : (
                        <h1 className="session-h1">Tutoría ya finalizada</h1>
                    )}
                </div>
            )} 
            {renderRequest && ( <Request onClose={handleClose} />)}
            {showRatingModal && (
                <RatingModal
                    isOpen={showRatingModal}
                    onClose={handleClose}
                    onSubmit={handleSubmitRating}
                    loggedUserRole={loggedUserRole}
                />
            )}
        </div>
    );
}

export default RequestNewTutorshipBar;
