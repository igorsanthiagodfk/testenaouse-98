import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompactDiagnosticCTA: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-muted/20 via-background to-muted/20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F59E0B' fill-opacity='0.3'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '20px 20px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="bg-gradient-to-br from-card/90 to-background/50 rounded-2xl p-8 border border-border/50 backdrop-blur-sm shadow-xl relative overflow-hidden">
            {/* Efeito de brilho sutil */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-accent/10 rounded-full blur-3xl -translate-y-20" />
            
            <div className="relative z-10 space-y-6">
              {/* Ícone de destaque */}
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center shadow-lg shadow-accent/30">
                  <Sparkles className="w-8 h-8 text-accent-foreground animate-pulse" />
                </div>
              </motion.div>

              {/* Título principal */}
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-2xl lg:text-3xl font-bold text-foreground"
              >
                Não tem certeza por onde{" "}
                <span className="text-accent bg-gradient-accent bg-clip-text text-transparent">
                  começar?
                </span>
              </motion.h3>

              {/* Subtítulo */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              >
                Deixe que nosso diagnóstico inteligente encontre a{" "}
                <span className="font-semibold text-accent">solução perfeita</span> para você.
              </motion.p>

              {/* Botão principal */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex justify-center"
              >
                <Link to="/quiz">
                  <Button 
                    variant="cta" 
                    size="lg" 
                    className="group relative overflow-hidden shadow-xl shadow-accent/30 hover:shadow-2xl hover:shadow-accent/40 transition-all duration-500 px-8 py-4 text-lg font-semibold"
                  >
                    <span className="relative z-10 flex items-center">
                      Descobrir Minha Solução Ideal
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    
                    {/* Efeito de brilho no hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    
                    {/* Background animado */}
                    <div className="absolute inset-0 bg-accent/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Button>
                </Link>
              </motion.div>

              {/* Microcopy com garantias */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center justify-center space-x-6 text-sm text-muted-foreground"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium">Rápido</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="font-medium">Gratuito</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  <span className="font-medium">Sem Compromisso</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CompactDiagnosticCTA;