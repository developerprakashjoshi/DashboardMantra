const PageSliderLoader = ({ initialProgress, progress }:{initialProgress:any,progress:any}) => (
  <div className="fixed top-0 left-0 right-0 z-50">
    <div className="h-2 bg-blue-500">
      <div className="h-full bg-white" style={{ width: `${progress}%`, minWidth: `${initialProgress}%` }}></div>
    </div>
  </div>
);

export default PageSliderLoader;