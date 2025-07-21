import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Globe, Phone, Mail, Facebook, Instagram, Linkedin, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Dados mockados das configurações
const mockConfig = {
  nomeEmpresa: "I.S.T.I | TECNOLOGIA",
  telefone: "(11) 99999-9999",
  email: "contato@isti.com.br",
  endereco: "Rua Example, 123 - São Paulo, SP",
  sobre: "Empresa especializada em soluções tecnológicas para automação comercial, oferecendo sistemas de gestão e equipamentos de ponta para diversos segmentos.",
  redeSociais: {
    facebook: "https://facebook.com/isti",
    instagram: "https://instagram.com/isti",
    linkedin: "https://linkedin.com/company/isti"
  },
  horarioFuncionamento: "Segunda a Sexta: 8h às 18h\nSábado: 8h às 12h",
  whatsapp: "(11) 99999-9999"
};

export default function ConfiguracoesAdmin() {
  const [config, setConfig] = useState(mockConfig);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulação de salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Configurações salvas",
      description: "As alterações foram aplicadas com sucesso.",
    });

    setIsSaving(false);
  };

  const updateConfig = (field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateRedeSocial = (platform: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      redeSociais: {
        ...prev.redeSociais,
        [platform]: value
      }
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configurações Gerais</h1>
        <p className="text-muted-foreground">
          Gerencie as informações globais que aparecem em todo o site
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Informações da Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Informações da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
                <Input
                  id="nomeEmpresa"
                  value={config.nomeEmpresa}
                  onChange={(e) => updateConfig("nomeEmpresa", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail Principal</Label>
                <Input
                  id="email"
                  type="email"
                  value={config.email}
                  onChange={(e) => updateConfig("email", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço Completo</Label>
              <Input
                id="endereco"
                value={config.endereco}
                onChange={(e) => updateConfig("endereco", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sobre">Sobre a Empresa</Label>
              <Textarea
                id="sobre"
                rows={3}
                value={config.sobre}
                onChange={(e) => updateConfig("sobre", e.target.value)}
                placeholder="Descrição da empresa..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Informações de Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone Principal</Label>
                <Input
                  id="telefone"
                  value={config.telefone}
                  onChange={(e) => updateConfig("telefone", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={config.whatsapp}
                  onChange={(e) => updateConfig("whatsapp", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="horario">Horário de Funcionamento</Label>
              <Textarea
                id="horario"
                rows={3}
                value={config.horarioFuncionamento}
                onChange={(e) => updateConfig("horarioFuncionamento", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Redes Sociais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Redes Sociais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Facebook className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={config.redeSociais.facebook}
                    onChange={(e) => updateRedeSocial("facebook", e.target.value)}
                    placeholder="https://facebook.com/sua-empresa"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Instagram className="w-5 h-5 text-pink-600" />
                <div className="flex-1">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={config.redeSociais.instagram}
                    onChange={(e) => updateRedeSocial("instagram", e.target.value)}
                    placeholder="https://instagram.com/sua-empresa"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Linkedin className="w-5 h-5 text-blue-700" />
                <div className="flex-1">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={config.redeSociais.linkedin}
                    onChange={(e) => updateRedeSocial("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/company/sua-empresa"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botão Salvar */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving} className="min-w-[120px]">
            {isSaving ? (
              <>Salvando...</>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}