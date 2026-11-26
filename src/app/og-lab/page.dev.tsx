/* eslint-disable @next/next/no-img-element */
/** Composição da imagem de compartilhamento (somente desenvolvimento). Gerada em public/og-image.jpg. */
export default function OgLab() {
  return (
    <div style={{ width: 1200, height: 630 }} className="relative overflow-hidden bg-abyss">
      <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_75%_45%,#0b3a99_0%,rgba(6,20,47,0)_65%)]" />
      <div className="grid-lines absolute inset-0 opacity-70 [mask-image:radial-gradient(60%_70%_at_75%_50%,#000,transparent)]" />
      <div className="absolute bottom-[70px] left-[640px] h-[120px] w-[520px] rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,208,0,0.45),transparent)] blur-xl" />
      <img src="/renders/battery-hero.webp" alt="" className="absolute bottom-[60px] right-[40px] w-[560px]" />
      <div className="absolute left-[64px] top-[60px] w-[600px]">
        <img src="/brand/flybaterias-logo-dark.webp" alt="" className="h-[96px] w-auto" />
        <h1 className="display mt-10 text-[64px]">
          Seu carro não pode parar. <span className="text-volt">Sua energia também não.</span>
        </h1>
        <p className="mt-6 text-[24px] text-steel">Baterias automotivas em Salvador e região</p>
      </div>
    </div>
  );
}
