import { useEffect, useState } from "react";
import { getSolutionBySlug } from "@/data/database";
import DynamicSolutionPage from "@/components/DynamicSolutionPage";
import { Navigate } from "react-router-dom";

const HiperSistemas = () => {
  console.log('[SolucoesSlug] hiper-sistemas');
  
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSolution = () => {
      const found = getSolutionBySlug("/solucoes/hiper-sistemas");
      setSolution(found);
      setLoading(false);
    };

    loadSolution();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!solution) {
    return <Navigate to="/solucoes" replace />;
  }

  return <DynamicSolutionPage solution={solution} />;
};

export default HiperSistemas;