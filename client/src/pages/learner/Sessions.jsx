import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSessions } from '@/api/sessions';
import { enrolInSession } from '@/api/enrolments';
import useSessionFilters from '../../stores/sessionFilters';
import SessionCard from '../../components/dormain/SessionCard';
import FilterBar from '../../components/dormain/FilterBar';
import Pagination from '@/components/ui/Pagination';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import { Search, Filter, X, AlertCircle } from 'lucide-react';

export default function LearnerSessions() {
  const { filters, setFilters, resetFilters } = useSessionFilters();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['sessions', filters],
    queryFn: () => getSessions(filters),
    keepPreviousData: true,
  });

  const enrolMutation = useMutation({
    mutationFn: (sessionId) => enrolInSession(sessionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
  });

  useEffect(() => { refetch(); }, [filters, refetch]);

  if (isLoading) return <Spinner fullScreen />;
  if (error) return (
    <div className="text-center py-12">
      <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
      <p className="text-red-500 mb-4">Failed to load sessions</p>
      <Button onClick={() => refetch()}>Try Again</Button>
    </div>
  );

  const sessions = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="label-uppercase">
          Learning Portal
        </span>

        <h1 className="text-display-hero font-bold text-balance">
          Browse Sessions
        </h1>

        <p
          className="text-body-large"
          style={{ color: 'var(--text-secondary)' }}
        >
          Discover and enrol in training sessions
        </p>
      </div>
      
      <FilterBar filters={filters} onFilterChange={setFilters} onReset={resetFilters} />

      <div className="text-caption text-text-muted flex items-center gap-2">
        <Search size={14} />
        Found {pagination?.total || 0} sessions
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-12 card-base">
          <Search size={64} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-feature-title font-bold">No sessions found</h3>
          <p className="text-text-muted mt-1">Try adjusting your filters</p>
          <Button variant="ghost" onClick={resetFilters} className="mt-4">
            <X size={16} className="mr-2" />
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                onEnrol={(id) => enrolMutation.mutate(id)}
                isEnrolling={enrolMutation.isLoading && enrolMutation.variables === session.id}
              />
            ))}
          </div>
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination 
                currentPage={pagination.page} 
                totalPages={pagination.totalPages} 
                onPageChange={(page) => setFilters({ page })} 
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}