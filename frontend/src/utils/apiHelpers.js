/**
 * DRF renvoie souvent { count, next, previous, results } au lieu d'un tableau.
 */
export function unwrapListResponse(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}
