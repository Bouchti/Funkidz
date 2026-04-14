import { useMemo } from 'react';

/**
 * Logic for calculating estimated price based on service base price and options.
 * Matches backend logic:
 * - FIXED : Unit price (fixed regardless of kids/duration)
 * - PER_CHILD : unit × children_count
 * - PER_HOUR : unit × (duration_minutes / 60)
 *
 * @param {object|null} service — service detail from API
 * @param {Record<string, number>} optionQuantities — id option → quantity/active
 * @param {number} childrenCount — number of children
 * @param {number} durationMinutes — total duration in minutes
 */
export function usePriceCalculator(service, optionQuantities, childrenCount, durationMinutes) {
  return useMemo(() => {
    if (!service) {
      return {
        estimated_price: 0,
        base_amount: 0,
        lines: [],
        formula_summary: '',
      };
    }

    const base = Number.parseFloat(String(service.base_price)) || 0;
    const lines = [
      {
        key: 'base',
        label: 'Tarif de base',
        detail: service.title,
        formula: `${base.toFixed(2)} €`,
        amount: base,
      },
    ];

    let total = base;

    const opts = service.options || [];
    opts.forEach(({ option }) => {
      const isSelected = (optionQuantities[option.id] || 0) > 0;
      if (!isSelected) return;

      const unit = Number.parseFloat(String(option.price)) || 0;
      let amount = 0;
      let formula = '';

      switch (option.pricing_type) {
        case 'FIXED':
          amount = unit;
          formula = `${unit.toFixed(2)} € (Fixe)`;
          break;
        case 'PER_CHILD':
          amount = unit * childrenCount;
          formula = `${unit.toFixed(2)} € × ${childrenCount} enfant(s)`;
          break;
        case 'PER_HOUR':
          const hours = durationMinutes / 60;
          amount = unit * hours;
          formula = `${unit.toFixed(2)} € × ${hours} h`;
          break;
        default:
          amount = unit;
          formula = `${unit.toFixed(2)} €`;
      }

      total += amount;
      lines.push({
        key: option.id,
        label: option.name,
        detail: option.pricing_type,
        formula,
        amount,
      });
    });

    const estimated_price = Math.round(total * 100) / 100;

    const formula_summary = lines
      .map((l) => `${l.label}: ${l.amount.toFixed(2)} €`)
      .join(' + ');

    return {
      estimated_price,
      base_amount: base,
      lines,
      formula_summary,
    };
  }, [service, optionQuantities, childrenCount, durationMinutes]);
}
