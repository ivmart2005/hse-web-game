import { useRef, useEffect, useState } from 'react';
import { ASSET_PATHS, ANIMATION_CONFIG } from '../constants';

export const useSpriteManager = () => {
  const sprites = useRef<Map<string, HTMLImageElement>>(new Map());
  const [loaded, setLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const loadSprites = async () => {
      const spriteUrls = [
        { key: 'static', url: ASSET_PATHS.CHARACTER.STATIC },
        ...ANIMATION_CONFIG.WALK.FRAMES.map(frame => ({
          key: `frame_${frame}`,
          url: ASSET_PATHS.CHARACTER.FRAME(frame)
        }))
      ];

      let loadedCount = 0;
      
      await Promise.all(
        spriteUrls.map(({ key, url }) => 
          new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              sprites.current.set(key, img);
              loadedCount++;
              setLoadingProgress((loadedCount / spriteUrls.length) * 100);
              resolve(null);
            };
            img.onerror = reject;
            img.src = url;
          })
        )
      );

      setLoaded(true);
    };

    loadSprites();
  }, []);

  const getSprite = (key: string): HTMLImageElement | undefined => {
    return sprites.current.get(key);
  };

  return { 
    loaded,
    loadingProgress,
    getSprite,
    getStaticSprite: () => getSprite('static'),
    getWalkSprite: (frame: number) => getSprite(`frame_${frame}`)
  };
};