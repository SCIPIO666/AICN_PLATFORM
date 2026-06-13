import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockAPI} from '../../mocks/sessions'
import useSessionFilters from '../../stores/sessionFilters';
import SessionCard from '../../components/cards/SessionCard';
import FilterBar from '../../components/dormain/FilterBar';
import Pagination from '../../components/ui/Pagination';
import Spinner from '../../components/ui/Spinner';
import { Button } from '@/components/ui/button';

export default function LearnerSessions() {
  const { filters, setFilters, resetFilters } = useSessionFilters();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['sessions', filters],
    queryFn: () => mockAPI.getSessions(filters),
    keepPreviousData: true,
  });

  const enrolMutation = useMutation({
    mutationFn: (sessionId) => mockAPI.enrolInSession(sessionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
  });

  useEffect(() => { refetch(); }, [filters, refetch]);

  if (isLoading) return <Spinner fullScreen />;
  if (error) return (
    <div className="text-center py-12">
      <p className="text-red-500 mb-4">Failed to load sessions</p>
      <Button onClick={() => refetch()}>Try Again</Button>
    </div>
  );

  const sessions = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display-hero font-bold">Browse Sessions</h1>
        <p className="text-body-large text-text-secondary mt-2">Discover and enrol in training sessions</p>
      </div>

      <FilterBar filters={filters} onFilterChange={setFilters} onReset={resetFilters} />

      <div className="text-caption text-text-muted">Found {pagination?.total || 0} sessions</div>

      {sessions.length === 0 ? (
        <div className="text-center py-12 card-base">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-feature-title font-bold">No sessions found</h3>
          <p className="text-text-muted mt-1">Try adjusting your filters</p>
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
              <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={(page) => setFilters({ page })} />
            </div>
          )}
        </>
      )}
    </div>
  );
}