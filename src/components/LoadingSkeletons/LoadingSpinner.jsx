import "@/../css/spinner.css";
const LoadingSpinner = () => {
    return (
        <div className="absolute top-1/2 right-0 left-0 bottom-1/2">
        <span className="rootLoadingSpinner"></span>
      </div>
    );
};

export default LoadingSpinner;