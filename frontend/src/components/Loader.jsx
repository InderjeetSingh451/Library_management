import HashLoader from "react-spinners/HashLoader";

const Loader = () => {
  return (
    <div className="w-full h-full min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <HashLoader color="#3021f0" size={60} />
    </div>
  );
};

export default Loader;
