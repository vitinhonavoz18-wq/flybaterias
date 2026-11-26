import { ClipboardCheck, Gauge, MessageCircle } from "lucide-react";
import BatterySelector from "./BatterySelector";

export default function SelectorSection() {
  const points = [
    { icon: Gauge, title: "Leva menos de 1 minuto", text: "Toque nas opções — sem cadastro." },
    { icon: ClipboardCheck, title: "Aplicação conferida", text: "Um especialista confirma a bateria correta antes da compra." },
    { icon: MessageCircle, title: "Resposta no WhatsApp", text: "Receba as opções disponíveis e os valores." },
  ];
  return (
    <section id="seletor" aria-labelledby="seletor-title" className="relative scroll-mt-20 py-24 md:py-32">
      <div className="container-fly grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28">
          <p data-reveal className="eyebrow text-volt">Seletor inteligente</p>
          <h2 id="seletor-title" data-reveal style={{ ["--delay" as string]: "80ms" }} className="display mt-4 text-[clamp(2.1rem,4.6vw,3.6rem)]">
            Qual é a bateria ideal para seu carro?
          </h2>
          <p data-reveal style={{ ["--delay" as string]: "160ms" }} className="lead mt-5 max-w-md">
            Bateria não é tudo igual. Informe os dados do seu veículo e a FlyBaterias indica a opção certa — sem achismo.
          </p>
          <ul className="mt-10 grid gap-6">
            {points.map(({ icon: Icon, title, text }, i) => (
              <li key={title} data-reveal style={{ ["--delay" as string]: `${200 + i * 80}ms` }} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-volt">
                  <Icon className="size-5" />
                </span>
                <span>
                  <strong className="block font-semibold">{title}</strong>
                  <span className="text-[0.95rem] text-steel">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal style={{ ["--delay" as string]: "120ms" }}>
          <BatterySelector />
        </div>
      </div>
    </section>
  );
}
