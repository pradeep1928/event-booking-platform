import type { ReactNode } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import type { EventCategory, EventFormValues } from './eventTypes';

const eventCategories = [
  'MUSIC',
  'SPORTS',
  'BUSINESS',
  'EDUCATION',
  'WORKSHOP',
  'CONFERENCE',
  'FESTIVAL',
  'OTHER',
] as const satisfies readonly EventCategory[];

const eventFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, 'Title must contain at least 3 characters')
      .max(150, 'Title cannot exceed 150 characters'),

    description: z.string().trim().max(2000, 'Description cannot exceed 2000 characters'),

    category: z.enum(eventCategories),

    venue: z.string().trim().min(3, 'Venue must contain at least 3 characters').max(200),

    city: z.string().trim().min(2, 'City is required').max(100),

    state: z.string().trim().min(2, 'State is required').max(100),

    country: z.string().trim().min(2, 'Country is required').max(100),

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

type EventFormProps = {
  defaultValues: EventFormValues;

  submitLabel: string;

  loadingLabel: string;

  isLoading: boolean;

  serverError?: string | null;

  onSubmit: SubmitHandler<EventFormValues>;

  onCancel: () => void;
};

const inputClassName =
  'mt-2 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

const EventForm = ({
  defaultValues,
  submitLabel,
  loadingLabel,
  isLoading,
  serverError,
  onSubmit,
  onCancel,
}: EventFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),

    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {serverError}
        </div>
      )}

      <FormSection title="Basic information">
        <Field label="Event title" id="title" error={errors.title?.message}>
          <input
            id="title"
            {...register('title')}
            className={inputClassName}
            placeholder="React Conference 2026"
          />
        </Field>

        <Field label="Description" id="description" error={errors.description?.message}>
          <textarea
            id="description"
            rows={5}
            {...register('description')}
            className={`${inputClassName} resize-y`}
            placeholder="Tell attendees what your event is about..."
          />
        </Field>

        <Field label="Category" id="category" error={errors.category?.message}>
          <select id="category" {...register('category')} className={inputClassName}>
            {eventCategories.map((category) => (
              <option key={category} value={category}>
                {formatLabel(category)}
              </option>
            ))}
          </select>
        </Field>
      </FormSection>

      <FormSection title="Location">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Venue" id="venue" error={errors.venue?.message}>
            <input id="venue" {...register('venue')} className={inputClassName} />
          </Field>

          <Field label="City" id="city" error={errors.city?.message}>
            <input id="city" {...register('city')} className={inputClassName} />
          </Field>

          <Field label="State" id="state" error={errors.state?.message}>
            <input id="state" {...register('state')} className={inputClassName} />
          </Field>

          <Field label="Country" id="country" error={errors.country?.message}>
            <input id="country" {...register('country')} className={inputClassName} />
          </Field>
        </div>
      </FormSection>

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

      <FormSection title="Capacity & pricing">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Total seats" id="totalSeats" error={errors.totalSeats?.message}>
            <input
              id="totalSeats"
              type="number"
              min="1"
              step="1"
              {...register('totalSeats', {
                valueAsNumber: true,
              })}
              className={inputClassName}
            />
          </Field>

          <Field label="Ticket price (₹)" id="price" error={errors.price?.message}>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              {...register('price', {
                valueAsNumber: true,
              })}
              className={inputClassName}
            />
          </Field>
        </div>
      </FormSection>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="min-h-11 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="min-h-11 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? loadingLabel : submitLabel}
        </button>
      </div>
    </form>
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

      {error && <p className="mt-1.5 text-sm text-rose-600">{error}</p>}
    </div>
  );
};

const formatLabel = (value: string) =>
  value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export default EventForm;
