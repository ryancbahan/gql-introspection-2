import React, {useRef, useEffect} from 'react';

interface Props {
  ref: React.RefObject<HTMLDivElement>;
  selectedIndex: number;
}
export function useConsistentScrollPosition({ref, selectedIndex}: Props) {
  const userInitiated = useRef<boolean>(false);
  const prevDistanceFromTopOfScreen = useRef<number>(0);

  useEffect(() => {
    if (userInitiated.current) {
      const newScrollPosition = distanceFromTopOfScreen(ref.current);

      if (prevDistanceFromTopOfScreen.current !== newScrollPosition) {
        const diff = newScrollPosition - prevDistanceFromTopOfScreen.current;
        window.scrollTo(window.scrollX, window.scrollY + diff);
      }
    }
    userInitiated.current = false;
  }, [ref, selectedIndex]);

  function updateScrollPosition() {
    prevDistanceFromTopOfScreen.current = distanceFromTopOfScreen(ref.current);
    userInitiated.current = true;
  }

  return {updateScrollPosition};
}

function distanceFromTopOfScreen(element: HTMLDivElement | null): number {
  return element
    ? element.getBoundingClientRect().top + document.body.scrollTop
    : 0;
}
