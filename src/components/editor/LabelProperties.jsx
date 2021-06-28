import { connect } from "react-redux";
import { setTextLabel, deleteLabel, deselect } from "../../actions/actions";
import { labelTextSize } from "../../global/constants";
import { getComponentById } from "../../global/globalFuncs";

const LabelProperties = (props) => {
  const label = getComponentById(props.selector.current.id);
  return (
    <div className="sidepanel-content">
      <h3>Label</h3>
      <textarea
        className="label-input"
        name="text"
        id="text"
        value={label.text}
        maxLength={labelTextSize}
        onChange={(e) =>
          props.setTextLabel({
            id: props.selector.current.id,
            text: e.target.value,
          })
        }
      />
      <button
        className="properties-delete-button"
        type="button"
        onClick={() => {
          props.deleteLabel({
            id: props.selector.current.id,
          });
          props.deselect();
        }}
      >
        Delete
      </button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  components: state.components,
  selector: state.selector,
});

const mapDispatchToProps = {
  setTextLabel,
  deleteLabel,
  deselect,
};

export default connect(mapStateToProps, mapDispatchToProps)(LabelProperties);
