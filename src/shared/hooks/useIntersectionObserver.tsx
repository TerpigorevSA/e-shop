import { useEffect } from 'react';

// function useIntersectionObserve<T extends (HTMLElement|null)>(
function useIntersectionObserve(
  // ref: React.MutableRefObject<T>,
  ref: React.RefObject<HTMLElement | null>,
  onIntersect: () => void,
  options?: IntersectionObserverInit,
  oneObserve = true,
) {
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onIntersect();
        if (oneObserve) {
          ref.current = null;
        }
      }
    }, options);

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options, ref, oneObserve, onIntersect]);
}

export default useIntersectionObserve;
