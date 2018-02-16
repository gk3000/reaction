import React, { Component } from "react";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import Measure from "react-measure";
import classnames from "classnames";
import { Components } from "@reactioncommerce/reaction-components";
import { Reaction } from "/client/api";

class MediaGallery extends Component {
  static propTypes = {
    allowFeaturedMediaHover: PropTypes.bool,
    editable: PropTypes.bool,
    featuredMedia: PropTypes.object,
    media: PropTypes.arrayOf(PropTypes.object),
    mediaGalleryHeight: PropTypes.number,
    mediaGalleryWidth: PropTypes.number,
    onDrop: PropTypes.func,
    onMouseEnterMedia: PropTypes.func,
    onMouseLeaveMedia: PropTypes.func,
    onMoveMedia: PropTypes.func,
    onRemoveMedia: PropTypes.func
  };

  static defaultProps = {
    onDrop() {},
    onMouseEnterMedia() {},
    onMouseLeaveMedia() {},
    onMoveMedia() {},
    onRemoveMedia() {}
  };

  constructor() {
    super();

    this.state = {
      dimensions: {
        width: -1,
        height: -1
      }
    };
  }

  get hasMedia() {
    const { media } = this.props;

    return Array.isArray(media) && media.length > 0;
  }

  get allowFeaturedMediaHover() {
    if (this.props.allowFeaturedMediaHover && this.props.featuredMedia) {
      return true;
    }

    return false;
  }

  get featuredMedia() {
    return this.props.featuredMedia || this.props.media[0];
  }

  handleDropClick = () => {
    this.dropzone && this.dropzone.open();
  };

  handleDrop = (files) => {
    if (files.length === 0) return;
    return this.props.onDrop(files);
  };

  renderAddItem() {
    if (this.props.editable) {
      return (
        <Components.Button
          className={{
            // Disable default button class names
            "flat": false,
            "btn": false,
            "btn-default": false,

            // Media gallery class names
            "gallery-image": true,
            "add": true
          }}
          tagName="div"
          onClick={this.handleDropClick}
        >
          <img
            alt=""
            className="img-responsive"
            src={"/resources/placeholder.gif"}
          />
          <div className="rui badge-container">
            <i className="fa fa-plus fa-2x" />
          </div>
        </Components.Button>
      );
    }

    return null;
  }

  renderFeaturedMedia() {
    const { editable, onMouseEnterMedia, onMoveMedia, onRemoveMedia } = this.props;
    const { width, height } = this.state.dimensions;

    const media = this.featuredMedia;
    if (!media) return <Components.MediaItem />;

    return (
      <Measure
        bounds
        onResize={(contentRect) => {
          this.setState({ dimensions: contentRect.bounds });
        }}
      >
        {({ measureRef }) =>
          <div ref={measureRef}>
            <Components.MediaItem
              editable={editable}
              mediaHeight={height}
              mediaWidth={width}
              onMouseEnter={onMouseEnterMedia}
              onMove={onMoveMedia}
              onRemoveMedia={onRemoveMedia}
              source={this.featuredMedia}
              zoomable
            />
          </div>
        }
      </Measure>
    );
  }

  renderMediaThumbnails() {
    const { editable, media: mediaList, onMouseEnterMedia, onMoveMedia, onRemoveMedia } = this.props;

    return (mediaList || []).map((media) => (
      <Components.MediaItem
        editable={editable}
        key={media._id}
        onMouseEnter={onMouseEnterMedia}
        onMove={onMoveMedia}
        onRemoveMedia={onRemoveMedia}
        size="small"
        source={media}
      />
    ));
  }

  renderMediaGalleryUploader() {
    const containerWidth = this.props.mediaGalleryWidth;
    const classes = { "admin-featuredImage": Reaction.hasAdminAccess() };

    return (
      <div className="rui media-gallery">
        <Dropzone
          className="rui gallery-drop-pane"
          disableClick
          multiple
          disablePreview
          onDrop={this.handleDrop}
          ref={(inst) => { this.dropzone = inst; }}
          accept="image/jpg, image/png, image/jpeg"
        >
          <div className="rui gallery">
            <div className={classnames(classes)} style={{ height: containerWidth }}>
              {this.featuredMedia ? this.renderFeaturedMedia() : this.renderAddItem()}
            </div>
            <div className="rui gallery-thumbnails">
              {!!this.hasMedia && this.renderMediaThumbnails()}
              {this.renderAddItem()}
            </div>
          </div>
        </Dropzone>
      </div>
    );
  }

  renderMediaGallery() {
    const containerWidth = this.props.mediaGalleryWidth;
    const classes = { "admin-featuredImage": Reaction.hasAdminAccess() };

    return (
      <div className="rui media-gallery">
        <div className="rui gallery">
          <div className={classnames(classes)} style={{ height: containerWidth }}>
            {this.renderFeaturedMedia()}
          </div>
          <div className="rui gallery-thumbnails">
            {this.renderMediaThumbnails()}
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.props.editable) {
      return this.renderMediaGalleryUploader();
    }

    return this.renderMediaGallery();
  }
}

export default MediaGallery;
