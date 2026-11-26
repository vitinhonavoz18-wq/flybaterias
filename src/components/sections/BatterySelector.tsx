"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Pencil, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { vehicleMakes, engineOptions, yearOptions } from "@/config/vehicles";
import { vehicleMessage, whatsappUrl, type VehicleQuery } from "@/lib/whatsapp";
import { findCompatibleBatteries } from "@/lib/applications";
import { track } from "@/lib/analytics";
import { WhatsAppIcon } from "@/components/ui/icons";

type StepId = "make" | "model" | "year" | "engine" | "startStop" | "district" | "result";
const STEPS: { id: Exclude<StepId, "result">; label: string; title: string }[] = [
  { id: "make", label: "Marca", title: "Qual é a marca do seu veículo?" },
  { id: "model", label: "Modelo", title: "Qual é o modelo?" },
  { id: "year", label: "Ano", title: "Qual é o ano do veículo?" },
  { id: "engine", label: "Motor", title: "Qual é a motorização?" },
  { id: "startStop", label: "Start-Stop", title: "O carro tem sistema Start-Stop?" },
  { id: "district", label: "Bairro", title: "Em qual bairro você está?" },
];

const EMPTY: VehicleQuery = { make: "", model: "", year: "", engine: "", startStop: "", district: "" };
const NAO_SEI = "Não sei";

export default function BatterySelector() {
  const [v, setV] = useState<VehicleQuery>(EMPTY);
  const [step, setStep] = useState<StepId>("make");
  const [otherMake, setOtherMake] = useState(false);
  const started = useRef(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const prevStep = useRef<StepId>(step);

  const idx = step === "result" ? STEPS.length : STEPS.findIndex((s) => s.id === step);
  const current = STEPS[idx];
  const progress = Math.round((idx / STEPS.length) * 100);
  const models = useMemo(() => vehicleMakes.find((m) => m.name === v.make)?.models ?? [], [v.make]);
  const matches = useMemo(() => (step === "result" ? findCompatibleBatteries(v) : []), [step, v]);

  useEffect(() => {
    if (prevStep.current === step) return;
    prevStep.current = step;
    titleRef.current?.focus({ preventScroll: true });
    // No celular, mantém o topo do seletor visível ao trocar de etapa
    const top = panelRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) window.scrollBy({ top: top - 88, behavior: "smooth" });
  }, [step]);

  function begin() {
    if (!started.current) {
      started.current = true;
      track("selector_start");
    }
  }

  function go(next: StepId) {
    if (step !== "result") track("selector_step", { step });
    if (next === "result") track("selector_complete", { vehicle_make: v.make, vehicle_year: v.year });
    setStep(next);
  }

  function nextOf(s: StepId): StepId {
    const i = STEPS.findIndex((x) => x.id === s);
    return i < STEPS.length - 1 ? STEPS[i + 1].id : "result";
  }

  function choose<K extends keyof VehicleQuery>(key: K, value: string, autoAdvance = true) {
    begin();
    setV((prev) => ({ ...prev, [key]: value, ...(key === "make" && prev.make !== value ? { model: "" } : {}) }));
    if (autoAdvance) window.setTimeout(() => go(nextOf(key as StepId)), 220);
  }

  function back() {
    if (step === "result") return setStep("district");
    if (idx > 0) setStep(STEPS[idx - 1].id);
  }

  function reset() {
    setV(EMPTY);
    setOtherMake(false);
    setStep("make");
  }

  const canNext = step === "result" ? false : step === "district" ? true : Boolean(v[step as keyof VehicleQuery]);
  const message = vehicleMessage(v);

  return (
    <div ref={panelRef} className="panel relative overflow-hidden p-5 sm:p-8" aria-live="polite">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-royal/30 blur-3xl" />

      {/* Progresso */}
      <div className="relative">
        <div className="flex items-center justify-between text-[0.78rem] text-steel">
          <span>
            {step === "result" ? "Pronto!" : `Etapa ${idx + 1} de ${STEPS.length}`}
          </span>
          <span className="font-semibold text-white">{progress}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="Progresso do seletor">
          <div className="h-full rounded-full bg-gradient-to-r from-royal-2 to-volt transition-[width] duration-700 ease-[var(--ease-out-expo)]" style={{ width: `${Math.max(progress, 4)}%` }} />
        </div>
        <ol className="mt-4 hidden grid-cols-6 gap-2 sm:grid" aria-label="Etapas">
          {STEPS.map((s, i) => {
            const done = i < idx;
            const value = v[s.id as keyof VehicleQuery];
            return (
              <li key={s.id}>
                <button
                  type="button"
                  disabled={!done}
                  onClick={() => setStep(s.id)}
                  className={`w-full truncate rounded-lg px-2 py-1.5 text-left text-[0.72rem] transition-colors ${
                    i === idx ? "bg-white/10 text-white" : done ? "text-white/80 hover:bg-white/5" : "text-white/35"
                  }`}
                  aria-current={i === idx ? "step" : undefined}
                >
                  <span className="block font-semibold">{s.label}</span>
                  <span className="block truncate text-[0.7rem] text-steel">{done ? value || "—" : " "}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Conteúdo da etapa */}
      <div key={step} className="step-in relative mt-6 min-h-[340px]">
        {step !== "result" && current && (
          <h3 ref={titleRef} tabIndex={-1} className="display text-[1.55rem] focus:outline-none sm:text-[1.9rem]">
            {current.title}
          </h3>
        )}

        {step === "make" && (
          <div className="mt-5">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {vehicleMakes.map((m) => (
                <button key={m.name} type="button" className="chip !px-1 max-sm:!text-[0.86rem]" aria-pressed={v.make === m.name} onClick={() => (setOtherMake(false), choose("make", m.name))}>
                  {m.name}
                </button>
              ))}
              <button type="button" className="chip col-span-3 sm:col-span-1" aria-pressed={otherMake} onClick={() => (begin(), setOtherMake(true), setV((p) => ({ ...p, make: "" })))}>
                Outra marca
              </button>
            </div>
            {otherMake && (
              <form
                className="mt-4 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (v.make.trim()) go("model");
                }}
              >
                <label className="sr-only" htmlFor="sel-make">
                  Marca do veículo
                </label>
                <input id="sel-make" className="field" autoFocus placeholder="Digite a marca" value={v.make} maxLength={40} onChange={(e) => setV({ ...v, make: e.target.value })} />
              </form>
            )}
          </div>
        )}

        {step === "model" && (
          <form
            className="mt-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (v.model.trim()) go("year");
            }}
          >
            <label className="text-sm text-steel" htmlFor="sel-model">
              Digite ou escolha uma sugestão {v.make && <>da {v.make}</>}
            </label>
            <input
              id="sel-model"
              className="field mt-2"
              placeholder="Ex.: Onix, HB20, Argo…"
              value={v.model}
              maxLength={60}
              autoComplete="off"
              onChange={(e) => (begin(), setV({ ...v, model: e.target.value }))}
            />
            {models.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {models.map((m) => (
                  <button key={m} type="button" className="chip !min-h-[42px] !text-[0.88rem]" aria-pressed={v.model === m} onClick={() => choose("model", m)}>
                    {m}
                  </button>
                ))}
              </div>
            )}
          </form>
        )}

        {step === "year" && (
          <div className="mt-5">
            <div className="grid max-h-[300px] grid-cols-4 gap-2 overflow-y-auto pr-1 sm:grid-cols-6 [scrollbar-width:thin]">
              {yearOptions.map((y) => (
                <button key={y} type="button" className="chip !px-2" aria-pressed={v.year === y} onClick={() => choose("year", y)}>
                  {y}
                </button>
              ))}
              <button type="button" className="chip col-span-2 !px-2" aria-pressed={v.year === "Anterior a 1995"} onClick={() => choose("year", "Anterior a 1995")}>
                Antes de 1995
              </button>
              <button type="button" className="chip col-span-2 !px-2" aria-pressed={v.year === NAO_SEI} onClick={() => choose("year", NAO_SEI)}>
                {NAO_SEI}
              </button>
            </div>
          </div>
        )}

        {step === "engine" && (
          <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {[...engineOptions, NAO_SEI].map((e) => (
              <button key={e} type="button" className="chip !px-2" aria-pressed={v.engine === e} onClick={() => choose("engine", e)}>
                {e}
              </button>
            ))}
          </div>
        )}

        {step === "startStop" && (
          <div className="mt-5">
            <p className="text-[0.95rem] text-steel">O Start-Stop desliga o motor automaticamente em paradas, como no semáforo, e religa ao soltar o freio.</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {["Sim", "Não", NAO_SEI].map((o) => (
                <button key={o} type="button" className="chip !min-h-[64px] !text-[1.05rem]" aria-pressed={v.startStop === o} onClick={() => choose("startStop", o)}>
                  {o}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "district" && (
          <form
            className="mt-5"
            onSubmit={(e) => {
              e.preventDefault();
              go("result");
            }}
          >
            <label className="text-sm text-steel" htmlFor="sel-district">
              Usamos essa informação apenas para orientar sobre o atendimento na sua região.
            </label>
            <input
              id="sel-district"
              className="field mt-2"
              placeholder="Ex.: Pituba, Salvador"
              value={v.district}
              maxLength={80}
              autoComplete="address-level3"
              onChange={(e) => (begin(), setV({ ...v, district: e.target.value }))}
            />
            <button type="submit" className="btn btn-volt mt-5 w-full sm:w-auto">
              Ver resumo <ArrowRight className="size-4" />
            </button>
          </form>
        )}

        {step === "result" && (
          <div>
            <p className="eyebrow inline-flex items-center gap-2 text-volt">
              <Sparkles className="size-4" /> Resumo do seu veículo
            </p>
            <h3 ref={titleRef} tabIndex={-1} className="display mt-3 text-[1.6rem] focus:outline-none sm:text-[2rem]">
              {[v.make, v.model].filter(Boolean).join(" ") || "Seu veículo"}
              {v.year && v.year !== NAO_SEI && <span className="text-steel"> {v.year}</span>}
            </h3>

            <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.id} className="group relative rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                  <dt className="text-[0.72rem] uppercase tracking-[0.14em] text-steel">{s.label}</dt>
                  <dd className="mt-1 truncate font-semibold">{v[s.id as keyof VehicleQuery] || "—"}</dd>
                  <button type="button" onClick={() => setStep(s.id)} className="absolute right-2 top-2 grid size-8 place-items-center rounded-full text-white/50 hover:bg-white/10 hover:text-white" aria-label={`Editar ${s.label}`}>
                    <Pencil className="size-3.5" />
                  </button>
                </div>
              ))}
            </dl>

            {matches.length === 0 ? (
              <div className="mt-5 flex gap-3 rounded-2xl border border-volt/25 bg-volt/[0.07] p-4 text-[0.95rem]">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-volt" />
                <p className="text-white/85">
                  Para garantir a aplicação correta, um especialista da FlyBaterias confere os dados do seu veículo e envia as opções disponíveis com os valores.
                </p>
              </div>
            ) : (
              <ul className="mt-5 grid gap-2">
                {matches.map((p) => (
                  <li key={p.slug} className="flex items-center gap-3 rounded-2xl border border-white/10 p-4">
                    <Check className="size-5 text-volt" /> {p.brand} {p.model} · {p.amperage} · {p.technology}
                  </li>
                ))}
              </ul>
            )}

            <details className="mt-4 text-sm text-steel">
              <summary className="cursor-pointer select-none hover:text-white">Ver mensagem que será enviada</summary>
              <pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-black/30 p-4 font-sans text-[0.85rem] text-white/80">{message}</pre>
            </details>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappUrl(message)}
                target="_blank"
                rel="noopener"
                className="btn btn-whatsapp w-full sm:w-auto"
                onClick={() => {
                  track("quote_request", { source: "selector" });
                  track("whatsapp_click", { cta_location: "selector" });
                }}
              >
                <WhatsAppIcon className="size-5" /> Consultar opções e preços
              </a>
              <button type="button" onClick={reset} className="btn btn-ghost w-full sm:w-auto">
                <RotateCcw className="size-4" /> Recomeçar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navegação */}
      {step !== "result" && (
        <div className="relative mt-6 flex items-center justify-between border-t border-white/8 pt-5">
          <button type="button" onClick={back} disabled={idx === 0} className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-3 text-sm font-semibold text-white/70 hover:text-white disabled:opacity-0">
            <ArrowLeft className="size-4" /> Voltar
          </button>
          {step !== "district" && (
            <button type="button" onClick={() => go(nextOf(step))} disabled={!canNext} className="btn btn-royal !min-h-[44px] disabled:cursor-not-allowed disabled:opacity-40">
              Continuar <ArrowRight className="size-4" />
            </button>
          )}
          {step === "district" && (
            <button type="button" onClick={() => go("result")} className="text-sm font-semibold text-white/70 underline-offset-4 hover:text-white hover:underline">
              Pular esta etapa
            </button>
          )}
        </div>
      )}
    </div>
  );
}
