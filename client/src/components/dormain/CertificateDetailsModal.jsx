import { useCertificateUI } from '@/stores/useCertificateUi'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Spinner from '../ui/Spinner';

export default function CertificateDetailsModal() {

      const { isModalOpen, modalMode, selectedCertificate, closeModal } = useCertificateUI()
      const queryClient = useQueryClient()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['sessions', filters],   
    queryFn: () => getSessions(filters), 
    keepPreviousData: true,
  })

  return (
    <div>CertificateDetailsModal</div>
  )
}
