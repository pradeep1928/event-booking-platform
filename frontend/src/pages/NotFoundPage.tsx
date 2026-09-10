const NotFoundPage = () => {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold tracking-tight text-gray-900 sm:text-8xl">
          404
        </p>

        <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
          Page not found
        </h1>

        <p className="mt-3 text-sm text-gray-600 sm:text-base">
          The page you're looking for doesn't exist.
        </p>
      </div>
    </main>
  );
};

export default NotFoundPage;