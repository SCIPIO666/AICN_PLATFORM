import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  BadgeCheck,
  ShieldAlert,
  Loader2,
  CalendarDays,
  Clock3,
  MapPin,
  Video,
  Building2,
  BrainCircuit,
  Award,
  User,
  Mail,
  Search,
  Database,
  Lock,
  CheckCircle2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useVerifyCertificate } from '@/hooks';
import { verifyCertificateSchema } from '@/validators/learner';
import Reveal from '@/components/Reveal';
import { fadeUp, staggerContainer, scaleUp, slideUp } from '@/utils/motion';
import PublicNavbar from '@/components/PublicNavbar';
const VerifyCertificate = () => {
  const [searchParams] = useSearchParams();
  // QR codes on the certificate PDF/email link here as /verify-certificate?code=CERT-XXXX
  const codeFromUrl = searchParams.get('code') || '';
  const [certCode, setCertCode] = useState(codeFromUrl);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm({
    resolver: zodResolver(verifyCertificateSchema),
    defaultValues: {
      certCode: codeFromUrl
    }
  });
  const { 
    data, 
    isLoading, 
    error, 
    isSuccess, 
    isError, 
    refetch 
  } = useVerifyCertificate(certCode);

  // Deep-link support: if a ?code= param is present (e.g. from a scanned QR
  // code), pre-fill the input and kick off verification automatically
  // instead of waiting for the visitor to type/paste the code manually.
  useEffect(() => {
    if (codeFromUrl) {
      setValue('certCode', codeFromUrl);
      setCertCode(codeFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeFromUrl]);

  useEffect(() => {
    if (certCode) {
      refetch();
    }
  }, [certCode, refetch]);

  const onSubmit = (validatedData) => {

    setCertCode(validatedData.certCode);
  };

  const handleReset = () => {
    reset();
    setCertCode('');
  };

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

  const getErrorMessage = () => {
    if (!error) return null;
    
    if (error.response?.status === 404) {
      return 'The certificate code provided does not exist in the AICN registry.';
    }
    if (error.response?.status === 400) {
      return 'Invalid certificate format. Please check the code and try again.';
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An error occurred while verifying the certificate. Please try again.';
  };

  const errorMessage = getErrorMessage();

  const isRevoked = !!data?.revokedAt;

  const trustStats = [
    { value: '500+', label: 'Certificates Issued', icon: Award },
    { value: '100%', label: 'Authentic Records', icon: ShieldCheck },
    { value: '24/7', label: 'Verification', icon: Clock3 }
  ];

  const howItWorks = [
    { icon: Search, title: 'Enter Certificate Code', description: 'Paste or type your unique certificate code' },
    { icon: ShieldCheck, title: 'Verify Authenticity', description: 'We check against the AICN registry' },
    { icon: Award, title: 'View Credential Details', description: 'See the full certificate information' }
  ];

  const securityBadges = [
    { icon: ShieldCheck, label: 'Issuer Verified' },
    { icon: Database, label: 'Record Exists In Registry' },
    { icon: Lock, label: 'Certificate Not Revoked' }
  ];

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 lg:px-12" style={{ background: 'var(--bg-page)' }}>
      <PublicNavbar/>
      <div className="max-w-5xl mx-auto">
        
        {/* HERO */}
        <section className="relative overflow-hidden mb-12 text-center">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full"
            style={{
              background: 'var(--color-neon-volt)',
              filter: 'blur(180px)',
              opacity: 0.08
            }}
          />
          
          <div className="relative">
            <Reveal variant={fadeUp}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 border" style={{
                borderColor: 'var(--color-neon-volt)',
                background: 'rgba(250,255,105,0.05)'
              }}>
                <ShieldCheck size={16} style={{ color: 'var(--color-neon-volt)' }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-neon-volt)' }}>
                  Certificate Verification
                </span>
              </div>
            </Reveal>

            <Reveal variant={fadeUp} delay={0.1}>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Certificates
                <br />
                <span style={{ color: 'var(--color-neon-volt)' }}>Issued By AICN</span>
              </h1>
            </Reveal>

            <Reveal variant={fadeUp} delay={0.2}>
              <p className="text-body-large mt-4 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Instantly validate learner achievements and training completion
              </p>
            </Reveal>

            {/* Stats */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8"
            >
              {trustStats.map((stat, idx) => (
                <Reveal key={stat.label} variant={fadeUp} delay={0.3 + idx * 0.1}>
                  <div className="card-base p-4 text-center">
                    <stat.icon size={20} className="mx-auto mb-1" style={{ color: 'var(--color-neon-volt)' }} />
                    <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {stat.value}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {stat.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </motion.div>
          </div>
        </section>

        {/* SEARCH CARD */}
        <Reveal variant={scaleUp}>
          <div className="card-base p-6 md:p-8 max-w-3xl mx-auto mb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="certCode" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Certificate Code
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      {...register('certCode')}
                      id="certCode"
                      type="text"
                      placeholder="CERT-XXXXXXXXXXXXXXXX"
                      className="w-full h-14 px-5 rounded-xl font-mono tracking-wider text-center text-lg border transition-all focus:outline-none"
                      style={{
                        background: 'var(--input-bg)',
                        borderColor: errors.certCode ? 'var(--error-border)' : 'var(--border-subtle)',
                        color: 'var(--text-primary)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-neon-volt)';
                        e.target.style.boxShadow = '0 0 0 4px rgba(250,255,105,0.1)';
                      }}
                      onBlur={(e) => {
                        if (!errors.certCode) {
                          e.target.style.borderColor = 'var(--border-subtle)';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                      disabled={isLoading}
                      autoComplete="off"
                      spellCheck="false"
                    />
                    {errors.certCode && (
                      <p className="mt-2 text-sm flex items-center gap-1" style={{ color: 'var(--error-text)' }}>
                        <ShieldAlert size={16} />
                        {errors.certCode.message}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-neon px-6 py-3 font-semibold rounded-xl flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={20} />
                          Verify Certificate
                        </>
                      )}
                    </button>
                    {(data || isError) && (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-4 py-3 rounded-xl btn-secondary"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Reveal>

        {/* EMPTY STATE */}
        {!isLoading && !isSuccess && !isError && !data && (
          <Reveal variant={fadeUp}>
            <div className="card-base p-8 md:p-10 max-w-3xl mx-auto">
              <h3 className="text-xl font-bold text-center mb-6" style={{ color: 'var(--text-primary)' }}>
                How Verification Works
              </h3>
              <div className="grid md:grid-cols-3 gap-6 relative">
                {howItWorks.map((step, idx) => (
                  <div key={idx} className="text-center relative">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                      style={{
                        background: 'rgba(250,255,105,0.08)',
                        border: '1px solid var(--color-neon-volt)'
                      }}
                    >
                      <step.icon size={24} style={{ color: 'var(--color-neon-volt)' }} />
                    </div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {step.title}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {step.description}
                    </p>
                    {idx < 2 && (
                      <ChevronRight 
                        size={16} 
                        className="hidden md:block absolute -right-1 top-1/2 -translate-y-1/2" 
                        style={{ color: 'var(--text-muted)' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* LOADING STATE */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-base p-12 text-center max-w-3xl mx-auto"
          >
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={48} className="animate-spin" style={{ color: 'var(--color-neon-volt)' }} />
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Checking Authenticity...
              </h3>
              <div className="space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                <p className="flex items-center gap-2 justify-center">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--color-neon-volt)' }} />
                  Cross-referencing records
                </p>
                <p className="flex items-center gap-2 justify-center">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--color-neon-volt)' }} />
                  Validating credential integrity
                </p>
                <p className="flex items-center gap-2 justify-center">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--color-neon-volt)' }} />
                  Verifying issuer signature
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ERROR STATE */}
        {isError && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-base p-8 max-w-3xl mx-auto"
            style={{
              borderColor: 'var(--error-border)',
              background: 'var(--error-bg)'
            }}
          >
            <div className="flex flex-col items-center text-center">
              <ShieldAlert size={56} className="mb-4" style={{ color: 'var(--error-text)' }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--error-text)' }}>
                Unable To Verify Credential
              </h3>
              <p className="text-sm max-w-md" style={{ color: 'var(--text-secondary)' }}>
                {errorMessage || 'The certificate could not be verified. Please check the code and try again.'}
              </p>
              <button
                onClick={handleReset}
                className="mt-6 px-6 py-2.5 rounded-lg font-semibold btn-primary"
              >
                Try Another Code
              </button>
            </div>
          </motion.div>
        )}

        {/* SUCCESS STATE */}
        {isSuccess && data && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Success Banner */}
            <Reveal variant={scaleUp}>
              <div className={`card-neon p-6 md:p-8 text-center relative overflow-hidden ${isRevoked ? 'border-red-500' : ''}`}>
                <div
                  className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
                  style={{
                    background: isRevoked ? 'var(--error-text)' : 'var(--color-neon-volt)',
                    filter: 'blur(60px)'
                  }}
                />
                <div className="relative">
                  {isRevoked ? (
                    <ShieldAlert size={64} className="mx-auto mb-4" style={{ color: 'var(--error-text)' }} />
                  ) : (
                    <CheckCircle2 size={64} className="mx-auto mb-4" style={{ color: 'var(--color-neon-volt)' }} />
                  )}
                  <h2 className="text-2xl font-bold" style={{ color: isRevoked ? 'var(--error-text)' : 'var(--text-primary)' }}>
                    {isRevoked ? 'Certificate Revoked' : 'Verified Credential'}
                  </h2>
                  <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
                    {isRevoked 
                      ? 'This certificate has been revoked and is no longer valid.'
                      : 'This certificate is authentic and has been successfully verified.'
                    }
                  </p>
                  {!isRevoked && (
                    <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full" style={{
                      background: 'rgba(250,255,105,0.08)',
                      border: '1px solid var(--color-neon-volt)'
                    }}>
                      <BadgeCheck size={16} style={{ color: 'var(--color-neon-volt)' }} />
                      <span className="text-xs font-semibold" style={{ color: 'var(--color-neon-volt)' }}>
                        Verified By AICN Registry
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>

            {/* Certificate Card */}
            <Reveal variant={slideUp}>
              <div className="card-base p-6 md:p-8">
                <div className="border-b pb-4 mb-6" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--color-forest-green)' }}
                    >
                      <Award size={20} style={{ color: 'var(--color-neon-volt)' }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-neon-volt)' }}>
                        AICN Certification
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {isRevoked ? 'Revoked Credential' : 'Verified Digital Credential'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Cert Code */}
                  <div className="col-span-full">
                    <div className="p-4 rounded-lg text-center" style={{
                      background: 'rgba(250,255,105,0.05)',
                      border: '1px solid var(--border-color)'
                    }}>
                      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                        Certificate ID
                      </p>
                      <p className="font-mono text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {data.certCode}
                      </p>
                      {data.issuedAt && (
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                          Issued: {formatDateTime(data.issuedAt)}
                        </p>
                      )}
                      {data.revokedAt && (
                        <p className="text-xs mt-1" style={{ color: 'var(--error-text)' }}>
                          Revoked: {formatDateTime(data.revokedAt)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Recipient */}
                  <div className="card-base p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, var(--color-forest-green), var(--color-neon-volt))',
                          color: 'var(--color-pure-black)'
                        }}
                      >
                        {data.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {data.user?.name || 'N/A'}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          <Mail size={12} className="inline mr-1" />
                          {data.user?.email || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="card-base p-4 flex items-center gap-3">
                    {isRevoked ? (
                      <ShieldAlert size={20} style={{ color: 'var(--error-text)' }} />
                    ) : (
                      <BadgeCheck size={20} style={{ color: 'var(--color-neon-volt)' }} />
                    )}
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Status</p>
                      <p className="text-sm font-semibold" style={{ color: isRevoked ? 'var(--error-text)' : 'var(--success-text)' }}>
                        {isRevoked ? 'Revoked' : 'Active'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Session Details */}
                {data.session && (
                  <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                      Session Information
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="card-base p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <BrainCircuit size={16} style={{ color: 'var(--color-neon-volt)' }} />
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Skill Area</p>
                        </div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {data.session.skillArea || 'N/A'}
                        </p>
                      </div>

                      <div className="card-base p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock3 size={16} style={{ color: 'var(--color-neon-volt)' }} />
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Date & Duration</p>
                        </div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {formatDate(data.session.date)}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {data.session.durationMins} minutes
                        </p>
                      </div>

                      <div className="card-base p-4">
                        <div className="flex items-center gap-2 mb-1">
                          {data.session.locationType === 'PHYSICAL' ? (
                            <Building2 size={16} style={{ color: 'var(--color-neon-volt)' }} />
                          ) : (
                            <Video size={16} style={{ color: 'var(--color-neon-volt)' }} />
                          )}
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Location</p>
                        </div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {data.session.locationType === 'PHYSICAL' ? 'In-Person' : 'Online'}
                        </p>
                        {data.session.venue && (
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {data.session.venue}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {data.session.description && (
                      <div className="mt-4 p-4 rounded-lg" style={{
                        background: 'rgba(250,255,105,0.03)',
                        border: '1px solid var(--border-color)'
                      }}>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {data.session.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Reveal>

            {/* Security Trust */}
            {!isRevoked && (
              <Reveal variant={fadeUp}>
                <div className="card-base p-6">
                  <h4 className="text-sm font-semibold text-center mb-4" style={{ color: 'var(--text-primary)' }}>
                    Why This Verification Matters
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {securityBadges.map((badge) => (
                      <div key={badge.label} className="flex items-center justify-center gap-2">
                        <badge.icon size={16} style={{ color: 'var(--color-neon-volt)' }} />
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {badge.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-2">
              <button
                onClick={handleReset}
                className="btn-secondary px-6 py-2.5 rounded-xl w-full sm:w-auto"
              >
                Verify Another Certificate
              </button>
              <button
                onClick={() => window.print()}
                className="btn-primary px-6 py-2.5 rounded-xl w-full sm:w-auto flex items-center gap-2"
              >
                <ExternalLink size={16} />
                Print Certificate Details
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificate;