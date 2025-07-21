import React, { useState, useEffect } from 'react';

interface AnimatedTitleProps {
  words: string[];
  className?: string;
  staggerDelay?: number;
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ 
  words, 
  className = '',
  staggerDelay = 300
}) => {
  const [visibleWords, setVisibleWords] = useState<boolean[]>(
    new Array(words.length).fill(false)
  );

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    
    words.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setVisibleWords(prev => {
          const newVisible = [...prev];
          newVisible[index] = true;
          return newVisible;
        });
      }, index * staggerDelay);
      
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [words, staggerDelay]);

  return (
    <div className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className={`inline-block mr-2 ${
            visibleWords[index] 
              ? 'animate-word-appear' 
              : 'opacity-0'
          }`}
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};

export default AnimatedTitle;