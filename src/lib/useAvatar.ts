import { useState, useEffect } from 'react';

export function useAvatar() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => {
    const saved = localStorage.getItem('rick_avatar_data');
    return saved || null;
  });

  useEffect(() => {
    // Centralized async cloud avatar fetching
    const fetchCloudAvatar = async () => {
      try {
        const response = await fetch('https://kvdb.io/6gQ8bW2uV7H3rPnGkWyZ/rickzinxx_avatar');
        if (response.ok) {
          const cloudValue = await response.text();
          if (cloudValue && cloudValue !== 'RESET' && cloudValue.startsWith('data:image/')) {
            localStorage.setItem('rick_avatar_data', cloudValue);
            setAvatarUrl(cloudValue);
          } else if (cloudValue === 'RESET') {
            localStorage.removeItem('rick_avatar_data');
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

