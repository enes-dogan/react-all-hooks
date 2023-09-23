import { useReducer, useCallback, useMemo } from 'react';

import { Ingredient } from '../../types';
import { curHttpState } from '../../types';
import { IngredientAction } from '../../types';
import { HttpAction } from '../../types';
import { HttpReducerType } from '../../types';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';


const ingredientReducer = (currentIngredients: Ingredient[], action: IngredientAction) => {
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

const httpReducer = (curHttpState: curHttpState, action: HttpAction): curHttpState => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...curHttpState, loading: false };
    case 'ERROR':
      console.log(curHttpState);
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...curHttpState, error: null };
    default:
      throw new Error('No case defined.');
  }
};



const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer<HttpReducerType>(httpReducer, { loading: false, error: null });

  const filteredIngredientsHandler = useCallback((filteredIngredients: Ingredient[]) => {
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = useCallback((ingredient: { title: string; amount: string }) => {
    dispatchHttp({ type: 'SEND' });
    fetch('https://react-hooks-enes-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json', {
      method: 'POST',
      body: JSON.stringify({ ingredient }),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      dispatchHttp({ type: 'RESPONSE' });
      return response.json();
    }).then(responseData => {
      dispatch({
        type: 'ADD',
        ingredient: { id: responseData.name, ...ingredient }
      });
    });
  }, []);

  const removeIngredientHandler = useCallback((ingredientId: string) => {
    dispatchHttp({ type: 'SEND' });
    fetch(`https://react-hooks-enes-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    })
      .then(response => {
        dispatchHttp({ type: 'RESPONSE' });
        dispatch({ type: 'DELETE', id: ingredientId });
        console.log(response);
      })
      .catch(error => {
        dispatchHttp({ type: 'ERROR', errorMessage: `Something went wrong! ${error}` });
      });
  }, []);

  const clearError = useCallback(() => {
    dispatchHttp({ type: 'CLEAR' });
  }, []);

  const ingredientList = useMemo(() => {
    return <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
  }, [userIngredients, removeIngredientHandler])

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading} />

      <section>
        <Search onLoadedIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
