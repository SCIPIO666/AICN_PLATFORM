import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export default function Unauthorized() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">403 – Unauthorized</h1>
      <p className="mt-2 text-muted-foreground">You don't have permission to access this page.</p>
      <Button asChild className="mt-4">
        <Link to="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );
}