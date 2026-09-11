const PageLoader = () => {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center"
      role="status"
      aria-label="Loading page"
    >
      <div
        className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"
        aria-hidden="true"
      />
    </div>
  );
};

export default PageLoader;