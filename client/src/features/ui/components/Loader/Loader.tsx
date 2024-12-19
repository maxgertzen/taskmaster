import { FC, useEffect, useState } from 'react';

import { useThemeStore } from '@/shared/store/themeStore';

import { Title } from '..';

import { StyledLoaderContainer, StyledLoaderLogo } from './Loader.styled';

interface LoaderProps {
  paddingTop?: number;
}

export const Loader: FC<LoaderProps> = ({ paddingTop = 0 }) => {
  const theme = useThemeStore((state) => state.theme);

  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const loadGif = async () => {
      if (theme === 'dark') {
        const darkModeLoader = await import(
          '@/shared/assets/animations/loader-dm.gif'
        );
        setSrc(darkModeLoader.default);
      } else {
        const lightModeLoader = await import(
          '@/shared/assets/animations/loader-lm.gif'
        );
        setSrc(lightModeLoader.default);
      }
    };

    loadGif();
  }, [theme]);

  if (!src) return <Title variant='h4'>Loading...</Title>;

  return (
    <StyledLoaderContainer paddingTop={paddingTop}>
      <Title variant='h6'>Calculating...</Title>
      <StyledLoaderLogo src={src} alt='Loading' />
    </StyledLoaderContainer>
  );
};
