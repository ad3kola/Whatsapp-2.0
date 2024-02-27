function Loading() {
	return (
	  <div className="bg-neutral-950 flex space-x-3 items-center justify-center h-screen text-gray-200 w-full">
		<p className="text-sm font-medium">Loading</p>
		<div
		  className="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent rounded-full "
		  role="status"
		  aria-label="loading"
		>
				<span className="sr-only"
				>Loading...</span>
		</div>
	  </div>
	);
  }
  
  export default Loading;
  