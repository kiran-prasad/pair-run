import React, {PureComponent, PropTypes} from 'react';
import update from 'immutability-helper';
import {shuffle, map, forEach, get as _get} from 'lodash';
import StatusModal from './statusModal';
import TileComponent from './tileComponent';
import Timer from './timer';

class BoardContainer extends PureComponent {

  static PropTypes = {
    tilesConfig: PropTypes.array
  };

  constructor( props ) {
    super( props );

    this.state = Object.assign( {}, this.getInitialBoardState( props ), { level: 1 } );
  }

  getInitialBoardState = ( props ) => {
    const tiles = shuffle(props.tilesConfig).map( config => Object.assign( config, {
      disabled: false,
      clickCount: 0
    } ) );

    this.disabledTilesCount = 0;

    return {
      matchKnown: false,
      startTimer: false,
      disabledTilesCount: 0,
      bonusPoints: 0,
      showHelpModal: true,
      selectedTiles: [],
      points: 0,
      levelIncomplete: false,
      startNextLevel: false,
      perfectRecall: true,
      tiles
    }
  };

  onClickStart = () => this.setState( Object.assign( {}, this.getInitialBoardState( this.props ), {
    startTimer: true,
    showHelpModal: false
  } ) );

  onTimeFinish = () => this.setState( Object.assign( {}, this.getInitialBoardState( this.props ), {
    levelIncomplete: true,
    showHelpModal: false
  } ) );

  onStartNextLevel = timeRemaining => this.setState( ( prevState ) => {
    const tiles = shuffle( this.state.tiles ).map( config => Object.assign( config, {
      disabled: false,
      clickCount: 0
    } ) );
    return { level: prevState.level + 1, bonusPoints: timeRemaining, startNextLevel: true, startTimer: false, tiles }
  } );

  setClearTileTimeout = () => {
    setTimeout( () => {
      this.setState( ( prevState ) => {
        const maxTilesSelected = prevState.selectedTiles.length === 2,
          updatedSelectedTiles = maxTilesSelected ? [] : prevState.selectedTiles,
          matchKnown = maxTilesSelected ? false : prevState.matchKnown;

        return { selectedTiles: updatedSelectedTiles, matchKnown }
      } );
    }, 1500 );
  };

  onClickTile = selectedTile => {
    const that = this,
      selectedColour = selectedTile.colour,
      selectedTileId = selectedTile.id,
      prevSelectedTileId = _get( that, 'state.selectedTiles.0.id' ),
      firstSelectedTileColour = _get( that, 'state.selectedTiles.0.colour' );

    if ( prevSelectedTileId && prevSelectedTileId === selectedTileId ) {
      return;
    }
    that.setState( ( prevState ) => {
      const {tiles, points, selectedTiles} = prevState,
        selectedTileIndex = tiles.findIndex( tile => tile.id === selectedTileId ),
        prevSelectedTileIndex = tiles.findIndex( tile => tile.id === prevSelectedTileId ),
        matchKnown = tiles.find( tile => (tile.colour === selectedColour && tile.id !== selectedTileId) ).clickCount > 0,
        disabled = !!selectedTiles[ 0 ] && selectedTiles[ 0 ].colour === selectedColour,
        updatedSelectedTiles = update( prevState.selectedTiles, { $push: [ selectedTile ] } ),
        firstSelectedTileMatch = prevSelectedTileId && tiles.find( tile => (tile.colour === firstSelectedTileColour && tile.id !== prevSelectedTileId) ).clickCount > 0,
        updatedPoints = disabled ? points + 20 : (firstSelectedTileMatch ? points - 5 : points),
        disabledTilesCount = that.disabledTilesCount = disabled ? that.disabledTilesCount + 2 : that.disabledTilesCount,
        perfectRecall = firstSelectedTileMatch && !disabled ? false : prevState.perfectRecall;
      let updatedTiles = update( tiles, {
        [selectedTileIndex]: {
          $set: {
            id: selectedTileId,
            colour: selectedColour,
            clickCount: selectedTile.clickCount + 1,
            disabled
          }
        }
      } );

      if ( prevSelectedTileId ) {
        updatedTiles = update( updatedTiles, {
          [prevSelectedTileIndex]: { disabled: { $set: matchKnown && disabled } }
        } )
      }

      return {
        selectedTiles: updatedSelectedTiles,
        points: updatedPoints,
        tiles: updatedTiles,
        matchKnown: matchKnown && !prevSelectedTileId,
        stopTimer: disabledTilesCount === tiles.length,
        perfectRecall
      };
    } );
    prevSelectedTileId && that.setClearTileTimeout();
  };

  render() {
    const that = this,
      {state} = that,
      tiles = state.tiles.map( tile => <TileComponent key={tile.id} tile={tile} onClickTile={that.onClickTile}
                                                      selectedTiles={state.selectedTiles}/> );

    return (
      <div>
        <h4 className="lfloat level">Level : {state.level}</h4>
        {state.startTimer && <Timer startTime={60} onTimeFinish={that.onTimeFinish} stopTimer={state.stopTimer}
                                    startNextLevel={that.onStartNextLevel}/>}
        <div className="boardContainer clear-float">
          <StatusModal showHelpModal={state.showHelpModal} levelIncomplete={state.levelIncomplete} level={state.level}
                       onClickStart={that.onClickStart} startNextLevel={state.startNextLevel} points={state.points}
                       bonusPoints={state.bonusPoints} perfectRecall={state.perfectRecall}/>
          <div className="match-text-cont clearfix">
            {state.matchKnown && <h4 className="match-known">Match is Known</h4>}
          </div>
          {tiles}
        </div>
        <h3 className="score">Score : {state.points}</h3>
      </div>)
  }
}

module.exports = BoardContainer;