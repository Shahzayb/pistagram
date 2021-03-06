import React from 'react';
import { Image } from 'cloudinary-react';

const CloudinaryImage = (props) => {
  return (
    <Image
      style={{ width: '100%' }}
      cloudName={process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}
      publicId={props.publicId}
      responsive
      alt={props.alt}
      crop="scale"
      width="auto"
      dpr="auto"
      quality="auto"
      fetchFormat="auto"
    ></Image>
  );
};

export default CloudinaryImage;
