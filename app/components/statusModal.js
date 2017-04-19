import React, {PureComponent, PropTypes} from 'react';
import {Modal, Button} from 'react-bootstrap';

const noOfPairs = 6,
  IncompleteLevel = ( props ) => {
    return (
      <Modal bsSize="small" show={true}>
        <Modal.Body>
          <h3 className="help-text">Incomplete Level</h3>
          <Button bsStyle="primary" onClick={props.onClickStart}>Try Again</Button>
        </Modal.Body>
      </Modal>
    )
  },

  StartLevel = ( props ) => {
    return (
      <Modal bsSize="small" show={true}>
        <Modal.Body>
          <h3>Level {props.level}</h3>
          <div className="help-text">You have 60 seconds to match 6 pairs.
            There are 6 different tiles.
          </div>
          <Button bsStyle="primary" onClick={props.onClickStart}>Start</Button>
        </Modal.Body>
      </Modal>
    )
  },

  LevelComplete = ( props ) => {
    const bonus = props.bonusPoints + (props.perfectRecall ? 5 * noOfPairs : 0);

    return (
      <Modal bsSize="small" show={true}>
        <Modal.Body>
          <h3>Level {props.level - 1} Complete!</h3>
          {props.perfectRecall && <h4 className="help-text">Perfect Recall!!!</h4>}
          <h4 className="help-text">
            You Scored {props.points + bonus}. {bonus && <span>(bonus {bonus})</span>}
          </h4>
          <Button bsStyle="primary" onClick={props.onClickStart}>Next Level</Button>
        </Modal.Body>
      </Modal>
    )
  };

class HelpModal extends PureComponent {

  static PropTypes = {
    showHelpModal: PropTypes.bool,
    levelIncomplete: PropTypes.bool,
    startNexleveltLevel: PropTypes.number,
    onClickStart: PropTypes.func,
    startNextLevel: PropTypes.bool,
    points: PropTypes.number,
    bonusPoints: PropTypes.number,
    perfectRecall: PropTypes.bool
  };

  render() {
    const {props} = this;

    return (<div>
      {props.showHelpModal && <StartLevel {...props} />}
      {props.levelIncomplete && <IncompleteLevel {...props} />}
      {props.startNextLevel && <LevelComplete {...props} />}
    </div>)

  }

}

module.exports = HelpModal;