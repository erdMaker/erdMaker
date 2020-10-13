import React from "react";
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
    props.selector.current.type === "relationship"
      ? props.stager.sidepanelWidth.relationship
      : props.stager.sidepanelWidth.general;

  if (props.selector.selectionExists) {
    sidepanelActive = " sidepanel-active-right";
    closeActive = " close-active";
    // Configure sidepanel based on what kind of component is selected
    switch (props.selector.current.type) {
      case "entity":
        let entityIndex = props.components.entities.findIndex((entity) => entity.id === props.selector.current.id);
        xPosition = props.components.entities[entityIndex].x + entityWidth / 2;
        loadedProperties = <EntityProperties />;
        break;
      case "extension":
        let extensionIndex = props.components.extensions.findIndex(
          (extension) => extension.id === props.selector.current.id
        );
        xPosition = props.components.extensions[extensionIndex].x + extensionRadius;
        loadedProperties = <ExtensionProperties />;
        break;
      case "relationship":
        let relationshipIndex = props.components.relationships.findIndex(
          (relationship) => relationship.id === props.selector.current.id
        );
        xPosition = props.components.relationships[relationshipIndex].x + relationshipWidth;
        loadedProperties = <RelationshipProperties />;
        break;
      case "attribute":
        let attributeIndex = props.components.attributes.findIndex(
          (attribute) => attribute.id === props.selector.current.id
        );
        xPosition = props.components.attributes[attributeIndex].x + attributeRadiusX;
        loadedProperties = <AttributeProperties />;
        break;
      case "label":
        sidepanelHeightCutoff = mobile ? 300 : 0;
        let labelIndex = props.components.labels.findIndex((label) => label.id === props.selector.current.id);
        xPosition = props.components.labels[labelIndex].x + props.components.labels[labelIndex].width / 2;
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
  stager: state.stager,
});

const mapDispatchToProps = {
  deselect,
};

export default connect(mapStateToProps, mapDispatchToProps)(Properties);
