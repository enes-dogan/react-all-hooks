import React, { useEffect, useState, useRef } from 'react';

import { SearchProps } from '../../types'

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(({ onLoadedIngredients }: SearchProps) => {
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0 ? ''
            : `?orderBy="ingredient/title"&equalTo="${enteredFilter}"`;
        fetch('https://react-hooks-45f20-default-rtdb.firebaseio.com/ingredients.json' + query)
          .then(response => response.json()
          ).then(responseData => {
            const loadedIngredients = [];
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].ingredient.title,
                amount: responseData[key].ingredient.amount,
              });
            }// function passed into onLoadedIngredients (filteredIngredientsHandler) is
            // re-created because <Search/> component re-created from scratch causes infinite loop
            onLoadedIngredients(loadedIngredients)
          }); // We should be explicit about our useEffect() dependencies
      }
    }, 500);
    //Clean-up Function
    return () => {
      clearTimeout(timer);
    };
  }, [onLoadedIngredients, enteredFilter, inputRef]);
  // We only want to run this func when onLoadedIngregients changes/executes
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input ref={inputRef} type="text" value={enteredFilter} onChange={e => setEnteredFilter(e.target.value)} />
          {/* whenever the input changes useEffect() -line 12- executes because its dependency changed (enteredFilter)*/}
        </div>
      </Card>
    </section>
  );
});

export default Search;
