import React from 'react';

import { IngredientListProps } from '../../types';

import './IngredientList.css';

const IngredientList: React.FC<IngredientListProps> = React.memo(({ ingredients, onRemoveItem }) => {
  return (
    <section className="ingredient-list">
      <h2>Loaded Ingredients</h2>
      <ul>
        {ingredients.map(ig => (
          <li key={ig.id} onClick={onRemoveItem.bind(this, ig.id)}> {/*this or null what is the difference*/}
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  )
});

export default IngredientList;
