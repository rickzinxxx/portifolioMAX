import { useState, useEffect } from 'react';
// @ts-ignore
import defaultAvatar from '../assets/images/rick_avatar_1779805140522.png';

export function useAvatar() {
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    const saved = localStorage.getItem('rick_avatar_data');
    return saved || defaultAvatar;
  });

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<string | null>;
      if (customEvent.detail) {
        setAvatarUrl(customEvent.detail);
      } else {
        setAvatarUrl(defaultAvatar);
      }
    };

    window.addEventListener('rick_avatar_updated', handleUpdate);
    return () => {
      window.removeEventListener('rick_avatar_updated', handleUpdate);
    };
  }, []);

  const changeAvatar = (newBase64: string | null) => {
    if (newBase64) {
      setAvatarUrl(newBase64);
    } else {
      setAvatarUrl(defaultAvatar);
    }
  };

  return { avatarUrl, changeAvatar };
}
