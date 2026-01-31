import './Avatar.css';
import { Icon } from '@iconify/react';
import { useState} from 'react';

export function Avatar({ src, size = 42, online = false, isMe = false }) {

  const [imgError, setImgError] = useState(false);
  let className = online ? "avatar avatarOnline" : "avatar avatarOffline";
  const validSrc =
    typeof src === "string" && src.length > 0 && !imgError;
  isMe ?  className += " avatarMe" : null;

  return (

    validSrc ? 

    <div
      className={className}
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