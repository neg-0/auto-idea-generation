import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Idea {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

const IdeaList: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/ideas');
        setIdeas(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch ideas');
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Generated Ideas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => (
          <Link key={idea.id} to={`/ideas/${idea.id}`} className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{idea.title}</h2>
              <p className="text-gray-600 mb-4">{idea.description.substring(0, 100)}...</p>
              <p className="text-sm text-gray-500">Created: {new Date(idea.created_at).toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default IdeaList;