const PageFallback = () => {
  return (
    <div className="page-shell pb-24">
      <div className="layout-container space-y-4">
        <div className="section-card h-28 animate-pulse bg-slate-100" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="section-card h-48 animate-pulse bg-slate-100" />
          <div className="section-card h-48 animate-pulse bg-slate-100" />
        </div>
        <div className="section-card h-64 animate-pulse bg-slate-100" />
      </div>
    </div>
  );
};

export default PageFallback;
