import type { EventCategory, EventSortBy, SortOrder } from '../eventTypes';

type EventFiltersProps = {
  city: string;
  category?: EventCategory;
  sortBy: EventSortBy;
  sortOrder: SortOrder;
  onCityChange: (city: string) => void;
  onCategoryChange: (category?: EventCategory) => void;
  onSortChange: (sortBy: EventSortBy, sortOrder: SortOrder) => void;
  onReset: () => void;
};

const categories: {
  value: EventCategory;
  label: string;
}[] = [
  { value: 'MUSIC', label: 'Music' },
  { value: 'SPORTS', label: 'Sports' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'WORKSHOP', label: 'Workshop' },
  { value: 'CONFERENCE', label: 'Conference' },
  { value: 'FESTIVAL', label: 'Festival' },
  { value: 'OTHER', label: 'Other' },
];

const EventFilters = ({
  city,
  category,
  sortBy,
  sortOrder,
  onCityChange,
  onCategoryChange,
  onSortChange,
  onReset,
}: EventFiltersProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* City */}
        <div>
          <label htmlFor="event-city" className="mb-2 block text-sm font-medium text-slate-700">
            City
          </label>

          <input
            id="event-city"
            type="text"
            value={city}
            onChange={(event) => onCityChange(event.target.value)}
            placeholder="e.g. Mumbai"
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="event-category" className="mb-2 block text-sm font-medium text-slate-700">
            Category
          </label>

          <select
            id="event-category"
            value={category ?? ''}
            onChange={(event) =>
              onCategoryChange(
                event.target.value ? (event.target.value as EventCategory) : undefined,
              )
            }
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All categories</option>

            {categories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="event-sort" className="mb-2 block text-sm font-medium text-slate-700">
            Sort by
          </label>

          <select
            id="event-sort"
            value={`${sortBy}-${sortOrder}`}
            onChange={(event) => {
              const [nextSortBy, nextSortOrder] = event.target.value.split('-') as [
                EventSortBy,
                SortOrder,
              ];

              onSortChange(nextSortBy, nextSortOrder);
            }}
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="eventDate-asc">Event date — earliest</option>

            <option value="eventDate-desc">Event date — latest</option>

            <option value="price-asc">Price — low to high</option>

            <option value="price-desc">Price — high to low</option>

            <option value="createdAt-desc">Newest events</option>

            <option value="createdAt-asc">Oldest events</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onReset}
          className="min-h-11 rounded-lg px-4 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Reset filters
        </button>
      </div>
    </div>
  );
};

export default EventFilters;
