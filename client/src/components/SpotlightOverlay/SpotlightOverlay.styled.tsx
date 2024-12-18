import styled from '@emotion/styled';

export const StyledSpotlightOverlay = styled('div')<{
  targetRect: DOMRect | null;
}>(({ targetRect }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0, 0, 0, 0.5)',
  pointerEvents: 'auto',
  zIndex: targetRect ? 9999 : -1,
  opacity: targetRect ? 1 : 0,
  backdropFilter: 'blur(5px)',
  maskImage: targetRect
    ? `radial-gradient(circle at ${targetRect.left + targetRect.width / 2}px ${
        targetRect.top + targetRect.height / 2
      }px, transparent ${Math.max(targetRect.width, targetRect.height)}px, black ${Math.max(
        targetRect.width,
        targetRect.height
      )}px)`
    : 'none',
  WebkitMaskImage: targetRect
    ? `radial-gradient(circle at ${targetRect.left + targetRect.width / 2}px ${
        targetRect.top + targetRect.height / 2
      }px, transparent ${Math.max(targetRect.width, targetRect.height)}px, black ${Math.max(
        targetRect.width,
        targetRect.height
      )}px)`
    : 'none',
  transition: `mask-image 0.3s ease-in, -webkit-mask-image 0.3s ease-in`,
}));
