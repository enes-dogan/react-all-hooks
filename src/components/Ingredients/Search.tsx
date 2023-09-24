import React, { useEffect, useState, useRef } from 'react';

import { SearchProps } from '../../types';

import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';
import './Search.css';

const Search = React.memo(({ onLoadedIngredients }: SearchProps) => {
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef: React.MutableRefObject<HTMLInputElement | null> = useRef();
  const { isLoading, data, error, sendRequest, clear } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current?.value) {
        const query =
          enteredFilter.length === 0
            ? ''
            : `?orderBy="ingredient/title"&equalTo="${enteredFilter}"`;
        sendRequest(
          'https://react-hooks-enes-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json' + query,
          'GET'
        );
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, inputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      onLoadedIngredients(loadedIngredients);
    }
  }, [data, isLoading, error, onLoadedIngredients]);

  return (
    <section className='search'>
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className='search-input'>
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type='text'
            value={enteredFilter}
            onChange={e => setEnteredFilter(e.target.value)}
          />
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
