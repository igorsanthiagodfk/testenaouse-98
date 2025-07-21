import { useEffect } from 'react';

// Configuração do Google Analytics
const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // Substitua pelo seu ID do GA4

// Configuração do Meta Pixel
const META_PIXEL_ID = 'XXXXXXXXXX'; // Substitua pelo seu ID do Meta Pixel

// Eventos personalizados
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  console.log('[Analytics] Evento rastreado:', eventName, parameters);
  
  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, {
      event_category: 'engagement',
      event_label: eventName,
      ...parameters
    });
  }
  
  // Meta Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, parameters);
  }
};

// Hook para capturar UTMs
export const useUTMTracking = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const utmData = {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_content: urlParams.get('utm_content'),
      utm_term: urlParams.get('utm_term'),
      timestamp: new Date().toISOString()
    };
    
    // Armazenar UTMs no localStorage
    if (Object.values(utmData).some(value => value !== null)) {
      localStorage.setItem('utm_data', JSON.stringify(utmData));
      console.log('[Analytics] UTM capturado:', utmData);
    }
  }, []);
};

// Função para obter dados UTM armazenados
export const getStoredUTM = () => {
  try {
    const stored = localStorage.getItem('utm_data');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// Componente de scripts de rastreamento
export const AnalyticsScripts = () => {
  return (
    <>
      {/* Google Analytics */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `,
        }}
      />
      
      {/* Meta Pixel */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
    </>
  );
};