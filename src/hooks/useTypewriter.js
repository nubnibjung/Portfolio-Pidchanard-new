import { useEffect, useState } from 'react';

export function useTypewriter(words, startDelay = 1200) {
  const [text, setText] = useState(words[0] || '');

  useEffect(() => {
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId;

    const typeNextCharacter = () => {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        setText(currentWord.substring(0, charIndex--));

        if (charIndex < 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          timeoutId = window.setTimeout(typeNextCharacter, 400);
          return;
        }
      } else {
        setText(currentWord.substring(0, charIndex++));

        if (charIndex > currentWord.length) {
          isDeleting = true;
          timeoutId = window.setTimeout(typeNextCharacter, 1800);
          return;
        }
      }

      timeoutId = window.setTimeout(typeNextCharacter, isDeleting ? 55 : 100);
    };

    timeoutId = window.setTimeout(typeNextCharacter, startDelay);

    return () => window.clearTimeout(timeoutId);
  }, [words, startDelay]);

  return text;
}
