import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { usePriceCalculator } from './usePriceCalculator';

const baseService = {
  title: 'Service test',
  base_price: '100.00',
  options: [
    { option: { id: 'opt-fixed', name: 'Fixed', price: '20.00', pricing_type: 'FIXED' } },
    { option: { id: 'opt-child', name: 'Per child', price: '5.00', pricing_type: 'PER_CHILD' } },
    { option: { id: 'opt-hour', name: 'Per hour', price: '30.00', pricing_type: 'PER_HOUR' } },
  ],
};

describe('usePriceCalculator', () => {
  it('calcule une option FIXED', () => {
    const { result } = renderHook(() =>
      usePriceCalculator(baseService, { 'opt-fixed': 1 }, 5, 120)
    );
    expect(result.current.estimated_price).toBe(120);
  });

  it('calcule une option PER_CHILD pour 5 enfants', () => {
    const { result } = renderHook(() =>
      usePriceCalculator(baseService, { 'opt-child': 1 }, 5, 120)
    );
    expect(result.current.estimated_price).toBe(125);
  });

  it('calcule une option PER_HOUR pour 120 minutes', () => {
    const { result } = renderHook(() =>
      usePriceCalculator(baseService, { 'opt-hour': 1 }, 5, 120)
    );
    expect(result.current.estimated_price).toBe(160);
  });

  it('calcule une combinaison de plusieurs options', () => {
    const { result } = renderHook(() =>
      usePriceCalculator(
        baseService,
        { 'opt-fixed': 1, 'opt-child': 1, 'opt-hour': 1 },
        5,
        120
      )
    );
    expect(result.current.estimated_price).toBe(205);
  });
});
