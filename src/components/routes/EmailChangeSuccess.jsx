import React from "react";
import emailConfirmedImg from "../../img/mail.png";

const EmailChangeSuccess = () => (
  <div className="general-centered-container">
    <div className="container">
      <h2>Success!</h2>
      <img className="container-icon" src={emailConfirmedImg} alt=":(" />
      <p>Check your new email address for confirmation.</p>
    </div>
  </div>
);

export default EmailChangeSuccess;
