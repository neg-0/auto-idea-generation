import React, { useState } from 'react';
import { PlusCircle, List, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  const generateNewIdea = async () => {
    setGenerating(true);
    try {
      const response = await axios.post('http://localhost:3002/api/generate');
      setGenerating(false);
      navigate(`/ideas/${response.data.id}`);
    } catch (error) {
      console.error('Error generating idea:', error);
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Generate New Idea"
          icon={<PlusCircle size={24} />}
          description="Start the autonomous idea generation process"
          action={generateNewIdea}
          loading={generating}
        />
        <DashboardCard
          title="View All Ideas"
          icon={<List size={24} />}
          description="Browse and manage generated ideas"
          action={() => navigate('/ideas')}
        />
        <DashboardCard
          title="Trending Topics"
          icon={<TrendingUp size={24} />}
          description="Explore current market trends"
          action={() => console.log('View trending topics')}
        />
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  action: () => void;
  loading?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon, description, action, loading }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <button
        onClick={action}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Get Started'}
      </button>
    </div>
  );
};

export default Dashboard;