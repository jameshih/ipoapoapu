import { useState } from 'react';
import Head from 'next/head';
//import fetch from 'isomorphic-unfetch';

const Circle = ({ text, color }) => (
  <div className={`h-8 w-8 flex items-center justify-center rounded-full bg-${color}-500 hover:bg-${color}-700 text-white font-bold text-sm cursor-pointer`}>
    <span className="hidden">{text}</span>
  </div>
);

const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

const ResultList = (owners ) => (
  <div className="my-4">
    {owners.length > 0 ? (
      owners.map((owner) => (
        <div key={owner.ownerId} className="flex items-center space-x-4 mb-4">
          <Circle text={owner.ownerId} color="orange" />
          {owner.events.map((event) => (
            <Circle key={event} text={event} color="blue" />
          ))}
        </div>
      ))
    ) : (
      <p>No result found.</p>
    )}
  </div>
);

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [owners, setOwners] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const query = e.target.elements.query.value;
    try {
      const res = await fetch(`/api/search?address=${query}`);
      setOwners(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSearch} className="flex">
        <input name="query" type="text" className="w-full border border-gray-400 py-2 px-3 rounded-l-lg" placeholder="Enter an ENS or Ethereum address" />
        <button type="submit" className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-r-lg">
          Search
        </button>
      </form>
      {loading ? <Loader /> : <ResultList owners={owners} />}
    </div>
  );
};

const Home = () => (
  <div>
    <Head>
      <title>ipoapoapu</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-8">
        <Search />
      </div>
    </div>
  </div>
);

export default Home;
