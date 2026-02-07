const Loader = () => {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-black/20 animate-ping absolute"></div>
        <div className="w-12 h-12 rounded-full border-4 border-black border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;
