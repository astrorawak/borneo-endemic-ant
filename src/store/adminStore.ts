import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialProducts } from '../data/products';
import { initialCategories } from '../data/categories';
import { initialBlogPosts } from '../data/blog';
import { defaultSettings } from '../data/settings';
import type { Product, Category, BlogPost, Order, StoreSettings } from '../types';

interface AdminStore {
  products: Product[];
  categories: Category[];
  blogPosts: BlogPost[];
  orders: Order[];
  settings: StoreSettings;
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: number) => void;
  addCategory: (c: Category) => void;
  updateCategory: (c: Category) => void;
  deleteCategory: (id: number) => void;
  addBlogPost: (p: BlogPost) => void;
  updateBlogPost: (p: BlogPost) => void;
  deleteBlogPost: (id: number) => void;
  addOrder: (o: Order) => void;
  updateOrder: (o: Order) => void;
  updateSettings: (s: StoreSettings) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      products: initialProducts,
      categories: initialCategories,
      blogPosts: initialBlogPosts,
      orders: [],
      settings: defaultSettings,
      addProduct: (p) => set((s) => ({ products: [...s.products, p] })),
      updateProduct: (p) => set((s) => ({ products: s.products.map((x) => x.id === p.id ? p : x) })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((x) => x.id !== id) })),
      addCategory: (c) => set((s) => ({ categories: [...s.categories, c] })),
      updateCategory: (c) => set((s) => ({ categories: s.categories.map((x) => x.id === c.id ? c : x) })),
      deleteCategory: (id) => set((s) => ({ categories: s.categories.filter((x) => x.id !== id) })),
      addBlogPost: (p) => set((s) => ({ blogPosts: [...s.blogPosts, p] })),
      updateBlogPost: (p) => set((s) => ({ blogPosts: s.blogPosts.map((x) => x.id === p.id ? p : x) })),
      deleteBlogPost: (id) => set((s) => ({ blogPosts: s.blogPosts.filter((x) => x.id !== id) })),
      addOrder: (o) => set((s) => ({ orders: [...s.orders, o] })),
      updateOrder: (o) => set((s) => ({ orders: s.orders.map((x) => x.id === o.id ? o : x) })),
      updateSettings: (s) => set({ settings: s }),
    }),
    { name: 'borneo-endemic-ant-admin' }
  )
);
