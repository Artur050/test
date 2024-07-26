import React, { useState, useEffect } from 'react';
import dataBooks from '../data/dataBooks.json';
import { FaArrowUp } from "react-icons/fa6";
import { FaArrowDown } from "react-icons/fa6";



interface FilterTagsProps {
  onFilter: (tags: string[]) => void;
}

const FilterTags: React.FC<FilterTagsProps> = ({ onFilter }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagListVisible, setIsTagListVisible] = useState(false);

  useEffect(() => {
    const allTags = dataBooks.reduce((acc, book) => {
      book.tags.forEach((tag) => {
        if (!acc.includes(tag)) {
          acc.push(tag);
        }
      });
      return acc;
    }, [] as string[]);

    setTags(allTags);

    const storedTags = sessionStorage.getItem('selectedTags');
    if (storedTags) {
      setSelectedTags(JSON.parse(storedTags));
    }
  }, []);

  useEffect(() => {
    onFilter(selectedTags);
    sessionStorage.setItem('selectedTags', JSON.stringify(selectedTags));
  }, [selectedTags, onFilter]);

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleTagList = () => {
    setIsTagListVisible((prev) => !prev);
  };

  const resetTags = () => {
    setSelectedTags([]);
  };

  return (
    <div className=''>
      <div className="flex justify-center my-2">
        <h3 className='text-red-900 font-bold'>Filter by Tags</h3>
        <button
          onClick={toggleTagList}
          className="ml-2 bg-gray-200 px-2 py-1 rounded"
        >
          {isTagListVisible ? <FaArrowUp /> : <FaArrowDown/>}
        </button>
        <button
          onClick={resetTags}
          className="ml-2 bg-gray-200 px-2 py-1 rounded"
        >reset rules</button>
      </div>
      {isTagListVisible && (
        <div className="absolute  left-2/4 top-2/4; bg-white border rounded shadow-md p-2  mt-0 z-10">
          {tags.map((tag) => (
            <button
              className='flex font-black my-1'
              key={tag}
              onClick={() => handleTagClick(tag)}
              style={{
                backgroundColor: selectedTags.includes(tag) ? 'lightblue' : 'white',
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterTags;
