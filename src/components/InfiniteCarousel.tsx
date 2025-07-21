import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

interface Cliente {
  name: string;
  description: string;
  testimonial: string;
  logo: string;
}

interface InfiniteCarouselProps {
  clients: Cliente[];
  className?: string;
}

const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({ clients, className = '' }) => {
  // Duplicamos a lista para criar o efeito infinito
  const duplicatedClients = [...clients, ...clients];

  return (
    <div className={`overflow-visible ${className}`}>
      <div 
        className="flex gap-8 animate-infinite-scroll"
        style={{
          width: `${duplicatedClients.length * 320}px`,
          animation: 'infinite-scroll 20s linear infinite'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.animationPlayState = 'paused';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.animationPlayState = 'running';
        }}
      >
        {duplicatedClients.map((cliente, index) => (
          <Card 
            key={`${cliente.name}-${index}`}
            className="group hover:shadow-elegant transition-all duration-[1.5s] ease-out cursor-pointer border-border/50 hover:border-accent/50 text-center flex-shrink-0 w-80 hover:scale-105 relative hover:z-10"
          >
            <CardContent className="p-8">
              {/* Logo do cliente */}
              <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/10 transition-all duration-[1.5s] shadow-sm border border-muted">
                <img 
                  src={cliente.logo} 
                  alt={`Logo ${cliente.name}`}
                  className="w-16 h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-[1.5s]"
                />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {cliente.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {cliente.description}
              </p>
              {/* Testemunho expandido */}
              <div className="min-h-[80px] flex items-center justify-center">
                <p className="text-sm text-accent italic leading-relaxed">
                  {cliente.testimonial}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InfiniteCarousel;