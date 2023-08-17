/* eslint-disable */
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */
'use strict';

import { View } from "react-native";

const EdgeInsetsPropType = require('react-native/Libraries/StyleSheet/EdgeInsetsPropType');
const ImageResizeMode = require('react-native/Libraries/Image/ImageResizeMode');
const DeprecatedImageSourcePropType = require('react-native/Libraries/DeprecatedPropTypes/DeprecatedImageSourcePropType');
const DeprecatedImageStylePropTypes = require('react-native/Libraries/DeprecatedPropTypes/DeprecatedImageStylePropTypes');
const PropTypes = require('prop-types');
const React = require('react');
var createReactClass = require('create-react-class');
const {NativeMethodsMixin} = React;
const ReactNativeViewAttributes = require('react-native/Libraries/Components/View/ReactNativeViewAttributes');
const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource');
const {requireNativeComponent} = require('react-native');
const StyleSheet = require('react-native/Libraries/StyleSheet/StyleSheet');
const NativeModules = require('react-native/Libraries/BatchedBridge/NativeModules');
const DeprecatedStyleSheetPropType = require('react-native/Libraries/DeprecatedPropTypes/DeprecatedStyleSheetPropType');

const flattenStyle = require('react-native/Libraries/StyleSheet/flattenStyle');
const ImageViewManager = NativeModules.ImageViewManager;

/* Custom SDWebImage wrapper to add Myntra user agent and fade-in images on load. */
// const RNTNetworkImageView = requireNativeComponent(
//   'RNTNetworkImage',
//   ImageView,
//   cfg,
// );

/**
 * A React component for displaying different types of images,
 * including network images, static resources, temporary local images, and
 * images from local disk, such as the camera roll.
 *
 * This exmaples shows both fetching and displaying an image from local storage as well as on from
 * network.
 *
 * ```ReactNativeWebPlayer
 * import React, { Component } from 'react';
 * import { AppRegistry, View, Image } from 'react-native';
 *
 * class DisplayAnImage extends Component {
 *   render() {
 *     return (
 *       <View>
 *         <ImageView
 *           source={require('./img/favicon.png')}
 *         />
 *         <ImageView
 *           source={{uri: 'http://facebook.github.io/react/img/logo_og.png'}}
 *         />
 *       </View>
 *     );
 *   }
 * }
 *
 * // App registration and rendering
 * AppRegistry.registerComponent('DisplayAnImage', () => DisplayAnImage);
 * ```
 *
 * You can also add `style` to an image:
 *
 * ```ReactNativeWebPlayer
 * import React, { Component } from 'react';
 * import { AppRegistry, View, Image, StyleSheet} from 'react-native';
 *
 * const styles = StyleSheet.create({
 *   stretch: {
 *     width: 50,
 *     height: 200
 *   }
 * });
 *
 *class DisplayAnImageWithStyle extends Component {
 *   render() {
 *     return (
 *       <View>
 *         <Image
 *           style={styles.stretch}
 *           source={require('./img/favicon.png')}
 *         />
 *       </View>
 *     );
 *   }
 * }
 *
 * // App registration and rendering
 * AppRegistry.registerComponent(
 *   'DisplayAnImageWithStyle',
 *   () => DisplayAnImageWithStyle
 * );
 * ```
 */
const ImageView = createReactClass({
  propTypes: {
    /**
     * > `ImageResizeMode` is an `Enum` for different image resizing modes, set via the
     * > `resizeMode` style property on `Image` components. The values are `contain`, `cover`,
     * > `stretch`, `center`, `repeat`.
     */
    style: DeprecatedStyleSheetPropType(DeprecatedImageStylePropTypes),
    /**
     * The image source (either a remote URL or a local file resource).
     */
    source: DeprecatedImageSourcePropType,
    /**
     * A static image to display while loading the image source.
     *
     * - `uri` - a string representing the resource identifier for the image, which
     * should be either a local file path or the name of a static image resource
     * (which should be wrapped in the `require('./path/to/image.png')` function).
     * - `width`, `height` - can be specified if known at build time, in which case
     * these will be used to set the default `<Image/>` component dimensions.
     * - `scale` - used to indicate the scale factor of the image. Defaults to 1.0 if
     * unspecified, meaning that one image pixel equates to one display point / DIP.
     * - `number` - Opaque type returned by something like `require('./image.jpg')`.
     *
     * @platform ios
     */
    defaultSource: PropTypes.oneOfType([
      // TODO: Tooling to support documenting these directly and having them display in the docs.
      PropTypes.shape({
        uri: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
        scale: PropTypes.number,
      }),
      PropTypes.number,
    ]),
    /**
     * When true, indicates the image is an accessibility element.
     * @platform ios
     */
    accessible: PropTypes.bool,
    /**
     * The text that's read by the screen reader when the user interacts with
     * the image.
     * @platform ios
     */
    accessibilityLabel: PropTypes.string,
    /**
     * blurRadius: the blur radius of the blur filter added to the image
     * @platform ios
     */
    blurRadius: PropTypes.number,
    /**
     * When the image is resized, the corners of the size specified
     * by `capInsets` will stay a fixed size, but the center content and borders
     * of the image will be stretched.  This is useful for creating resizable
     * rounded buttons, shadows, and other resizable assets.  More info in the
     * [official Apple documentation](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIImage_Class/index.html#//apple_ref/occ/instm/UIImage/resizableImageWithCapInsets).
     *
     * @platform ios
     */
    capInsets: EdgeInsetsPropType,
    /**
     * Determines how to resize the image when the frame doesn't match the raw
     * image dimensions.
     *
     * - `cover`: Scale the image uniformly (maintain the image's aspect ratio)
     * so that both dimensions (width and height) of the image will be equal
     * to or larger than the corresponding dimension of the view (minus padding).
     *
     * - `contain`: Scale the image uniformly (maintain the image's aspect ratio)
     * so that both dimensions (width and height) of the image will be equal to
     * or less than the corresponding dimension of the view (minus padding).
     *
     * - `stretch`: Scale width and height independently, This may change the
     * aspect ratio of the src.
     *
     * - `repeat`: Repeat the image to cover the frame of the view. The
     * image will keep it's size and aspect ratio. (iOS only)
     */
    resizeMode: PropTypes.oneOf(['cover', 'contain', 'stretch', 'repeat']),

    /**
     * Makes the image resize in a fixed `aspectRatio` as the prop. It can be
     * a number or a rectangle. As the width changes due to flex layout,
     * the height will change in proportion with same aspect ratio. Use this
     * to wrap images where you would like the aspect ratio to be maintained.
     */
    aspectRatio: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
      }),
    ]),

    /**

    /**
     * A unique identifier for this element to be used in UI Automation
     * testing scripts.
     */
    testID: PropTypes.string,
    /**
     * Invoked on mount and layout changes with
     * `{nativeEvent: {layout: {x, y, width, height}}}`.
     */
    onLayout: PropTypes.func,
    /**
     * Invoked on load start.
     *
     * e.g., `onLoadStart={(e) => this.setState({loading: true})}`
     */
    onLoadStart: PropTypes.func,
    /**
     * Invoked on download progress with `{nativeEvent: {loaded, total}}`.
     * @platform ios
     */
    onProgress: PropTypes.func,
    /**
     * Invoked on load error with `{nativeEvent: {error}}`.
     * @platform ios
     */
    onError: PropTypes.func,
    /**
     * Invoked when load completes successfully.
     */
    onLoad: PropTypes.func,
    /**
     * Invoked when load either succeeds or fails.
     */
    onLoadEnd: PropTypes.func,
  },

  statics: {
    resizeMode: ImageResizeMode,
    /**
     * Retrieve the width and height (in pixels) of an image prior to displaying it.
     * This method can fail if the image cannot be found, or fails to download.
     *
     * In order to retrieve the image dimensions, the image may first need to be
     * loaded or downloaded, after which it will be cached. This means that in
     * principle you could use this method to preload images, however it is not
     * optimized for that purpose, and may in future be implemented in a way that
     * does not fully load/download the image data. A proper, supported way to
     * preload images will be provided as a separate API.
     *
     * @param uri The location of the image.
     * @param success The function that will be called if the image was sucessfully found and width
     * and height retrieved.
     * @param failure The function that will be called if there was an error, such as failing to
     * to retrieve the image.
     *
     * @returns void
     *
     * @platform ios
     */
    getSize: function (
      uri: string,
      success: (width: number, height: number) => void,
      failure: (error: any) => void,
    ) {
      ImageViewManager.getSize(
        uri,
        success,
        failure ||
          function () {
            console.warn('Failed to get size for image: ' + uri);
          },
      );
    },
    /**
     * Prefetches a remote image for later use by downloading it to the disk
     * cache
     *
     * @param url The remote location of the image.
     *
     * @return The prefetched image.
     */
    prefetch(url: string) {
      return ImageViewManager.prefetchImage(url);
    },
  },

  mixins: [NativeMethodsMixin],

  /**
   * `NativeMethodsMixin` will look for this when invoking `setNativeProps`. We
   * make `this` look like an actual native component class.
   */
  viewConfig: {
    uiViewClassName: 'UIView',
    validAttributes: ReactNativeViewAttributes.UIView,
  },

  render: function () {
    for (var prop in cfg.nativeOnly) {
      if (this.props[prop] !== undefined) {
        console.warn(
          'Prop `' +
            prop +
            ' = ' +
            this.props[prop] +
            '` should ' +
            'not be set directly on ImageView.',
        );
      }
    }

    const source = resolveAssetSource(this.props.source) || {
      uri: undefined,
      width: undefined,
      height: undefined,
    };
    const defaultSource =
      (this.props.defaultSource &&
        resolveAssetSource(this.props.defaultSource)) ||
      {};
    const {width, height, uri} = source;

    const style =
      flattenStyle([{width, height}, styles.base, this.props.style]) || {};
    const resizeMode =
      this.props.resizeMode || (style || {}).resizeMode || 'cover'; // Workaround for flow bug t7737108
    const tintColor = (style || {}).tintColor; // Workaround for flow bug t7737108

    if (uri === '') {
      console.warn('source.uri should not be an empty string');
    }

    if (this.props.src) {
      console.warn(
        'The <Image> component requires a `source` property rather than `src`.',
      );
    }

    let box;
    if (typeof this.props.aspectRatio === 'number') {
      box = {
        width: this.props.aspectRatio,
        height: 1,
      };
    } else {
      box = this.props.aspectRatio;
    }

    return (
      // <RNTNetworkImageView
      //   {...this.props}
      //   style={style}
      //   resizeMode={resizeMode}
      //   tintColor={tintColor}
      //   src={source.uri}
      //   defaultImageSrc={defaultSource.uri}
      // />
      <View>
        
      </View>
    );
  },
});

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});

const cfg = {
  nativeOnly: {
    src: true,
    defaultImageSrc: true,
    imageTag: true,
    progressHandlerRegistered: true,
  },
};

export default ImageView;
