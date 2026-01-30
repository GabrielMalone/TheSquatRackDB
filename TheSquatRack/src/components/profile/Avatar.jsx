import './Avatar.css';
import { Icon } from '@iconify/react';
import { useState } from 'react';

export function Avatar({ src, size = 42 }) {
  const [imgError, setImgError] = useState(false);

  const validSrc =
    typeof src === "string" && src.length > 0 && !imgError;

  return (
    <div
      className="avatar"
      style={{ width: size, height: size }}
    >
      {validSrc ? (
        <img
          src={src}
          alt=""
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        <Icon
          icon="iconamoon:profile-circle-thin"
          width={size}
          height={size}
        />
      )}
    </div>
  );
}