import React, {PureComponent, PropTypes} from 'react';
import {isEmpty, includes} from 'lodash';
import classnames from 'classnames';

class TileComponent extends PureComponent {

  static PropTypes = {
    tile: PropTypes.object,
    onClickTile: PropTypes.func,
    selectedTiles: PropTypes.array
  };

  onClickTile = () => {
    const {props} = this;

    props.onClickTile( props.tile );
  };

  render() {
    const {props: {tile, selectedTiles}} = this,
      currentTile = tile.id,
      tileStyle = selectedTiles.find( selectedTile => selectedTile.id === currentTile ) ? { backgroundColor: tile.colour } : {},
      clickAllowed = !tile.disabled && selectedTiles.length < 2,
      tileClass = classnames( 'tile-item', { 'tile-disabled': tile.disabled } );

    return (<div className={tileClass} onClick={clickAllowed && this.onClickTile} style={tileStyle}></div>);
  }

}

module.exports = TileComponent;