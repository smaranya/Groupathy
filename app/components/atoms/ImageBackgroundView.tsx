import React from 'react';
import {ImageView, getInitialState} from './ImageView';
import {getResizeMode} from '../../styles/imageResizeMode';
import {ImageBackground, ImageResizeMode} from 'react-native';

export class ImageBackgroundView extends ImageView {
  readonly state = getInitialState(this.props);
  render() {
    const {width, height, imageStyle, resizeMode, style} = this.props;

    this.calculateImageSpecificDetails(this.props);
    if (!this.imageURI) return null;
    return (
      <ImageBackground
        source={{uri: this.imageURI}}
        imageStyle={imageStyle && imageStyle}
        resizeMode={getResizeMode(resizeMode) as ImageResizeMode}
        style={[
          height ? {height} : undefined,
          width ? {width} : undefined,
          height && width ? undefined : {aspectRatio: this.state.aspectRatio},
          style,
        ]}>
        {this.props.children}
      </ImageBackground>
    );
  }
}
