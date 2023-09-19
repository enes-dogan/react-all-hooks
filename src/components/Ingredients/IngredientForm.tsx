import { useState, useCallback } from 'react';
import React from 'react';

import { IngredientFormProps } from '../../types';

import Card from '../UI/Card';
import './IngredientForm.css';
import LoadingIndicator from '../UI/LoadingIndicator';

const IngredientForm: React.FC<IngredientFormProps> = useCallback(React.memo(({ onAddIngredient, loading }) => {
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');

  console.log('RENDERING INGREDIENT FORM');

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    onAddIngredient({ title: enteredTitle, amount: enteredAmount });
    setEnteredAmount('');
    setEnteredTitle('');
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" value={enteredTitle}
              onChange={e => setEnteredTitle(e.target.value)} required />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={enteredAmount}
              onChange={e => setEnteredAmount(e.target.value)} required />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {loading && <LoadingIndicator />}
          </div>
        </form>
      </Card>
    </section>
  );
}), []
)

export default IngredientForm;
