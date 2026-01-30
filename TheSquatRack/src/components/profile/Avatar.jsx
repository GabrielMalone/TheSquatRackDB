import './Avatar.css';
import { Icon } from '@iconify/react';
import { useState } from 'react';

export function Avatar({ src, size = 42 }) {

  const [imgError, setImgError] = useState(false);

  const validSrc =
    typeof src === "string" && src.length > 0 && !imgError;

  return (
    validSrc ? 
    <div
      className="avatar"
      style={{ width: size, height: size }}
    >
      <img
        className='avatarPic'
        src={src}
        alt=""
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    </div>
    :
    <div 
      className='defaultAvatar'
      style={{ width: size, height: size }}
    >
      <Icon
        icon="iconamoon:profile-circle-thin"
      />
    </div>
  );
}