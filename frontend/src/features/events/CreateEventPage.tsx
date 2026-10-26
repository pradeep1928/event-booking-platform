import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateEventMutation } from './eventApi';

const eventCategories = [
  'MUSIC',
  'SPORTS',
  'BUSINESS',
  'EDUCATION',
  'WORKSHOP',
  'CONFERENCE',
  'FESTIVAL',
  'OTHER',
] as const;

const createEventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, 'Title must contain at least 3 characters')
      .max(150, 'Title cannot exceed 150 characters'),

    description: z.string().trim().max(2000, 'Description cannot exceed 2000 characters'),

    category: z.enum(eventCategories),

    venue: z
      .string()
      .trim()
      .min(3, 'Venue must contain at least 3 characters')
      .max(200, 'Venue cannot exceed 200 characters'),

    city: z
      .string()
      .trim()
      .min(2, 'City is required')
      .max(100, 'City cannot exceed 100 characters'),

    state: z
      .string()
      .trim()
      .min(2, 'State is required')
      .max(100, 'State cannot exceed 100 characters'),

    country: z
      .string()
      .trim()
      .min(2, 'Country is required')
      .max(100, 'Country cannot exceed 100 characters'),

    eventDate: z.string().min(1, 'Event date is required'),

    bookingStart: z.string().min(1, 'Booking start date is required'),

    bookingEnd: z.string().min(1, 'Booking end date is required'),

    totalSeats: z
      .number()
      .int('Total seats must be a whole number')
      .positive('Total seats must be greater than 0'),

    price: z.number().min(0, 'Price cannot be negative'),
  })
  .refine((data) => new Date(data.bookingStart).getTime() < new Date(data.bookingEnd).getTime(), {
    path: ['bookingEnd'],
    message: 'Booking end must be after booking start',
  })
  .refine((data) => new Date(data.bookingEnd).getTime() < new Date(data.eventDate).getTime(), {
    path: ['eventDate'],
    message: 'Event date must be after booking closes',
  });

type CreateEventFormData = z.infer<typeof createEventSchema>;

const inputClassName =
  'mt-2 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

const CreateEventPage = () => {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState<string | null>(null);

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),

    defaultValues: {
      title: '',
      description: '',
      category: 'OTHER',

      venue: '',
      city: '',
      state: '',
      country: 'India',

      eventDate: '',
      bookingStart: '',
      bookingEnd: '',

      totalSeats: 1,
      price: 0,
    },
  });

  const handleCreateEvent = async (formData: CreateEventFormData) => {
    setServerError(null);

    try {
      await createEvent({
        title: formData.title.trim(),

        description: formData.description.trim() || undefined,

        category: formData.category,

        venue: formData.venue.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim(),

        eventDate: new Date(formData.eventDate).toISOString(),

        bookingStart: new Date(formData.bookingStart).toISOString(),

        bookingEnd: new Date(formData.bookingEnd).toISOString(),

        totalSeats: formData.totalSeats,

        price: formData.price,
      }).unwrap();

      navigate('/organizer/events', {
        replace: true,
      });
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'data' in error) {
        const data = (
          error as {
            data?: {
              message?: string;
            };
          }
        ).data;

        if (data?.message) {
          setServerError(data.message);
          return;
        }
      }

      setServerError('Unable to create the event. Please try again.');
    }
  };

  return (
    <section className="mx-auto w-full max-w-4xl">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/organizer/events')}
          className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          ← Back to events
        </button>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Create event
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
          Add your event details. Your event will be created as a draft and can be published when
          everything is ready.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleCreateEvent)} className="space-y-8" noValidate>
        {serverError && (
          <div
            role="alert"
            className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {serverError}
          </div>
        )}

        {/* Basic Information */}
        <FormSection title="Basic information">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">
              Event title
            </label>

            <input
              id="title"
              type="text"
              autoComplete="off"
              {...register('title')}
              aria-invalid={Boolean(errors.title)}
              className={inputClassName}
              placeholder="React Conference 2026"
            />

            <FieldError message={errors.title?.message} />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              id="description"
              rows={5}
              {...register('description')}
              aria-invalid={Boolean(errors.description)}
              className={`${inputClassName} resize-y`}
              placeholder="Tell attendees what your event is about..."
            />

            <div className="mt-1 flex justify-between gap-3">
              <FieldError message={errors.description?.message} />

              <span className="ml-auto text-xs text-slate-400">Maximum 2000 characters</span>
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700">
              Category
            </label>

            <select id="category" {...register('category')} className={inputClassName}>
              {eventCategories.map((category) => (
                <option key={category} value={category}>
                  {formatCategory(category)}
                </option>
              ))}
            </select>

            <FieldError message={errors.category?.message} />
          </div>
        </FormSection>

        {/* Location */}
        <FormSection title="Location">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Venue" id="venue" error={errors.venue?.message}>
              <input
                id="venue"
                type="text"
                {...register('venue')}
                className={inputClassName}
                placeholder="Grand Convention Center"
              />
            </Field>

            <Field label="City" id="city" error={errors.city?.message}>
              <input
                id="city"
                type="text"
                {...register('city')}
                className={inputClassName}
                placeholder="Mumbai"
              />
            </Field>

            <Field label="State" id="state" error={errors.state?.message}>
              <input
                id="state"
                type="text"
                {...register('state')}
                className={inputClassName}
                placeholder="Maharashtra"
              />
            </Field>

            <Field label="Country" id="country" error={errors.country?.message}>
              <input
                id="country"
                type="text"
                {...register('country')}
                className={inputClassName}
                placeholder="India"
              />
            </Field>
          </div>
        </FormSection>

        {/* Date & Booking */}
        <FormSection title="Date & booking">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Event date" id="eventDate" error={errors.eventDate?.message}>
              <input
                id="eventDate"
                type="datetime-local"
                {...register('eventDate')}
                className={inputClassName}
              />
            </Field>

            <Field label="Booking starts" id="bookingStart" error={errors.bookingStart?.message}>
              <input
                id="bookingStart"
                type="datetime-local"
                {...register('bookingStart')}
                className={inputClassName}
              />
            </Field>

            <Field label="Booking ends" id="bookingEnd" error={errors.bookingEnd?.message}>
              <input
                id="bookingEnd"
                type="datetime-local"
                {...register('bookingEnd')}
                className={inputClassName}
              />
            </Field>
          </div>
        </FormSection>

        {/* Capacity & Pricing */}
        <FormSection title="Capacity & pricing">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Total seats" id="totalSeats" error={errors.totalSeats?.message}>
              <input
                id="totalSeats"
                type="number"
                min="1"
                step="1"
                {...register('totalSeats', { valueAsNumber: true })}
                className={inputClassName}
              />
            </Field>

            <Field label="Ticket price (₹)" id="price" error={errors.price?.message}>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                className={inputClassName}
              />
            </Field>
          </div>

          <p className="text-xs leading-5 text-slate-500">Set the price to ₹0 for a free event.</p>
        </FormSection>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate('/organizer/events')}
            disabled={isCreating}
            className="min-h-11 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isCreating}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreating ? 'Creating event...' : 'Create event'}
          </button>
        </div>
      </form>
    </section>
  );
};

type FormSectionProps = {
  title: string;
  children: ReactNode;
};

const FormSection = ({ title, children }: FormSectionProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
};

type FieldProps = {
  label: string;
  id: string;
  error?: string;
  children: ReactNode;
};

const Field = ({ label, id, error, children }: FieldProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      {children}

      <FieldError message={error} />
    </div>
  );
};

type FieldErrorProps = {
  message?: string;
};

const FieldError = ({ message }: FieldErrorProps) => {
  if (!message) {
    return null;
  }

  return <p className="mt-1.5 text-sm text-rose-600">{message}</p>;
};

const formatCategory = (category: string) => {
  return category.toLowerCase().replace(/^\w/, (letter) => letter.toUpperCase());
};

export default CreateEventPage;
