import { create } from "zustand";

interface UIState {
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleSearch: () => void;
  closeSearch: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isCartOpen: false,
  isSearchOpen: false,
  isMobileMenuOpen: false,

  toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen, isMobileMenuOpen: false, isSearchOpen: false })),
  openCart: () => set({ isCartOpen: true, isMobileMenuOpen: false, isSearchOpen: false }),
  closeCart: () => set({ isCartOpen: false }),
  toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen, isCartOpen: false, isMobileMenuOpen: false })),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen, isCartOpen: false, isSearchOpen: false })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));
