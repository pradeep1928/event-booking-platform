import { useEffect, useState } from 'react';

type EventSearchProps = {
  onChange: (value: string) => void;
  placeholder?: string;
};

const EventSearch = ({ onChange, placeholder = 'Search events...' }: EventSearchProps) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onChange(inputValue.trim());
    }, 400);

    return () => {
      window.clearTimeout(timer);
    };
  }, [inputValue, onChange]);

  const handleClear = () => {
    setInputValue('');
  };

  return (
    <div className="w-full">
      <label htmlFor="event-search" className="mb-2 block text-sm font-medium text-slate-700">
        Search events
      </label>

      <div className="relative">
        <span
          className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </span>

        <input
          id="event-search"
          type="search"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="min-h-11 w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />

        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default EventSearch;
