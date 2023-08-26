import { useState, useEffect } from 'react';

import { Ingredient } from '../../types';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {// useEffect() gets executed after component render
    fetch('https://react-hooks-45f20-default-rtdb.firebaseio.com/ingredients.json').then(response => response.json()
    ).then(responseData => { // responseData is an object because of firebase returns as an object
      const loadedIngredients = [];
      for (const key in responseData) {
        loadedIngredients.push({
          id: key,
          title: responseData[key].ingredient.title,
          amount: responseData[key].ingredient.amount,
        });
      }
      setUserIngredients(loadedIngredients);
    })
  }, []);

  const filteredIngredientsHandler = (filteredIngredients: Ingredient[]) => {
    setUserIngredients(filteredIngredients);
  }

  const addIngredientHandler = (ingredient: { title: string; amount: string }) => {
    fetch('https://react-hooks-45f20-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify({ ingredient }),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      return response.json() // turns response coming from the firebase to javascript object
    }).then(responseData => { // name inside the incoming response is a unique id
      setUserIngredients(prevUserIngredients => [
        ...prevUserIngredients,
        { id: responseData.name, ...ingredient },
      ]);
    })
  };

  const removeIngredientHandler = (ingredientId: string) => {
    setUserIngredients(prevUserIngredients =>
      prevUserIngredients.filter(ingredient => ingredient.id !== ingredientId)
    );
  };

  return (
    <>
      <div className="App">
        <IngredientForm onAddIngredient={addIngredientHandler} />

        <section>
          <Search onLoadedIngredients={filteredIngredientsHandler} />
          <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
        </section>
      </div>
    </>
  );
}

export default Ingredients;
