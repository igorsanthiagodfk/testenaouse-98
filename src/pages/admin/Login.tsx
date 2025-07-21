import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { googleSheetsService } from "@/services/googleSheetsService";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('[Login] Tentando autenticar:', email);
      
      // Busca dados dos admin_users da planilha
      const adminUsers = await googleSheetsService.fetchTableData('admin_users', true);
      console.log('[Login] Admin users encontrados:', adminUsers);
      
      // Busca o usuário pelo email
      const user = adminUsers.find(u => 
        u.email?.toLowerCase() === email.toLowerCase() && 
        u.ativo?.toLowerCase() === 'true'
      );

      if (!user) {
        toast({
          title: "Erro de autenticação",
          description: "Usuário não encontrado ou inativo.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Verifica a senha (simplificado para desenvolvimento)
      const isValidPassword = user.password === password || 
                             user.password_hash === password ||
                             password === 'admin123'; // Fallback para desenvolvimento

      if (isValidPassword) {
        localStorage.setItem("admin_authenticated", "true");
        localStorage.setItem("admin_email", email);
        localStorage.setItem("admin_user", JSON.stringify({
          id: user.id,
          email: user.email,
          role: user.role
        }));
        
        toast({
          title: "Login realizado com sucesso",
          description: "Redirecionando para o painel...",
        });
        
        navigate("/admin/dashboard");
      } else {
        toast({
          title: "Erro de autenticação",
          description: "Senha incorreta.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('[Login] Erro na autenticação:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao Google Sheets. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Painel Administrativo</CardTitle>
          <CardDescription>
            Faça login para acessar o sistema de gerenciamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          <div className="mt-6 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Sistema conectado ao Google Sheets</strong><br />
              Use as credenciais cadastradas na planilha admin_users.csv<br />
              Dados sincronizados em tempo real
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}