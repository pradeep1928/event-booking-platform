export type EventCategory =
  | "MUSIC"
  | "SPORTS"
  | "BUSINESS"
  | "EDUCATION"
  | "WORKSHOP"
  | "CONFERENCE"
  | "FESTIVAL"
  | "OTHER";
  
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';

export type EventOrganizer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type Event = {
  id: string;
  title: string;
  description: string | null;
  category: EventCategory;
  venue: string;
  city: string;
  state: string;
  country: string;
  eventDate: string;
  bookingStart: string;
  bookingEnd: string;
  totalSeats: number;
  availableSeats: number;
  price: string;
  status: EventStatus;
  organizerId: string;
  organizer: EventOrganizer;
  createdAt: string;
  updatedAt: string;
};

export type EventSortBy = 'eventDate' | 'price' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export type GetEventsParams = {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  category?: EventCategory;
  organizerId?: string;
  sortBy?: EventSortBy;
  sortOrder?: SortOrder;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type EventsResponse = {
  items: Event[];
  pagination: PaginationMeta;
};
