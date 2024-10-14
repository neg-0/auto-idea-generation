import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Idea {
  id: number;
  title: string;
  description: string;
  created_at: string;
  iterations: string[];
  competitors: string[];
  goals: string[];
  artifacts: string[];
}

const IdeaDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/ideas/${id}`);
        setIdea(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch idea details');
        setLoading(false);
      }
    };

    fetchIdea();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!idea) return <div>Idea not found</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{idea.title}</h1>
      <p className="text-gray-600">{idea.description}</p>
      <p className="text-sm text-gray-500">Created: {new Date(idea.created_at).toLocaleDateString()}</p>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Iterations</h2>
        <ul className="list-disc pl-5">
          {idea.iterations.map((iteration, index) => (
            <li key={index}>{iteration}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Competitors</h2>
        <ul className="list-disc pl-5">
          {idea.competitors.map((competitor, index) => (
            <li key={index}>{competitor}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Goals</h2>
        <ul className="list-disc pl-5">
          {idea.goals.map((goal, index) => (
            <li key={index}>{goal}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Artifacts</h2>
        <ul className="list-disc pl-5">
          {idea.artifacts.map((artifact, index) => (
            <li key={index}>{artifact}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default IdeaDetails;