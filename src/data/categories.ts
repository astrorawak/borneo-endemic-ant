import type { Category } from '../types';

export const initialCategories: Category[] = [
  {
    id: 1,
    name: 'Ants',
    slug: 'ants',
    description: 'Endemic ant species from the rainforests of Borneo',
    icon: '🐜',
  },
  {
    id: 2,
    name: 'Insects',
    slug: 'insects',
    description: 'Rare and exotic insects native to Borneo',
    icon: '🦗',
  },
  {
    id: 3,
    name: 'Reptiles',
    slug: 'reptiles',
    description: 'Endemic reptiles from Borneo\'s ancient forests',
    icon: '🦎',
  },
  {
    id: 4,
    name: 'Ant Supplies',
    slug: 'supplies',
    description: 'Formicariums, food, and care equipment',
    icon: '🧪',
  },
];
