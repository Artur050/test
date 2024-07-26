import { useCallback, useEffect, useState } from 'react'
import dataBooks from '../data/dataBooks.json'
import { Book } from '../models/models'
import FilterTags from '../components/FilterTags'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type SortOption = 'price' | 'author' | 'date';

export default function Home() {

  const [books, setBooks] = useState<Book[]>([]);
  const [sortOption, setSortOption] = useState<SortOption | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

  useEffect(() => {
    setBooks(dataBooks);
    setFilteredBooks(dataBooks);
  }, []);

  const handleSort = (option: SortOption) => {
    const order = sortOption === option && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOption(option);
    setSortOrder(order);

    const sortedBooks = [...filteredBooks];
    sortedBooks.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      switch (option) {
        case 'price':
          if (a.price === b.price) {
            return a.author.localeCompare(b.author);
          }
          return order === 'asc' ? a.price - b.price : b.price - a.price;
        case 'author':
          return order === 'asc'
            ? a.author.localeCompare(b.author)
            : b.author.localeCompare(a.author);
        case 'date':
          
          if (dateA.getTime() === dateB.getTime()) {
            return a.author.localeCompare(b.author);
          }
          return order === 'asc'
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        default:
          return 0;
      }
    });
    setFilteredBooks(sortedBooks);
  };

  const handleFilterTags = useCallback((selectedTags: string[]) => {
    const filtered = books.filter((book) =>
      selectedTags.every((tag) => book.tags.includes(tag))
    );
    setFilteredBooks(filtered);
  }, [books]);

  return (
    <div className=''>
      <div className='flex flex-col justify-center items-center'>
      <div className='w-[350px] h-[100px] bg-slate-500 rounded-lg flex justify-center items-center '>
        <h1 className='font-semibold text-5xl text-white'>Books List</h1>
      </div>
      <div className='flex justify-center mt-5 items-center rounded-lg w-[350px] text-white hover:text-white/50 bg-slate-500'>
        <div className='text-2xl flex gap-5 justify-center '>
          <button onClick={() => handleSort('price')} className=' hover:text-white'>
            Price {sortOption === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button onClick={() => handleSort('author')} className=' hover:text-white' >
            Author {sortOption === 'author' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button onClick={() => handleSort('date')} className=' hover:text-white'>
            Date {sortOption === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>
      </div>

      <FilterTags onFilter={handleFilterTags} />
      <ul className='grid grid-cols-2     md:grid-cols-4 gap-5 '>
        {filteredBooks.map((book, index) => (
          <div key={index} className='bg-slate-600 rounded-md text-center '>
            <li>
              <h2 className='text-white'>{index+1} {book.title}</h2>
              <p>Author: {book.author}</p>
              <p>Date: {book.date}</p>
              <p>Price: ${book.price}</p>
              <p className='flex justify-center items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>{book.tags.join(', ')}</p>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
}

