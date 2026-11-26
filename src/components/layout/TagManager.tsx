import { tracking } from "@/config/tracking";

/**
 * Consent Mode v2: tudo começa NEGADO. Se o visitante já escolheu antes,
 * a escolha é aplicada antes do GTM carregar. O GTM só é carregado se
 * NEXT_PUBLIC_GTM_ID estiver configurado.
 */
export function ConsentDefaults() {
  const js = `
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',true);
try{var c=JSON.parse(localStorage.getItem('${tracking.consentStorageKey}')||'null');if(c){gtag('consent','update',{analytics_storage:c.analytics?'granted':'denied',ad_storage:c.marketing?'granted':'denied',ad_user_data:c.marketing?'granted':'denied',ad_personalization:c.marketing?'granted':'denied'});}}catch(e){}
document.documentElement.classList.add('js');`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}

export function GtmScript() {
  if (!tracking.gtmId) return null;
  const id = tracking.gtmId.replace(/[^A-Z0-9-]/gi, "");
  const js = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}

export function GtmNoScript() {
  if (!tracking.gtmId) return null;
  const id = tracking.gtmId.replace(/[^A-Z0-9-]/gi, "");
  return (
    <noscript>
      <iframe src={`https://www.googletagmanager.com/ns.html?id=${id}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="GTM" />
    </noscript>
  );
}
