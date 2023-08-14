import { useState } from 'react';

import { Ingredient } from '../../types';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState<Ingredient[]>([]);

  const addIngredientHandler = (ingredient: { title: string; amount: string }) => {
    setUserIngredients(prevIngredients => [
      ...prevIngredients,
      { id: Math.random().toString(), ...ingredient },
    ]);
  };

  const removeIngredientHandler = (ingredientId: string) => {
    setUserIngredients(prevIngredients =>
      prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
    );
  };

  return (
    <>
      <div className="App">
        <IngredientForm onAddIngredient={addIngredientHandler} />

        <section>
          <Search />
          <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
        </section>
      </div>
    </>
  );
}

export default Ingredients;
