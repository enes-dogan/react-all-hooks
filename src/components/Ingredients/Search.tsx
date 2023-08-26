import React, { useEffect, useState } from 'react';

import { SearchProps } from '../../types'

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(({ onLoadedIngredients }: SearchProps) => {
  const [enteredFilter, setEnteredFilter] = useState('');
  useEffect(() => {
    fetch('https://react-hooks-45f20-default-rtdb.firebaseio.com/ingredients.json').then(response => response.json()
    ).then(responseData => {
      const loadedIngredients = [];
      for (const key in responseData) {
        loadedIngredients.push({
          id: key,
          title: responseData[key].ingredient.title,
          amount: responseData[key].ingredient.amount,
        });
      }
      onLoadedIngredients(loadedIngredients)
    });
  }, [onLoadedIngredients, enteredFilter]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" value={enteredFilter} onChange={e => setEnteredFilter(e.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
