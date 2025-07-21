import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import { seoData } from "@/data/constants";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ArrowRight,
  CheckCircle,
  Send
} from "lucide-react";

const Contato = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({
      ...prev,
      telefone: formatted
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envio
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Entraremos em contato em breve.",
      });
      
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        mensagem: ''
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente ou entre em contato diretamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO {...seoData.contato} />

      <Header />
      
      {/* Header */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-6">
            Entre em Contato
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Estamos prontos para ajudar você a transformar a gestão do seu negócio. 
            Fale conosco agora mesmo!
          </p>
        </div>
      </section>

      {/* Contato Principal */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Formulário */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Envie sua Mensagem</CardTitle>
                <p className="text-muted-foreground">
                  Preencha o formulário e nossa equipe entrará em contato rapidamente
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome *</Label>
                      <Input
                        id="nome"
                        name="nome"
                        type="text"
                        placeholder="Seu nome completo"
                        value={formData.nome}
                        onChange={handleInputChange}
                        required
                        aria-describedby="nome-help"
                      />
                      <span id="nome-help" className="sr-only">Campo obrigatório para identificação</span>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        aria-describedby="email-help"
                      />
                      <span id="email-help" className="sr-only">Endereço de email válido para contato</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      type="tel"
                      placeholder="(61) 99999-9999"
                      value={formData.telefone}
                      onChange={handlePhoneChange}
                      required
                      aria-describedby="telefone-help"
                    />
                    <span id="telefone-help" className="sr-only">Número de telefone ou WhatsApp para contato</span>
                  </div>
                  
                  <div>
                    <Label htmlFor="mensagem">Mensagem *</Label>
                    <Textarea
                      id="mensagem"
                      name="mensagem"
                      placeholder="Descreva suas necessidades ou dúvidas..."
                      value={formData.mensagem}
                      onChange={handleInputChange}
                      rows={4}
                      required
                      aria-describedby="mensagem-help"
                    />
                    <span id="mensagem-help" className="sr-only">Descreva detalhadamente sua necessidade ou dúvida</span>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                    variant="cta"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Informações de Contato */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Telefone</h3>
                      <p className="text-muted-foreground">(61) 3551-6827</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Email</h3>
                      <p className="text-muted-foreground">istigestao@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Endereço</h3>
                      <p className="text-muted-foreground">
                        Brasília - DF<br />
                        Atendimento presencial com agendamento
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Horário de Atendimento</h3>
                      <p className="text-muted-foreground">
                        Segunda à Sexta: 8h às 18h<br />
                        Sábado: 8h às 12h
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Whatsapp Direto */}
              <Card className="bg-gradient-accent/10 border-accent/20">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center mx-auto">
                      <Phone className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground">Atendimento Imediato</h3>
                    <p className="text-muted-foreground">
                      Para atendimento mais rápido, fale conosco diretamente via WhatsApp
                    </p>
                    <Button 
                      variant="cta" 
                      size="lg"
                      onClick={() => window.open('https://wa.me/556135516827', '_blank')}
                    >
                      Falar no WhatsApp
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Por que escolher a I.S.T.I */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Por que escolher a I.S.T.I?
            </h2>
            <p className="text-xl text-muted-foreground">
              Mais de 120 negócios confiam em nossa expertise
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Atendimento Personalizado</h3>
              <p className="text-muted-foreground">
                Cada cliente recebe uma solução específica para suas necessidades
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Suporte Técnico Real</h3>
              <p className="text-muted-foreground">
                Sem chatbots ou robôs, apenas pessoas qualificadas para ajudar
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Experiência Comprovada</h3>
              <p className="text-muted-foreground">
                Mais de 6 anos no mercado de automação comercial em Brasília
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-6">
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Agende uma conversa gratuita e descubra como podemos otimizar a gestão do seu comércio.
          </p>
            <Button 
              variant="cta" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => window.open('https://wa.me/556135516827', '_blank')}
            >
              Agendar Conversa Gratuita
              <ArrowRight className="w-5 h-5" />
            </Button>
        </div>
      </section>
    </div>
  );
};

export default Contato;