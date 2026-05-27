import { useState, useEffect } from 'react';

export function useAvatar() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => {
    const saved = localStorage.getItem('rick_avatar_shared_data');
    return saved || null;
  });

  useEffect(() => {
    // Centralized async cloud avatar fetching
    const fetchCloudAvatar = async () => {
      try {
        const response = await fetch('/api/avatar');
        if (response.ok) {
          const data = await response.json();
          const cloudValue = data?.avatar;
          if (cloudValue && cloudValue !== 'RESET' && cloudValue.startsWith('data:image/')) {
            localStorage.setItem('rick_avatar_shared_data', cloudValue);
            setAvatarUrl(cloudValue);
          } else {
            localStorage.removeItem('rick_avatar_shared_data');
            setAvatarUrl(null);
          }
        }
      } catch (err) {
        console.warn("Could not load cloud avatar, using local cache or default:", err);
      }
    };

    fetchCloudAvatar();

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<string | null>;
      if (customEvent.detail) {
        setAvatarUrl(customEvent.detail);
      } else {
        setAvatarUrl(null);
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
      setAvatarUrl(null);
    }
  };

  return { avatarUrl, changeAvatar };
}

