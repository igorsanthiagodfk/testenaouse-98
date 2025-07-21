import React, { useState } from 'react';
import { CheckCircle, LucideIcon } from 'lucide-react';

interface InteractiveValueCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  expandedDescription: string;
  index: number;
}

const InteractiveValueCard: React.FC<InteractiveValueCardProps> = ({
  icon: Icon,
  title,
  description,
  expandedDescription,
  index
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      {/* Div principal unificado - responsável por TODA a animação */}
      <div 
        className={`
          relative cursor-pointer flex items-center space-x-4 p-4 
          bg-primary-foreground/5 backdrop-blur-sm border 
          transition-all duration-[1.5s] ease-out z-10
          ${isExpanded 
            ? 'scale-105 rounded-2xl border-accent/40 shadow-glow z-20' 
            : 'scale-100 rounded-xl border-accent/20'
          }
        `}
        style={{
          transitionDelay: `${index * 0.2}s`,
        }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Ícone à esquerda */}
        <div 
          className={`
            w-12 h-12 bg-accent rounded-lg flex items-center justify-center 
            transition-transform duration-[1.5s] ease-out
            ${isExpanded ? 'scale-110' : 'scale-100'}
          `}
          style={{
            transitionDelay: `${index * 0.2}s`,
          }}
        >
          <Icon className="w-6 h-6 text-accent-foreground" />
        </div>
        
        {/* Conteúdo de texto */}
        <div className="flex-1">
          <div className="text-primary-foreground font-semibold text-lg">{title}</div>
          <div 
            className="text-primary-foreground/60 text-sm transition-all duration-[1.5s] ease-out"
            style={{
              transitionDelay: `${index * 0.2}s`,
            }}
          >
            {isExpanded ? expandedDescription : description}
          </div>
        </div>
        
        {/* Ícone de check à direita */}
        <CheckCircle 
          className={`
            w-6 h-6 text-accent transition-transform duration-[1.5s] ease-out
            ${isExpanded ? 'scale-110' : 'scale-100'}
          `}
          style={{
            transitionDelay: `${index * 0.2}s`,
          }}
        />
        
        {/* Badge flutuante */}
        <div 
          className={`
            absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full 
            flex items-center justify-center transition-all duration-[1.5s] ease-out
            ${isExpanded ? 'scale-110 animate-pulse-accent' : 'scale-100'}
          `}
          style={{
            transitionDelay: `${index * 0.2}s`,
          }}
        >
          <span className="text-accent-foreground font-bold text-xs">✓</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveValueCard;