import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";

export function useBackSlash(): [
  RefObject<any>,
  boolean,
  Dispatch<SetStateAction<boolean>>
] {
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<any>(null);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (!searchInputRef.current) return;

      // Si el input está enfocado, no prevenimos la acción (dejamos que el usuario escriba '/')
      if (event.key === '/' && document.activeElement !== searchInputRef.current) {
        event.preventDefault();  // Prevenimos la acción solo si el campo no está enfocado
        searchInputRef.current.focus();  // Ponemos el foco en el input
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return [searchInputRef, isFocused, setIsFocused]
}