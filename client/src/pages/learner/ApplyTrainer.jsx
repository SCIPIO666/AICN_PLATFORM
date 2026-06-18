import { applyTrainerSchema } from "@/validators/learner";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApplyAsTrainer, useMyTrainerProfile } from "@/hooks";
import {
  GraduationCap,
  UserRound,
  Code2,
  CalendarDays,
  HeartHandshake,
  Clock3,
  BadgeCheck,
  ShieldAlert,
  Award,
  Users,
  TrendingUp,
  Send,
  Loader2,
  RefreshCw
} from "lucide-react";

export default function ApplyTrainer() {
  const { mutate, isPending, isError, error } = useApplyAsTrainer();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: {
      errors,
      isSubmitting,
      isDirty,
      isValid,
    }
  } = useForm({
    resolver: zodResolver(applyTrainerSchema),
    defaultValues: {
      bio: "",
      skills: [],
      availability: "",
      motivation: ""
    }
  });

  const onSubmit = (validatedData) => {
    const formattedData = {
      ...validatedData,
      skills: typeof validatedData.skills === 'string'
        ? validatedData.skills.split(',').map(s => s.trim()).filter(Boolean)
        : validatedData.skills
    };
    mutate(formattedData);
  };

  const { data, isFetching, isError: isProfileError, error: profileError, refetch } = useMyTrainerProfile();

  const handleReapply = () => {
    reset({
      bio: "",
      skills: [],
      availability: "",
      motivation: ""
    });
    document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderStatus = () => {
    if (isFetching) {
      return (
        <div className="card-neon p-6 mb-8 flex items-center justify-center gap-3">
          <Loader2 className="animate-spin text-neon-volt" size={24} />
          <span className="text-secondary">Loading Trainer Status...</span>
        </div>
      );
    }

    if (isProfileError) {
      return (
        <div className="card-base p-6 mb-8 border border-red-500/20 bg-red-500/5">
          <div className="flex items-start gap-4">
            <ShieldAlert className="text-red-500 mt-0.5" size={24} />
            <div className="flex-1">
              <p className="label-uppercase text-red-500">Error</p>
              <h3 className="text-sub-heading font-bold text-red-400 mt-1">
                Failed to Load Status
              </h3>
              <p className="text-secondary mt-2">
                {profileError?.message || 'Unable to fetch trainer profile status'}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-3 text-neon-volt hover:text-neon-volt/80 font-medium flex items-center gap-2 text-sm"
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (!data) {
      return null;
    }

    if (data.status === 'PENDING') {
      return (
        <div className="card-neon p-6 mb-8 border-neon-volt/20">
          <div className="flex gap-4 items-start">
            <Clock3 size={28} className="text-neon-volt flex-shrink-0 mt-1" />
            <div>
              <p className="label-uppercase text-neon-volt">Under Review</p>
              <h3 className="text-sub-heading font-bold mt-1">Application Pending</h3>
              <p className="text-secondary mt-2">
                Our team is reviewing your qualifications. You'll receive a notification once a decision is made.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-volt rounded-full animate-pulse" />
                <span className="text-micro text-muted">Review in progress</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (data.status === 'APPROVED') {
      return (
        <div className="card-base p-6 mb-8 border-forest-green/30 bg-forest-green/5">
          <div className="flex gap-4 items-start">
            <BadgeCheck size={28} className="text-forest-green flex-shrink-0 mt-1" />
            <div>
              <p className="label-uppercase text-forest-green">Approved</p>
              <h3 className="text-sub-heading font-bold mt-1">Welcome, Trainer!</h3>
              <p className="text-secondary mt-2">
                Your profile is active and ready. You can now start creating sessions and mentoring learners.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-forest-green/20 text-forest-green border border-forest-green/30">
                  {data.skills?.length || 0} Skills Listed
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-forest-green/20 text-forest-green border border-forest-green/30">
                  Active Status
                </span>
              </div>
              <button
                onClick={() => window.location.href = '/trainer/dashboard'}
                className="mt-4 btn-primary px-6 py-2 text-sm"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (data.status === 'REJECTED') {
      return (
        <div className="card-base p-6 mb-8 border-red-500/20 bg-red-500/5">
          <div className="flex gap-4 items-start">
            <ShieldAlert size={28} className="text-red-500 flex-shrink-0 mt-1" />
            <div>
              <p className="label-uppercase text-red-500">Not Approved</p>
              <h3 className="text-sub-heading font-bold mt-1">Application Declined</h3>
              <p className="text-secondary mt-2">
                We appreciate your interest. Your application was not approved at this time.
              </p>
              <div className="mt-3 p-3 rounded-md bg-white/5 border border-red-500/10">
                <p className="text-sm text-muted">
                  <span className="font-medium text-red-400">Feedback:</span> We encourage you to gain more experience and reapply in the future.
                </p>
              </div>
              <button
                onClick={handleReapply}
                className="mt-4 btn-primary px-6 py-2 text-sm flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Reapply Now
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const shouldShowForm = !data || data.status === 'REJECTED';

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="
            mx-auto
            w-16 h-16
            rounded-card
            bg-forest-green
            border border-border-olive
            flex items-center justify-center
            shadow-elevated
            mb-5
          ">
            <GraduationCap size={28} className="text-white" />
          </div>

          <p className="label-uppercase text-neon-volt">
            Trainer Program
          </p>

          <h1 className="
            text-feature-heading
            font-black
            mt-3
            text-balance
          ">
            Become A Certified Trainer
          </h1>

          <p className="
            text-body-large
            max-w-xl
            mx-auto
            mt-3
            text-secondary
          ">
            Share expertise, mentor learners and
            grow your professional influence.
          </p>
        </div>

        {/* Status Display */}
        {renderStatus()}

        {/* Benefits Panel */}
        <div className="card-inset p-5 mb-8">
          <p className="label-uppercase text-neon-volt">Why Become A Trainer?</p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-start gap-3 p-3 rounded-md bg-white/5">
              <Users size={18} className="text-neon-volt flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold">Mentor Learners</h4>
                <p className="text-micro text-muted">Shape the next generation of tech talent</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-md bg-white/5">
              <Award size={18} className="text-neon-volt flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold">Build Reputation</h4>
                <p className="text-micro text-muted">Establish yourself as an industry expert</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-md bg-white/5">
              <TrendingUp size={18} className="text-neon-volt flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold">Grow Career</h4>
                <p className="text-micro text-muted">Unlock new opportunities and connections</p>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        {shouldShowForm && (
          <form
            id="application-form"
            className="
              card-base
              p-8
              lg:p-10
              shadow-elevated
              space-y-6
            "
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Form Header */}
            <div className="mb-8 pb-6 border-b border-border-subtle">
              <p className="label-uppercase text-neon-volt">Trainer Application</p>
              <h2 className="text-sub-heading font-bold mt-2">Professional Profile</h2>
              <p className="text-secondary text-sm mt-1">Complete your profile to apply for the trainer program</p>
            </div>

            {/* Professional Bio */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 label-uppercase">
                <UserRound size={14} className="text-neon-volt" />
                Professional Bio
              </label>
              <textarea
                {...register('bio')}
                id="bio"
                rows="4"
                required
                className="input-themed block w-full px-3 py-2.5 text-sm resize-y"
                placeholder="Tell us about your experience and background..."
              />
              <p className="text-micro text-muted">
                Brief overview of your professional journey and expertise.
              </p>
              {errors.bio && <span className="text-red-500 text-sm">{errors.bio.message}</span>}
            </div>

            {/* Technical Skills */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 label-uppercase">
                <Code2 size={14} className="text-neon-volt" />
                Technical Skills
              </label>
              <input
                {...register('skills')}
                type="text"
                id="skills"
                required
                className="input-themed block w-full px-3 py-2.5 text-sm"
                placeholder="e.g., JavaScript, React, Node.js"
              />
              <div className="card-inset p-3 mt-2">
                <p className="text-micro text-muted">
                  <span className="font-medium">Examples:</span> React • JavaScript • Node.js • Docker • PostgreSQL
                </p>
              </div>
              {errors.skills && <span className="text-red-500 text-sm">{errors.skills.message}</span>}
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 label-uppercase">
                <CalendarDays size={14} className="text-neon-volt" />
                Availability
              </label>
              <select
                {...register('availability')}
                id="availability"
                required
                className="select-themed block w-full"
              >
                <option value="">Select your availability</option>
                <option value="Weekends only">Weekends only</option>
                <option value="Evenings">Evenings</option>
                <option value="Weekends and evenings">Weekends and evenings</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Full-time">Full-time</option>
              </select>
              {errors.availability && <span className="text-red-500 text-sm">{errors.availability.message}</span>}
            </div>

            {/* Motivation */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 label-uppercase">
                <HeartHandshake size={14} className="text-neon-volt" />
                Why do you want to become a trainer?
              </label>
              <textarea
                {...register('motivation')}
                id="motivation"
                rows="3"
                required
                className="input-themed block w-full px-3 py-2.5 text-sm resize-y"
                placeholder="Share your motivation and passion for teaching..."
              />
              {errors.motivation && <span className="text-red-500 text-sm">{errors.motivation.message}</span>}
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-border-subtle">
              <button
                type="submit"
                className="
                  btn-primary
                  w-full
                  py-4
                  text-body
                  font-semibold
                  flex
                  items-center
                  justify-center
                  gap-2
                "
                disabled={isPending || isSubmitting}
              >
                {isPending || isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Trainer Application
                  </>
                )}
              </button>

              {isError && (
                <p className="mt-3 text-red-500 text-sm text-center">
                  Error: {error?.message || 'Application failed. Please try again.'}
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}