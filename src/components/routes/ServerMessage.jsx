import emailConfirmedImg from "../../img/mail.png";
import fofImg from "../../img/404.png";
import warningImg from "../../img/warning.png";

const ServerMessage = () => {
  let header = "404";
  let icon = fofImg;
  let paragraph = "Message not found.";

  const queryString = window.location.search.split("=", 2);
  if (queryString[0] === "?res") {
    switch (queryString[1]) {
      case "email_confirmed":
        header = "Success!";
        icon = emailConfirmedImg;
        paragraph = "Check your new email address for confirmation.";
        break;
      case "link_expired":
        header = "That link has expired!";
        icon = warningImg;
        paragraph = "Please try again.";
        break;
      default:
        break;
    }
  }

  return (
    <div className="general-centered-container">
      <div className="container">
        <h2>{header}</h2>
        <img className="container-icon" src={icon} alt=":(" />
        <p>{paragraph}</p>
      </div>
    </div>
  );
};

export default ServerMessage;
