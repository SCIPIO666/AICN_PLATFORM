import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useProductStore = create(
  devtools(
    (set, get) => ({
      // UI State (not server state - that's for TanStack Query)
      selectedProduct: null,
      selectedProducts: [], // For bulk operations
      isCreateModalOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      isBulkDeleteModalOpen: false,
      
      // Form state
      formData: {
        name: '',
        price: '',
        description: '',
        category: '',
        stock: 0,
        images: []
      },
      
      formErrors: {},
      isSubmitting: false,
      
      // Filters (temporary UI state)
      filters: {
        category: 'all',
        minPrice: null,
        maxPrice: null,
        inStock: null
      },
      
      // Sorting
      sortConfig: {
        key: 'createdAt',
        direction: 'desc'
      },
      
      // Pagination UI state
      pagination: {
        currentPage: 1,
        itemsPerPage: 10
      },
      
      // Actions
      setSelectedProduct: (product) => set({ selectedProduct: product }),
      
      clearSelectedProduct: () => set({ selectedProduct: null }),
      
      toggleProductSelection: (productId) => set((state) => ({
        selectedProducts: state.selectedProducts.includes(productId)
          ? state.selectedProducts.filter(id => id !== productId)
          : [...state.selectedProducts, productId]
      })),
      
      clearSelectedProducts: () => set({ selectedProducts: [] }),
      
      openCreateModal: () => set({ 
        isCreateModalOpen: true, 
        formData: get().getEmptyFormData(),
        formErrors: {}
      }),
      
      closeCreateModal: () => set({ isCreateModalOpen: false }),
      
      openEditModal: (product) => set({ 
        isEditModalOpen: true, 
        selectedProduct: product,
        formData: product
      }),
      
      closeEditModal: () => set({ 
        isEditModalOpen: false, 
        selectedProduct: null,
        formData: get().getEmptyFormData()
      }),
      
      openDeleteModal: (product) => set({ 
        isDeleteModalOpen: true, 
        selectedProduct: product 
      }),
      
      closeDeleteModal: () => set({ 
        isDeleteModalOpen: false, 
        selectedProduct: null 
      }),
      
      updateFormData: (field, value) => set((state) => ({
        formData: { ...state.formData, [field]: value },
        formErrors: { ...state.formErrors, [field]: null }
      })),
      
      setFormErrors: (errors) => set({ formErrors: errors }),
      
      setSubmitting: (isSubmitting) => set({ isSubmitting }),
      
      resetForm: () => set({ 
        formData: get().getEmptyFormData(),
        formErrors: {},
        isSubmitting: false
      }),
      
      setFilter: (key, value) => set((state) => ({
        filters: { ...state.filters, [key]: value },
        pagination: { ...state.pagination, currentPage: 1 } // Reset page on filter
      })),
      
      clearFilters: () => set({
        filters: {
          category: 'all',
          minPrice: null,
          maxPrice: null,
          inStock: null
        },
        pagination: { ...get().pagination, currentPage: 1 }
      }),
      
      setSort: (key) => set((state) => ({
        sortConfig: {
          key,
          direction: state.sortConfig.key === key && state.sortConfig.direction === 'desc' 
            ? 'asc' 
            : 'desc'
        }
      })),
      
      setPage: (page) => set((state) => ({
        pagination: { ...state.pagination, currentPage: page }
      })),
      
      setItemsPerPage: (itemsPerPage) => set((state) => ({
        pagination: { ...state.pagination, itemsPerPage, currentPage: 1 }
      })),
      
      getEmptyFormData: () => ({
        name: '',
        price: '',
        description: '',
        category: '',
        stock: 0,
        images: []
      }),
      
      // Computed values
      getAppliedFilters: () => {
        const { filters } = get();
        const applied = {};
        if (filters.category && filters.category !== 'all') applied.category = filters.category;
        if (filters.minPrice) applied.minPrice = filters.minPrice;
        if (filters.maxPrice) applied.maxPrice = filters.maxPrice;
        if (filters.inStock !== null) applied.inStock = filters.inStock;
        return applied;
      },
      
      getSortString: () => {
        const { sortConfig } = get();
        return `${sortConfig.key}:${sortConfig.direction}`;
      }
    }),
    { name: 'product-store' }
  )
);

export default useProductStore;