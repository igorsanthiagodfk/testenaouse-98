import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import { SystemDataProvider } from "@/contexts/SystemDataContext";
import Index from "./pages/Index";
import Produtos from "./pages/Produtos";
import QuemSomos from "./pages/QuemSomos";
import Contato from "./pages/Contato";
import Quiz from "./pages/Quiz";
import Resultados from "./pages/Resultados";
import Solucoes from "./pages/Solucoes";
import SGSistemas from "./pages/solucoes/SGSistemas";
import ArpaSistemas from "./pages/solucoes/ArpaSistemas";
import HiperSistemas from "./pages/solucoes/HiperSistemas";
import RJKSistemas from "./pages/solucoes/RJKSistemas";
import CompararSolucoes from "./pages/CompararSolucoes";
import NotFound from "./pages/NotFound";

// Admin imports
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import ProdutosAdmin from "./pages/admin/ProdutosAdmin";
import SolucoesAdmin from "./pages/admin/SolucoesAdmin";
import DiagnosticoAdmin from "./pages/admin/DiagnosticoAdmin";
import RecomendacoesAdmin from "./pages/admin/RecomendacoesAdmin";
import ConfiguracoesAdmin from "./pages/admin/ConfiguracoesAdmin";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <HelmetProvider>
        <SystemDataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            
            <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/quem-somos" element={<QuemSomos />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/solucoes" element={<Solucoes />} />
          <Route path="/solucoes/sg-sistemas" element={<SGSistemas />} />
          <Route path="/solucoes/arpa-sistemas" element={<ArpaSistemas />} />
          <Route path="/solucoes/hiper-sistemas" element={<HiperSistemas />} />
          <Route path="/solucoes/rjk-sistemas" element={<RJKSistemas />} />
          <Route path="/comparar-solucoes" element={<CompararSolucoes />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="produtos" element={<ProdutosAdmin />} />
            <Route path="solucoes" element={<SolucoesAdmin />} />
            <Route path="diagnostico" element={<DiagnosticoAdmin />} />
            <Route path="recomendacoes" element={<RecomendacoesAdmin />} />
            <Route path="configuracoes" element={<ConfiguracoesAdmin />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
          </BrowserRouter>
          </TooltipProvider>
        </SystemDataProvider>
      </HelmetProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
