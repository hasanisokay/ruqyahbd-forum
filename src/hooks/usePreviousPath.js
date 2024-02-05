// usePreviousPath.js
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const usePreviousPath = () => {
  const currentPath = usePathname();
  const previousPathRef = useRef();

  useEffect(() => {
    previousPathRef.current = currentPath;
  }, [currentPath]);

  return previousPathRef.current;
};

export default usePreviousPath;
