function Spinner() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-8 h-8 border-4 border-zinc-700 border-t-red-600 rounded-full animate-spin" />
    </div>
  );
}

export default Spinner;