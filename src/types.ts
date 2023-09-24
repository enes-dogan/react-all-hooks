import { ReactNode } from 'react';

export interface IngredientFormProps {
  onAddIngredient: (ingredient: { title: string; amount: string }) => void;
  loading: boolean;
}

export interface ErrorModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export interface IngredientListProps {
  ingredients: { id: string; title: string; amount: string }[];
  onRemoveItem: (id: string) => void;
}

export interface CardProps {
  children: React.ReactNode;
}

export interface Ingredient {
  id: string;
  title: string;
  amount: string;
}

export interface SearchProps {
  onLoadedIngredients: (loadedIngredients: Ingredient[]) => void;
}

export interface curHttpState {
  loading: boolean;
  error: boolean | null | string;
  data: null; // TODO
  extra: null; // TODO
}

export interface AuthContextProviderProps {
  children: ReactNode;
}

export type IngredientAction =
  | { type: 'SET'; ingredients: Ingredient[] }
  | { type: 'ADD'; ingredient: Ingredient }
  | { type: 'DELETE'; id: string };

export type HttpAction =
  | { type: 'SEND' }
  | { type: 'RESPONSE' }
  | { type: 'ERROR'; errorMessage: string }
  | { type: 'CLEAR' };

export type HttpReducerType = (
  curHttpState: curHttpState,
  action: HttpAction
) => curHttpState;
