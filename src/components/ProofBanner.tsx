import React from 'react';
import { Shield, Users, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ProofBanner: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 rounded-lg p-4 mb-8"
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">
            Tecnologia Confiável
          </span>
        </div>
        
        <div className="hidden sm:block w-px h-6 bg-border" />
        
        <div className="flex items-center gap-2">
          <div className="p-2 bg-accent/10 rounded-full">
            <Users className="h-5 w-5 text-accent" />
          </div>
          <span className="text-sm font-medium text-foreground">
            Mais de 500 empresas atendidas
          </span>
        </div>
        
        <div className="hidden sm:block w-px h-6 bg-border" />
        
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-500/10 rounded-full">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <span className="text-sm font-medium text-foreground">
            Suporte especializado garantido
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProofBanner;