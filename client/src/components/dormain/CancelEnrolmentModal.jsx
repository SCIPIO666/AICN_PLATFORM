import { useCancelEnrolment } from "@/hooks"
import { useEnrolmentUI } from "@/stores/enrolmentUIStore"
import { useState } from "react"
export default function CancelEnrolmentModal() {
  const { isModalOpen, modalMode, selectedEnrolment, closeModal } = useEnrolmentUI()
  const [reason, setReason] = useState('')

  const { mutate: cancelEnrolment, isPending } = useCancelEnrolment()

  if (!isModalOpen || modalMode !== 'cancel') return null

  const handleSubmit = () => {
    if (!reason.trim()) return

    cancelEnrolment(
      { enrolmentId: selectedEnrolment.id, reason },
      {
        onSuccess: () => closeModal()  
      }
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-red-600">Cancel Enrolment</h2>
        <p className="text-sm text-text-muted">
          Cancelling: <strong>{selectedEnrolment?.session?.title}</strong>
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for cancellation..."
          rows={4}
          className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
        />

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm"
          >
            {isPending ? 'Cancelling...' : 'Confirm'}
          </button>
          <button
            onClick={closeModal}
            disabled={isPending}
            className="flex-1 border py-2 rounded-lg text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}