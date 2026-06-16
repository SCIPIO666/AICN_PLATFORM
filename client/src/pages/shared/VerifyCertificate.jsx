import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { CheckCircle, XCircle, Loader2, FileCheck, Calendar, User, MapPin, Clock } from 'lucide-react';
import { useVerifyCertificate } from '@/hooks';

const VerifyCertificate = () => {
  const [certCode, setCertCode] = useState('');
  const [shouldVerify, setShouldVerify] = useState(false);

  const verifyCertificateSchema = z.object({
    certCode: z.string()
      .regex(/^CERT-[A-F0-9]{16}$/, 'Invalid certificate code format. Expected format: CERT-XXXXXXXXXXXXXXX')
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: zodResolver(verifyCertificateSchema),
    defaultValues: {
      certCode: ''
    }
  });

  // Use the existing hook
  const { 
    data: certData, 
    isLoading, 
    error: queryError, 
    isSuccess,
    isError,
    refetch
  } = useVerifyCertificate(shouldVerify ? certCode : null);

  const onSubmit = (data) => {
    setCertCode(data.certCode);
    setShouldVerify(true);
    // Trigger the query
    refetch();
  };

  const handleReset = () => {
    reset();
    setCertCode('');
    setShouldVerify(false);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get error message
  const getErrorMessage = () => {
    if (!queryError) return null;
    if (queryError.response?.status === 404) {
      return 'Certificate not found. Please check the code and try again.';
    }
    if (queryError.response?.status === 400) {
      return 'Invalid certificate format. Please check the code.';
    }
    if (queryError.message) {
      return queryError.message;
    }
    return 'An error occurred while verifying the certificate. Please try again.';
  };

  const errorMessage = getErrorMessage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-3">
          <FileCheck className="w-8 h-8 text-[#faff69]" />
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Verify Certificate
          </h1>
        </div>
        <p className="text-secondary text-base max-w-md mx-auto">
          Enter the certificate code to verify its authenticity and view details
        </p>
      </div>

      {/* Search Form */}
      <div className="card-base p-6 md:p-8 mb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="certCode" className="block text-sm font-medium text-secondary mb-2">
              Certificate Code
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  {...register('certCode')}
                  id="certCode"
                  type="text"
                  placeholder="CERT-XXXXXXXXXXXXXXXX"
                  className="w-full px-4 py-3 input-themed rounded-lg font-mono text-sm uppercase"
                  disabled={isLoading}
                  autoComplete="off"
                  spellCheck="false"
                  onChange={(e) => {
                    // Auto-uppercase the input
                    e.target.value = e.target.value.toUpperCase();
                  }}
                />
                {errors.certCode && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.certCode.message}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-[#faff69] text-black font-semibold rounded-lg hover:bg-[#e5e700] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Verify
                    </>
                  )}
                </button>
                {(certData || isError) && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-3 btn-secondary rounded-lg"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="card-base p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-[#faff69]" />
            <p className="text-secondary">Verifying certificate...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="card-base p-6 border-red-500/50 bg-red-50 dark:bg-red-950/20">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 dark:text-red-300 mb-1">
                Verification Failed
              </h3>
              <p className="text-red-700 dark:text-red-400 text-sm">
                {errorMessage}
              </p>
              <p className="text-red-600 dark:text-red-500 text-xs mt-2">
                Please check the certificate code and try again
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {isSuccess && certData && !isLoading && (
        <div className="space-y-6 animate-slide-in">
          {/* Success Banner */}
          <div className="card-base p-6 border-green-500/50 bg-green-50 dark:bg-green-950/20">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-green-800 dark:text-green-300">
                  Certificate is Valid!
                </h2>
                <p className="text-green-700 dark:text-green-400 text-sm">
                  This certificate has been verified and is authentic
                </p>
              </div>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="card-base p-6 md:p-8">
            <div className="border-b border-border-subtle pb-4 mb-4">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#faff69]" />
                Certificate Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Certificate Code */}
              <div className="col-span-full">
                <div className="bg-[#faff69]/10 dark:bg-[#faff69]/5 border border-[#faff69]/30 rounded-lg p-4">
                  <p className="text-xs uppercase tracking-wider text-secondary mb-1">
                    Certificate Code
                  </p>
                  <p className="font-mono text-lg font-semibold text-primary break-all">
                    {certData.certCode}
                  </p>
                </div>
              </div>

              {/* Recipient */}
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-secondary">
                  <User className="w-3 h-3 inline mr-1" />
                  Recipient
                </p>
                <p className="font-medium text-primary">{certData.user?.name || 'N/A'}</p>
                <p className="text-sm text-secondary">{certData.user?.email || 'N/A'}</p>
              </div>

              {/* Issued Date */}
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-secondary">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Issued Date
                </p>
                <p className="font-medium text-primary">{formatDateTime(certData.issuedAt)}</p>
              </div>

              {/* Session Details */}
              <div className="col-span-full">
                <div className="border-t border-border-subtle pt-4">
                  <h4 className="text-sm font-semibold text-primary mb-3">
                    Session Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-secondary">
                        Session Title
                      </p>
                      <p className="font-medium text-primary">{certData.session?.title || 'N/A'}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-secondary">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          Location
                        </p>
                        <p className="text-sm text-primary">
                          {certData.session?.locationType === 'PHYSICAL' ? '📍 In-Person' : '💻 Online'}
                          {certData.session?.venue && ` — ${certData.session.venue}`}
                        </p>
                        {certData.session?.county && (
                          <p className="text-xs text-secondary">{certData.session.county}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-secondary">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Date & Duration
                        </p>
                        <p className="text-sm text-primary">
                          {formatDate(certData.session?.date)}
                        </p>
                        <p className="text-xs text-secondary">
                          {certData.session?.durationMins} minutes
                        </p>
                      </div>
                    </div>

                    {certData.session?.skillArea && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-secondary">
                          Skill Area
                        </p>
                        <p className="text-sm text-primary">
                          <span className="inline-block px-2 py-0.5 bg-[#faff69]/20 text-[#faff69] rounded text-xs font-medium">
                            {certData.session.skillArea}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="col-span-full">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-700 dark:text-green-300">
                    Active & Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-2">
            <button
              onClick={handleReset}
              className="btn-secondary px-6 py-2.5 rounded-lg w-full sm:w-auto"
            >
              Verify Another Certificate
            </button>
            <button
              onClick={() => window.print()}
              className="btn-primary px-6 py-2.5 rounded-lg w-full sm:w-auto"
            >
              Print Certificate Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyCertificate;