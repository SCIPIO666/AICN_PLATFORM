import { useCancelEnrolment } from "@/hooks"
import { useEnrolmentUI } from "@/stores/enrolmentUIStore"
import { useState } from "react"
import { AlertTriangle, Calendar, Info, X } from "lucide-react"

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
    <div className="
        fixed inset-0
        modal-backdrop
        flex items-center justify-center
        z-50 p-4
    ">
        <div className="
            card-base
            w-full
            max-w-md
            p-6
            space-y-5
            shadow-elevated
            animate-in fade-in zoom-in duration-200
        ">
        {/* Header */}
        <div className="space-y-3">

        <div className="flex items-center gap-3">

            <div className="
            w-10 h-10
            rounded-pill
            bg-neon-volt
            flex items-center justify-center
            ">
            <AlertTriangle className="w-5 h-5 text-pure-black" />
            </div>

            <h2 className="
            text-feature-title
            font-bold
            text-primary
            ">
            Cancel Enrolment
            </h2>

        </div>

        <div className="border-t divider" />

        </div>
                
        {/* Content */}
        <div className="space-y-4">
          <p className="text-caption text-secondary">
            You are about to cancel your enrolment for:
          </p>
          <div className="card-inset p-4">

            <p className="
                text-body
                font-semibold
                text-primary
            ">
                {selectedEnrolment?.session?.title}
            </p>

            {selectedEnrolment?.session?.date && (
                <div className="
                text-micro
                text-muted
                mt-2
                flex items-center gap-1
                ">
                <Calendar className="w-3 h-3" />
                {selectedEnrolment.session.date}
                </div>
            )}

            </div>

          {/* Textarea */}
          <div className="space-y-2">
                <label className="label-uppercase">
                Reason For Cancellation
                <span className="ml-1 text-red-500">*</span>
                </label>
                <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="Please tell us why you're cancelling..."
                className="
                    input-themed
                    w-full
                    px-4
                    py-3
                    text-caption
                    resize-none
                "
                />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
            <button
            onClick={handleSubmit}
            disabled={isPending || !reason.trim()}
            className="
                btn-danger
                flex-1
                py-3
                text-caption
            "
            >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Cancelling...
              </span>
            ) : (
              'Confirm Cancellation'
            )}
          </button>
          
        <button
            onClick={closeModal}
            disabled={isPending}
            className="
                btn-secondary
                flex-1
                py-3
                text-caption
            "
            >
            Go Back
          </button>
        </div>

        {/* Warning note */}
       <div className="
            pt-3
            border-t
            divider
            ">

            <p className="
                text-micro
                text-muted
                flex items-center gap-2
            ">
                <Info className="w-3.5 h-3.5" />

                This action cannot be undone.
                Your spot will be released to other learners.
            </p>

        </div>
      </div>
    </div>
  )
}