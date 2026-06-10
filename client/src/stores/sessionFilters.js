import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSessionFilters = create(
  persist(
    (set, get) => ({
      filters: {
        search: '',
        skillArea: '',
        locationType: '',
        upcoming: true,
        page: 1,
        limit: 12,
      },
      setFilter: (key, value) => set((state) => ({
        filters: { ...state.filters, [key]: value, page: key === 'page' ? value : state.filters.page }
      })),
      setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters, page: 1 }
      })),
      resetFilters: () => set({
        filters: { search: '', skillArea: '', locationType: '', upcoming: true, page: 1, limit: 12 }
      }),
      getFilters: () => get().filters,
    }),
    { name: 'session-filters' }
  )
);

export default useSessionFilters;