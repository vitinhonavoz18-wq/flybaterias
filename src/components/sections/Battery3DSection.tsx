import Battery3D, { type Hotspot } from "@/components/three/Battery3D";
import { Move3d } from "lucide-react";

const hotspots: Hotspot[] = [
  {
    id: "polos",
    title: "Polos positivo e negativo",
    text: "A posição dos polos (+ e −) muda de um veículo para outro. Instalar uma bateria com polaridade invertida pode danificar o sistema elétrico — por isso a aplicação correta importa.",
  },
  {
    id: "tampa",
    title: "Tampa selada",
    text: "A maioria das baterias automotivas atuais é selada e livre de manutenção: não é preciso completar água.",
  },
  {
    id: "rotulo",
    title: "Especificações no rótulo",
    text: "Tensão (12V), capacidade (Ah) e corrente de partida a frio (CCA) são os dados que definem a bateria certa para cada veículo.",
  },
  {
    id: "caixa",
    title: "Caixa reforçada",
    text: "Caixa em polipropileno, projetada para resistir a impactos, vibração e variações de temperatura do dia a dia.",
  },
];

export default function Battery3DSection() {
  return (
    <section aria-labelledby="b3d-title" className="relative overflow-hidden py-24 md:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 size-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(0,71,187,0.35),transparent)]" />
        <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(50%_50%_at_50%_50%,#000,transparent)]" />
      </div>
      <div className="container-fly grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p data-reveal className="eyebrow text-volt">Por dentro da energia</p>
          <h2 id="b3d-title" data-reveal style={{ ["--delay" as string]: "80ms" }} className="display mt-4 text-[clamp(2.1rem,4.6vw,3.6rem)]">
            Conheça cada detalhe da sua bateria.
          </h2>
          <p data-reveal style={{ ["--delay" as string]: "160ms" }} className="lead mt-5 max-w-md">
            Gire a bateria e toque nos pontos numerados para entender o que faz diferença na hora de escolher.
          </p>
          <ol className="mt-8 grid gap-4">
            {hotspots.map((h, i) => (
              <li key={h.id} data-reveal style={{ ["--delay" as string]: `${200 + i * 70}ms` }} className="flex gap-4 border-t border-white/8 pt-4">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-volt text-[0.75rem] font-bold text-ink">{i + 1}</span>
                <span>
                  <strong className="block font-semibold">{h.title}</strong>
                  <span className="text-[0.93rem] text-steel">{h.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div data-reveal className="relative">
          <Battery3D hotspots={hotspots} />
          <p className="mt-2 flex items-center justify-center gap-2 text-[0.8rem] text-steel">
            <Move3d className="size-4" /> Arraste para girar 360°
          </p>
        </div>
      </div>
    </section>
  );
}
