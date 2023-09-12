import { useState, useReducer, useCallback } from 'react';

import { Ingredient } from '../../types';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('No case defined.');
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  // const [userIngredients, setUserIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  //? ***
  // Unnecessary because we make a initial fetch in <Search /> component already if there is no query
  // useEffect(() => {// useEffect() gets executed after component render
  //   fetch('https://react-hooks-45f20-default-rtdb.firebaseio.com/ingredients.json').then(response => response.json()
  //   ).then(responseData => { // responseData is an object because of firebase returns as an object
  //     const loadedIngredients = [];
  //     for (const key in responseData) {
  //       loadedIngredients.push({
  //         id: key,
  //         title: responseData[key].ingredient.title,
  //         amount: responseData[key].ingredient.amount,
  //       });
  //     }
  //     setUserIngredients(loadedIngredients);
  //   })
  // }, []);

  const filteredIngredientsHandler = useCallback((filteredIngredients: Ingredient[]) => {
    //TODO setUserIngredients(filteredIngredients);
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);
  // useCallback() is caches the function passed as an argument and it survives re-renders thus function not re-created
  const addIngredientHandler = (ingredient: { title: string; amount: string }) => {
    setIsLoading(true);
    setTimeout(() => {

      fetch('https://react-hooks-45f20-default-rtdb.firebaseio.com/ingredients.json', {
        method: 'POST',
        body: JSON.stringify({ ingredient }),
        headers: { 'Content-Type': 'application/json' }
      }).then(response => {
        setIsLoading(false);
        return response.json() // turns response coming from the firebase to javascript object
      }).then(responseData => { /*name inside the incoming response is a unique id (given by Firebase) */
        // setUserIngredients(prevUserIngredients => [
        //   ...prevUserIngredients,
        //   { id: responseData.name, ...ingredient },
        // ]);
        dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...ingredient } });
      }).catch(err => {
        setError('Something went wrong!');
        console.log(err);
      });
    }, 1000);
  };

  const removeIngredientHandler = (ingredientId: string) => {
    setIsLoading(true);
    fetch(`https://react-hooks-45f20-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    }).then(response => {
      setIsLoading(false);
      if (response.ok) {
        console.log(`Item with ID ${ingredientId} deleted successfully.`);
      } else {
        console.error(`Failed to delete item with ID ${ingredientId}`);
      }
      // setUserIngredients(prevUserIngredients =>
      //   prevUserIngredients.filter(ingredient => ingredient.id !== ingredientId)
      // );
      dispatch({ type: 'DELETE', id: ingredientId });
    })
  };

  const clearError = () => {
    setError('');
    setIsLoading(false);
  }

  return (
    <>
      <div className="App">
        {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
        <IngredientForm
          onAddIngredient={addIngredientHandler}
          loading={isLoading} />

        <section>
          <Search onLoadedIngredients={filteredIngredientsHandler} />
          <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
        </section>
      </div>
    </>
  );
}

export default Ingredients;
