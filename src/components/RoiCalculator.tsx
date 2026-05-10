// src/components/RoiCalculator.tsx
import { useState, useEffect, useRef } from 'react';

type PropType = 'land' | 'home' | 'villa';

const ROI: Record<PropType, { rentalYieldMonthly: number; appreciation: number; label: string }> = {
  land:  { rentalYieldMonthly: 0,      appreciation: 0.08, label: '🌳 Land' },
  home:  { rentalYieldMonthly: 0.007,  appreciation: 0.06, label: '🏠 Residential' },
  villa: { rentalYieldMonthly: 0.0095, appreciation: 0.07, label: '🏡 Rental Villa' },
};

function useCountUp(target: number, duration = 550) {
  const [val, setVal] = useState(target);
  const prev = useRef(target);
  const raf  = useRef<number>(0);

  useEffect(() => {
    if (prev.current === target) return;
    const from = prev.current;
    prev.current = target;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(from + (target - from) * ease));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return val;
}

const usd = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function RoiCalculator() {
  const [budget, setBudget]       = useState(340_000);
  const [propType, setPropType]   = useState<PropType>('villa');
  const [occupancy, setOccupancy] = useState(65);

  const params = ROI[propType];
  const effectiveMonthlyYield =
    propType === 'villa'
      ? params.rentalYieldMonthly * (occupancy / 65)
      : params.rentalYieldMonthly;

  const monthly    = Math.round(budget * effectiveMonthlyYield);
  const annualRoi  = propType === 'land' ? 0 : (monthly * 12 / budget) * 100;
  const fiveYear   = Math.round(budget * Math.pow(1 + params.appreciation, 5));

  const animMonthly  = useCountUp(monthly);
  const animFiveYear = useCountUp(fiveYear);
  // annualRoi is small — animate × 10 to get one decimal place
  const animRoiX10   = useCountUp(Math.round(annualRoi * 10));

  const waMsg = encodeURIComponent(
    `Hi! I ran the ROI calculator:\n• Budget: ${usd(budget)}\n• Type: ${params.label}\n` +
    (propType !== 'land' ? `• Monthly Rental: ${usd(monthly)}\n• Annual ROI: ${(annualRoi).toFixed(1)}%\n` : '') +
    `• 5-Year Value: ${usd(fiveYear)}\nCan you send a detailed projection?`
  );

  return (
    <section className="w-full py-16 bg-[#0d2218] text-white" aria-labelledby="roi-heading">
      <div className="max-w-5xl mx-auto px-6">

        <div className="text-center mb-10">
          <p className="text-[#C9A24E] text-xs font-bold uppercase tracking-[0.2em] mb-2">Investment Tool</p>
          <h2
            id="roi-heading"
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Estimate Your Return
          </h2>
          <p className="text-white/55 text-sm mt-2 max-w-sm mx-auto">
            Adjust the parameters to see estimated rental income and appreciation for La Fortuna properties.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* ── Inputs ─────────────────────────────────────────────── */}
          <div className="space-y-8">

            {/* Budget */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label htmlFor="roi-budget" className="text-xs font-bold uppercase tracking-[0.15em] text-white/55">
                  Budget
                </label>
                <span className="text-xl font-extrabold text-[#C9A24E]">{usd(budget)}</span>
              </div>
              <input
                id="roi-budget"
                type="range" min={50_000} max={800_000} step={5_000}
                value={budget}
                onChange={e => setBudget(+e.target.value)}
                className="w-full accent-[#C9A24E] h-1.5"
                aria-valuemin={50000} aria-valuemax={800000} aria-valuenow={budget}
              />
              <div className="flex justify-between text-xs text-white/35 mt-1.5">
                <span>$50k</span><span>$800k</span>
              </div>
            </div>

            {/* Property type */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/55 mb-3">
                Property Type
              </p>
              <div className="flex gap-2">
                {(Object.entries(ROI) as [PropType, typeof ROI[PropType]][]).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => setPropType(key)}
                    aria-pressed={propType === key}
                    className={`flex-1 px-2 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                      propType === key
                        ? 'bg-[#C9A24E] text-[#0d2218] border-[#C9A24E]'
                        : 'bg-white/5 text-white/65 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Occupancy (homes and villas only) */}
            {propType !== 'land' && (
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label htmlFor="roi-occupancy" className="text-xs font-bold uppercase tracking-[0.15em] text-white/55">
                    Occupancy Rate
                  </label>
                  <span className="text-xl font-extrabold text-[#C9A24E]">{occupancy}%</span>
                </div>
                <input
                  id="roi-occupancy"
                  type="range" min={40} max={90} step={5}
                  value={occupancy}
                  onChange={e => setOccupancy(+e.target.value)}
                  className="w-full accent-[#C9A24E] h-1.5"
                  aria-valuemin={40} aria-valuemax={90} aria-valuenow={occupancy}
                />
                <div className="flex justify-between text-xs text-white/35 mt-1.5">
                  <span>40%</span><span>90%</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Results ────────────────────────────────────────────── */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">

            <div>
              <p className="text-xs text-white/45 uppercase tracking-[0.15em] mb-1">
                {propType === 'land' ? 'Land appreciates — no rental income' : 'Est. Monthly Rental'}
              </p>
              <p className="text-4xl font-extrabold text-[#C9A24E]">
                {propType === 'land' ? '—' : (
                  <>
                    {usd(animMonthly)}
                    <span className="text-base font-normal text-white/45"> / mo</span>
                  </>
                )}
              </p>
            </div>

            <div className="border-t border-white/10 pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/55">Annual Gross ROI</span>
                <span className="text-xl font-bold text-white">
                  {propType === 'land' ? '—' : `${(animRoiX10 / 10).toFixed(1)}%`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/55">5-Year Value (est.)</span>
                <span className="text-xl font-bold text-[#C9A24E]">{usd(animFiveYear)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/55">Appreciation / yr</span>
                <span className="text-base font-semibold text-white/70">
                  {(params.appreciation * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <p className="text-[10px] text-white/30 leading-relaxed">
              Estimates based on La Fortuna market averages. Actual returns vary.
              Contact us for a personalized analysis.
            </p>

            <a
              href={`https://wa.me/50689354697?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#C9A24E] text-[#0d2218] font-bold px-5 py-3.5 rounded-xl hover:brightness-110 transition-all duration-200 hover:shadow-xl text-sm"
            >
              Get a Detailed Projection →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
