import React, {PureComponent, PropTypes} from 'react';

class Timer extends PureComponent {

  static PropTypes = {
    startTime: PropTypes.number,
    onTimeFinish: PropTypes.func,
    startNextLevel: PropTypes.func,
    stopTimer: PropTypes.bool
  };

  state = { time: this.props.startTime };

  startTimer = () => {
    if ( !this.state.time ) {
      clearInterval( this.timer );
      this.props.onTimeFinish();
      return;
    }
    this.setState( prevState => ({ time: prevState.time - 1 }) );
  };

  componentDidMount() {
    this.timer = setInterval( this.startTimer, 1000 );
  }

  componentWillReceiveProps( nextProps ) {
    if ( nextProps.stopTimer ) {
      clearInterval( this.timer );
      nextProps.startNextLevel( this.state.time );
    }
  }

  render() {
    return (<h4 className="rfloat timer">Time Left : {this.state.time} seconds</h4>)
  }
}

module.exports = Timer;
