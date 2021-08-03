import { Component } from "react";
import Diagrams from "./Diagrams";
import ConfirmEmailPrompt from "./ConfirmEmailPrompt";
import { getProfile, logOut } from "../../global/globalFuncs";
import { connect } from "react-redux";
import axios from "axios";

class Profile extends Component {
  state = { loadingProfile: true };
  cancelToken = axios.CancelToken.source();

  async componentDidMount() {
    try {
      await getProfile(this.cancelToken);
      this.setState({ loadingProfile: false });
    } catch (e) {}
  }

  componentWillUnmount() {
    this.cancelToken.cancel("Request is being canceled");
  }

  render() {
    let profileContent;
    if (!this.state.loadingProfile) {
      profileContent = (
        <>
          <div className="container-text">
            Logged in as <span style={{ color: "#009901", fontWeight: "bold" }}>{this.props.user.username}</span> (
            {this.props.user.email})
          </div>
          <div className="container-text">
            Welcome {this.props.user.firstName} {this.props.user.lastName}!
          </div>
          <br />
          {this.props.user.confirmed ? <Diagrams /> : <ConfirmEmailPrompt />}
        </>
      );
    } else {
      profileContent = (
        <div className="loading-data">
          <h3>Loading your data...</h3>
        </div>
      );
    }
    return (
      <div className="container">
        <h2>Profile</h2>
        {profileContent}
        <button className="red-button" style={{ marginTop: 30 }} type="button" onClick={() => logOut()}>
          Log Out
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(Profile);
