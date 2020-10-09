import React from "react";
import Diagram from "./Diagram";
import { connect } from "react-redux";
import { diagramLimit } from "../../global/constants.js";

const Diagrams = (props) => {
  var unsortedDiagramsList = [];
  var sortedDiagramsList = [];

  // Place user diagram info in a list
  for (let i in props.user.diagrams) {
    unsortedDiagramsList.push({
      diagram: <Diagram key={i} index={i} />,
      date: props.user.diagrams[i].updatedAt,
    });
  }

  // Sort that list based on date updated (recently updated to the top)
  unsortedDiagramsList.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  // We add the diagram components in another list for rendering
  for (let i in unsortedDiagramsList) {
    sortedDiagramsList.push(unsortedDiagramsList[i].diagram);
  }

  var diagramCountText = (
    <span
      style={{
        color: props.user.diagramsOwned >= diagramLimit ? "red" : "black",
      }}
    >
      {props.user.diagramsOwned}
    </span>
  );

  return (
    <>
      <h3>
        Your Diagrams ({diagramCountText}/{diagramLimit}):
      </h3>
      <table className="diagrams-table">
        <tbody>{sortedDiagramsList}</tbody>
      </table>
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  general: state.general,
});

export default connect(mapStateToProps, null)(Diagrams);
