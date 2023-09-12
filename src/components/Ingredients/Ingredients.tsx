import { useEffect, useReducer, useCallback } from 'react';

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
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...curHttpState, loading: false }; //speading the state obj and overwritting/changing only loading property
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...curHttpState, error: null };
    default:
      throw new Error('No case defined.');
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null
  });
  // const [userIngredients, setUserIngredients] = useState<Ingredient[]>([]);
  //! const [isLoading, setIsLoading] = useState(false);
  //! const [error, setError] = useState('');

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);
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
  // useCallback() is caches the function passed and it survives re-renders/function not re-created
  const addIngredientHandler = (ingredient: { title: string; amount: string }) => {
    //! setIsLoading(true);
    dispatchHttp({ type: 'SEND' });
    fetch('https://react-hooks-45f20-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify({ ingredient }),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      //! setIsLoading(false);
      dispatchHttp({ type: 'RESPONSE' });
      return response.json(); // turns response coming from the firebase to javascript object
    }).then(responseData => { /*name inside the incoming response is a unique id (given by Firebase) */
      // setUserIngredients(prevUserIngredients => [
      //   ...prevUserIngredients,
      //   { id: responseData.name, ...ingredient },
      // ]);
      dispatch({
        type: 'ADD',
        ingredient: { id: responseData.name, ...ingredient }
      });
    });
  };

  const removeIngredientHandler = (ingredientId: string) => {
    //! setIsLoading(true);
    dispatchHttp({ type: 'SEND' });
    fetch(`https://react-hooks-45f20-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    })
      .then(response => {
        //! setIsLoading(false);
        dispatchHttp({ type: 'RESPONSE' });
        // setUserIngredients(prevUserIngredients =>
        //   prevUserIngredients.filter(ingredient => ingredient.id !== ingredientId)
        // );
        dispatch({ type: 'DELETE', id: ingredientId });
      })
      .catch(error => {
        dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
      });
  };

  const clearError = () => {
    dispatchHttp({ type: 'CLEAR' });
  };

  return (
    <>
      <div className="App">
        {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
        <IngredientForm
          onAddIngredient={addIngredientHandler}
          loading={httpState.loading} />

        <section>
          <Search onLoadedIngredients={filteredIngredientsHandler} />
          <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
        </section>
      </div>
    </>
  );
};

export default Ingredients;
