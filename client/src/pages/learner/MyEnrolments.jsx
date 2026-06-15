import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelEnrolment,getMyEnrolments } from '@/api/enrolments';
import useSessionFilters from '../../stores/sessionFilters';
import EnlrolmentCard from '@/components/dormain/EnlrolmentCard';
import FilterBar from '../../components/dormain/FilterBar';
import Pagination from '@/components/ui/Pagination';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import { Search, Filter, X, AlertCircle } from 'lucide-react';
import { toast } from '@/stores/toastStore'
import CancelEnrolmentModal from '@/components/dormain/CancelEnrolmentModal';
export default function MyEnrolments() {
  const { filters, setFilters, resetFilters } = useSessionFilters();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['enrolments', filters],
    queryFn: () => getMyEnrolments(filters),
    keepPreviousData: true,
  });

const enrolMutation = useMutation({
  mutationFn: (sessionId) => cancelEnrolment(sessionId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['sessions'] })
    toast.success('enrolment cancelled successfully!')
  },
  onError: (error) => {
    toast.error(error.response?.data?.message || 'Failed to cancel enrolemnt')
  },
});

  useEffect(() => { refetch(); }, [filters, refetch]);

  if (isLoading) return <Spinner fullScreen />;
  if (error) return (
    <div className="text-center py-12">
      <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
      <p className="text-red-500 mb-4">Failed to load enrolments</p>
      <Button onClick={() => refetch()}>Try Again</Button>
    </div>
  );

  const enrolments = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="label-uppercase">
          Learning Portal
        </span>

        <h1 className="text-display-hero font-bold text-balance gradient-text">
          Enrolled Sessions
        </h1>

      </div>
      
      <FilterBar filters={filters} onFilterChange={setFilters} onReset={resetFilters} />

      <div className="text-caption text-text-muted flex items-center gap-2">
        <Search size={14} />
        Found {pagination?.total || 0} enrolments
      </div>

      {enrolments.length === 0 ? (
        <div className="text-center py-12 card-base">
          <Search size={64} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-feature-title font-bold">No enrolments found</h3>
          <p className="text-text-muted mt-1">Try adjusting your filters</p>
          <Button variant="ghost" onClick={resetFilters} className="mt-4">
            <X size={16} className="mr-2" />
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {enrolments.map(enrolment => (
              <EnlrolmentCard
                key={enrolment.id}
                enrolment={enrolment}
                onCancel={(id) => enrolMutation.mutate(id)}
                isCanceling={enrolMutation.isCanceling && enrolMutation.variables === enrolment.id}
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
           <CancelEnrolmentModal />
        </>
      )}
    </div>
  );
}