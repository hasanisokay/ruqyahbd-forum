import LoadingCircle from "@/components/LoadingSkeletons/LoadingCircle";
import LoadingSpinner from "@/components/LoadingSkeletons/LoadingSpinner";

const RootLoading = () => {
  const randomNumber = Math.floor(Math.random() * 2);
  return randomNumber === 0 ? <LoadingCircle/> : <LoadingSpinner />
};

export default RootLoading;
