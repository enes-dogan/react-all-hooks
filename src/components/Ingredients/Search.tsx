import React, { useEffect, useState, useRef } from 'react';

import { SearchProps } from '../../types'

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(({ onLoadedIngredients }: SearchProps) => {
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef: React.MutableRefObject<HTMLInputElement | null> = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current?.value) {
        const query =
          enteredFilter.length === 0 ? ''
            : `?orderBy="ingredient/title"&equalTo="${enteredFilter}"`;
        fetch('https://react-hooks-enes-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json' + query)
          .then(response => response.json()
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
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [onLoadedIngredients, enteredFilter, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input ref={inputRef} type="text" value={enteredFilter} onChange={e => setEnteredFilter(e.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
/*
{
  "rules": {
    ".read": true,
    ".write": true,
    "ingredients": {
      ".indexOn": ["ingredient/title"]
    }
  }
}
*/
