import LoginRegisterIndex from "../loginRegister/LoginRegisterIndex";
import ProfileIndex from "../profile/ProfileIndex";
import { LinkButton } from "../../global/globalComponents";
import { connect } from "react-redux";
import { resetActiveDiagram } from "../../actions/actions";

const Home = (props) => {
  document.title = "ERD Maker - Home";
  return (
    <div className="home-wrapper">
      <Description resetActiveDiagram={props.resetActiveDiagram} />
      {props.user.isLogged ? <ProfileIndex /> : <LoginRegisterIndex />}
    </div>
  );
};

const Description = (props) => (
  <div className="description">
    <div>
      Design Extended Entity - Relationship (EER) Diagrams.
      <br />
      <br />
      Get started as guest or log in to save your progress.
    </div>
    <LinkButton
      className="launch-button"
      style={null}
      label="New Diagram"
      useSpan={true}
      onClick={props.resetActiveDiagram}
      pathname="/editor"
    />
  </div>
);

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = {
  resetActiveDiagram,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
