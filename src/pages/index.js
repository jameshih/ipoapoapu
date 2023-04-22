import { useState } from 'react';

export default function Home() {
  const [address, setAddress] = useState('');
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?address=${address}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter an address"
        className="px-4 py-2 rounded-md border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
      />
      <button
        onClick={handleSearch}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
      >
        Search
      </button>
      {isLoading && (
        <div className="flex mt-4 space-x-4">
          <div className="w-8 h-8 animate-pulse bg-gray-500 rounded-full"></div>
          <div className="w-8 h-8 animate-pulse bg-gray-500 rounded-full"></div>
          <div className="w-8 h-8 animate-pulse bg-gray-500 rounded-full"></div>
        </div>
      )}
      {!isLoading && result.length > 0 && (
        <div className="flex mt-4 space-x-4">
          {result.map((item) => (
            <div key={item.ownerId} className="relative">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600">
                <span className="text-white font-bold text-sm">
                  {item.ownerId}
                </span>
              </div>
              <div className="absolute top-12 -left-8">
                {item.eventIds.map((eventId) => (
                  <div
                    key={eventId}
                    className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600"
                  >
                    <span className="text-white font-bold text-sm">
                      {eventId}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {!isLoading && result.length === 0 && (
        <div className="mt-4 text-gray-500">No results found.</div>
      )}
    </div>
  );
}
