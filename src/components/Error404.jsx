import { useNavigate } from 'react-router-dom';

export default function Error404() {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-9xl font-bold text-blue-100">404</h1>
      <h2 className="text-3xl font-bold text-[var(--dark-blue)] -mt-10">Page Not Found</h2>
      <p className="text-gray-500 mt-4 max-w-sm">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <button 
        onClick={() => navigate('/')}
        className="btn-primary mt-8"
      >
        Back to Dashboard
      </button>
    </div>
  );
}