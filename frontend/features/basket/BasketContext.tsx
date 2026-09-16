"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

export interface BasketItem {
  raffleId: string;
  title: string;
  slug: string;
  mainImage: string;
  ticketPrice: number;
  quantity: number;
  totalTickets: number;
  soldTickets: number;
  remainingTickets: number;
  prizeClassification?: string;
  endDate?: string;
  hostName?: string;
  minTickets?: number;
  maxTickets?: number;
}

interface BasketContextType {
  items: BasketItem[];
  itemCount: number;
  ticketCount: number;
  totalAmount: number;
  hasRifItems: boolean;
  isHydrated: boolean;
  addToBasket: (item: Omit<BasketItem, "remainingTickets"> & { remainingTickets?: number }) => boolean;
  updateQuantity: (raffleId: string, quantity: number) => void;
  removeFromBasket: (raffleId: string) => void;
  clearBasket: () => void;
}

const BASKET_STORAGE_KEY = "airsoft_draws_basket";

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate basket from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(BASKET_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load basket from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync basket to localStorage on state changes once hydrated
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to persist basket to localStorage:", e);
    }
  }, [items, isHydrated]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === BASKET_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setItems(parsed);
          }
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addToBasket = useCallback(
    (newItem: Omit<BasketItem, "remainingTickets"> & { remainingTickets?: number }) => {
      const remaining =
        newItem.remainingTickets !== undefined
          ? newItem.remainingTickets
          : Math.max(0, newItem.totalTickets - newItem.soldTickets);

      if (remaining <= 0) return false;

      const minTickets = newItem.minTickets || 1;
      const maxTickets = newItem.maxTickets;
      const effectiveMax = maxTickets ? Math.min(remaining, maxTickets) : remaining;

      setItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.raffleId === newItem.raffleId);
        if (existingIndex >= 0) {
          const existing = prev[existingIndex];
          const newQuantity = Math.max(
            minTickets,
            Math.min(existing.quantity + newItem.quantity, effectiveMax),
          );
          const updated = [...prev];
          updated[existingIndex] = {
            ...existing,
            ...newItem,
            quantity: newQuantity,
            remainingTickets: remaining,
            minTickets,
            maxTickets,
          };
          return updated;
        }

        const validQuantity = Math.max(
          minTickets,
          Math.min(newItem.quantity, effectiveMax),
        );
        return [
          ...prev,
          {
            ...newItem,
            quantity: validQuantity,
            remainingTickets: remaining,
            minTickets,
            maxTickets,
          },
        ];
      });

      return true;
    },
    [],
  );

  const updateQuantity = useCallback((raffleId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.raffleId !== raffleId) return item;
          const minTickets = item.minTickets || 1;
          const effectiveMax = item.maxTickets
            ? Math.min(item.remainingTickets, item.maxTickets)
            : item.remainingTickets;
          const clamped = Math.max(minTickets, Math.min(quantity, effectiveMax));
          return { ...item, quantity: clamped };
        })
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeFromBasket = useCallback((raffleId: string) => {
    setItems((prev) => prev.filter((item) => item.raffleId !== raffleId));
  }, []);

  const clearBasket = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(BASKET_STORAGE_KEY);
    } catch {}
  }, []);

  const itemCount = items.length;

  const ticketCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const totalAmount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity * item.ticketPrice, 0);
  }, [items]);

  const hasRifItems = useMemo(() => {
    return items.some((item) => (item.prizeClassification || "RIF") === "RIF");
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      ticketCount,
      totalAmount,
      hasRifItems,
      isHydrated,
      addToBasket,
      updateQuantity,
      removeFromBasket,
      clearBasket,
    }),
    [
      items,
      itemCount,
      ticketCount,
      totalAmount,
      hasRifItems,
      isHydrated,
      addToBasket,
      updateQuantity,
      removeFromBasket,
      clearBasket,
    ],
  );

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error("useBasket must be used within a BasketProvider");
  }
  return context;
}
