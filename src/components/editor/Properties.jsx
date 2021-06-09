import EntityProperties from "./EntityProperties";
import ExtensionProperties from "./ExtensionProperties";
import RelationshipProperties from "./RelationshipProperties";
import AttributeProperties from "./AttributeProperties";
import LabelProperties from "./LabelProperties";
import { connect } from "react-redux";
import { deselect } from "../../actions/actions";
import { PercentToPixels } from "../../global/utils";
import {
  toolbarHeight,
  entityWidth,
  extensionRadius,
  relationshipWidth,
  attributeRadiusX,
} from "../../global/constants";
import { getComponentById } from "../../global/globalFuncs";

const Properties = (props) => {
  var stage = props.getStage(); // Reference to the stage
  var stageScrollX = stage ? stage.scrollLeft : 0; // How far we have scrolled horizontally
  var mobile = window.innerWidth <= 768 ? true : false;
  var scrollbarOffset = mobile ? 0 : 17; // Account for the bottom horizontal scrollbar on desktop
  var xPosition; // Position of currently selected component on the screen that helps determine
  //on which side of the screen the sidepanel will be drawn
  var loadedProperties; // Determines what kind of properties will be drawn on the sidepanel
  var rightSide = true;
  var sidepanelActive = "";
  var closeActive = "";
  var sidepanelHeightCutoff = 0; // In the case of Label it shortens the sidepanel's height to enable dragndrop of the label
  var sidepanelWidth = // Wider sidepanel for relationships
    props.selector.current.type === "relationship" || props.selector.current.type === "extension"
      ? props.general.sidepanelWidth.wide
      : props.general.sidepanelWidth.standard;

  if (props.selector.selectionExists) {
    sidepanelActive = " sidepanel-active-right";
    closeActive = " close-active";
    // Configure sidepanel based on what kind of component is selected
    switch (props.selector.current.type) {
      case "entity":
        let entity = getComponentById(props.selector.current.id);
        xPosition = entity.x + entityWidth / 2;
        loadedProperties = <EntityProperties />;
        break;
      case "extension":
        let extension = getComponentById(props.selector.current.id);
        xPosition = extension.x + extensionRadius;
        loadedProperties = <ExtensionProperties />;
        break;
      case "relationship":
        let relationship = getComponentById(props.selector.current.id);
        xPosition = relationship.x + relationshipWidth;
        loadedProperties = <RelationshipProperties />;
        break;
      case "attribute":
        let attribute = getComponentById(props.selector.current.id);
        xPosition = attribute.x + attributeRadiusX;
        loadedProperties = <AttributeProperties />;
        break;
      case "label":
        sidepanelHeightCutoff = mobile ? 300 : 0;
        let label = getComponentById(props.selector.current.id);
        xPosition = label.x + label.width / 2;
        loadedProperties = <LabelProperties />;
        break;
      default:
        xPosition = window.innerWidth / 2;
        loadedProperties = <h3>How the heck did you get here?</h3>;
        break;
    }

    if (xPosition > stageScrollX + window.innerWidth - PercentToPixels(window.innerWidth, sidepanelWidth)) {
      rightSide = false;
      sidepanelActive = " sidepanel-active-left";
    }
  }

  var sidepanelClasses = "sidepanel" + sidepanelActive;
  var closeClasses = "close" + closeActive;

  return (
    <div
      className={sidepanelClasses}
      style={{
        width: sidepanelWidth + "vw",
        height: window.innerHeight - toolbarHeight - sidepanelHeightCutoff - scrollbarOffset + "px",
      }}
    >
      <button className={closeClasses} style={rightSide ? { left: 0 } : { right: 0 }} onClick={() => props.deselect()}>
        &#x2715;
      </button>
      {loadedProperties}
    </div>
  );
};

const mapStateToProps = (state) => ({
  components: state.components,
  selector: state.selector,
  general: state.general,
});

const mapDispatchToProps = {
  deselect,
};

export default connect(mapStateToProps, mapDispatchToProps)(Properties);
