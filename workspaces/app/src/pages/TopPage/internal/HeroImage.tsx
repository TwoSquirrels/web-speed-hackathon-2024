import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { IMAGE_SRC } from './ImageSrc';

const _Wrapper = styled.div`
  aspect-ratio: 16 / 9;
  width: 100%;
`;

const _Image = styled.img`
  display: inline-block;
  width: 100%;
`;

export const HeroImage: React.FC = () => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

  const updateImage = useCallback(({ height, src, width }: { height: number; src: string; width: number }) => {
    const image = imageRef.current;
    if (image == null) {
      return;
    }
    image.width = width;
    image.height = height;
    image.src = src;
  }, []);

  useEffect(() => {
    const image = imageRef.current;
    if (image == null) {
      return;
    }

    // width が 4096 / dpr の 16:9 の画像として描画する。
    const width = 4096 / window.devicePixelRatio;
    const height = (width / 16) * 9;
    const imageWidth = image.clientWidth;
    const imageHeight = (imageWidth / 16) * 9;

    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const drawWidth = width;
      const drawHeight = drawWidth / aspectRatio;
      const offsetY = (height - drawHeight) / 2;

      const content = canvas.getContext('2d');
      content?.clearRect(0, 0, width, height);
      content?.drawImage(img, 0, offsetY, drawWidth, drawHeight);

      updateImage({
        height: imageHeight,
        src: canvas.toDataURL(),
        width: imageWidth,
      });
    };
    img.src = IMAGE_SRC;
  }, [imageRef, updateImage]);

  useEffect(() => {
    const resize = () => {
      const image = imageRef.current;
      if (image == null) {
        return;
      }

      const width = image.clientWidth;
      const height = (image.clientWidth / 16) * 9;
      updateImage({
        height,
        src: canvasRef.current.toDataURL(),
        width,
      });
    };

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [updateImage]);

  return (
    <_Wrapper>
      <_Image ref={imageRef} alt="Cyber TOON" />
    </_Wrapper>
  );
};
