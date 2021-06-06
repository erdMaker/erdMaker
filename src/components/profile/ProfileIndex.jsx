import { Component } from "react";
import Profile from "./Profile";
import EditProfile from "./EditProfile";

class ProfileIndex extends Component {
  state = {
    isProfileActive: true,
  };

  componentDidMount() {
    this.slidingTogglePanel.classList.add("right");
    this.slidingTogglePanelText.classList.add("right");
  }

  // Moves the sliding panel from one side to the other
  changeState = () => {
    if (this.state.isProfileActive) {
      this.slidingTogglePanel.classList.remove("right");
      this.slidingTogglePanel.classList.add("left");
      this.slidingTogglePanelText.classList.remove("right");
      this.slidingTogglePanelText.classList.add("left");
    } else {
      this.slidingTogglePanel.classList.remove("left");
      this.slidingTogglePanel.classList.add("right");
      this.slidingTogglePanelText.classList.remove("left");
      this.slidingTogglePanelText.classList.add("right");
    }
    this.setState((state) => ({
      isProfileActive: !state.isProfileActive,
    }));
  };

  render() {
    // When screen is small then "Edit Profile" appears in two rows
    const lineBreak = window.innerWidth <= 1440 ? null : <br />;
    const current = this.state.isProfileActive ? <>Edit {lineBreak}Profile</> : "Back";

    return (
      <div className="profile">
        {this.state.isProfileActive && <Profile />}
        {!this.state.isProfileActive && <EditProfile />}
        <SlidingTogglePanel
          current={current}
          containerRef={(ref) => (this.slidingTogglePanel = ref)}
          containerTextRef={(ref) => (this.slidingTogglePanelText = ref)}
          onClick={this.changeState}
        />
      </div>
    );
  }
}

const SlidingTogglePanel = (props) => (
  <div className="sliding-toggle-panel" ref={props.containerRef} onClick={props.onClick}>
    <div
      className="sliding-toggle-panel-text"
      ref={props.containerTextRef}
      style={{
        marginLeft: window.innerWidth / 50,
        marginRight: window.innerWidth / 50,
      }}
    >
      {props.current}
    </div>
  </div>
);

export default ProfileIndex;
