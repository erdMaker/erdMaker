import React from "react";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import { connect } from "react-redux";

class ProfileIndex extends React.Component {
  constructor() {
    super();
    this.state = {
      isProfileActive: true,
    };
  }

  componentDidMount() {
    this.slidingTogglePanel.classList.add("right");
  }

  changeState = () => {
    if (this.state.isProfileActive) {
      this.slidingTogglePanel.classList.remove("right");
      this.slidingTogglePanel.classList.add("left");
    } else {
      this.slidingTogglePanel.classList.remove("left");
      this.slidingTogglePanel.classList.add("right");
    }
    this.setState((state) => ({
      isProfileActive: !state.isProfileActive,
    }));
  };

  render() {
    const lineBreak = this.props.stager.screenWidth <= 1440 ? null : <br />;
    const current = this.state.isProfileActive ? <>Edit {lineBreak}Profile</> : "Back";
    return (
      <div className="profile">
        {this.state.isProfileActive && <Profile />}
        {!this.state.isProfileActive && <EditProfile />}
        <SlidingTogglePanel
          current={current}
          containerRef={(ref) => (this.slidingTogglePanel = ref)}
          onClick={this.changeState}
          screenWidth={this.props.stager.screenWidth}
        />
      </div>
    );
  }
}

const SlidingTogglePanel = (props) => (
  <div className="sliding-toggle-panel" ref={props.containerRef} onClick={props.onClick}>
    <div
      className="sliding-toggle-panel-text"
      style={{
        marginLeft: props.screenWidth / 50,
        marginRight: props.screenWidth / 50,
      }}
    >
      {props.current}
    </div>
  </div>
);

const mapStateToProps = (state) => ({ stager: state.stager });

export default connect(mapStateToProps, null)(ProfileIndex);
