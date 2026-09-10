const HomePage = () => {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-4xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Event Booking Platform
        </p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
          Discover and book your next event
        </h1>

        <p className="mx-auto mt-5 text-base leading-7 text-gray-600 sm:text-lg">
          Find exciting events, reserve your tickets, and manage your
          bookings from one place.
        </p>
      </div>
    </section>
  );
};

export default HomePage;