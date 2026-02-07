const generateLibraryId = () => {
  return "SRS" + Math.floor(100 + Math.random() * 900).toString();
};

export default generateLibraryId;
