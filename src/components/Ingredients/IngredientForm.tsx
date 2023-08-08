import React from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';

interface IngredientFormProps {
  onAddIngredient: (ingredient: { title: string; amount: number }) => void;
}

const IngredientForm: React.FC<IngredientFormProps> = React.memo(() => {
  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    // ...
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
