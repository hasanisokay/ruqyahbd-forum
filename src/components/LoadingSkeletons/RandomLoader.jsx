import LoadingCircle from "./LoadingCircle";
import LoadingSpinner from "./LoadingSpinner";

const RandomLoader = () => {
    const randomNumber = Math.floor(Math.random() * 2);
    return randomNumber === 0 ? <LoadingCircle/> : <LoadingSpinner />
};

export default RandomLoader;