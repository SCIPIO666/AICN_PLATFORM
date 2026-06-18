import { applyTrainerSchema } from "@/validators/learner";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApplyAsTrainer } from "@/hooks";

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

  return (

    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
         style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto h-14 w-14 rounded-lg flex items-center justify-center mb-4"
               style={{ 
                 backgroundColor: 'var(--color-forest-green)',
                 border: '1px solid var(--color-border-olive)'
               }}>
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}>
            Become a Trainer
          </h1>
          <p className="mt-2 text-base"
             style={{ color: 'var(--text-secondary)' }}>
            Share your expertise and help shape the next generation of tech talent.
          </p>
        </div>

        <form 
          className="space-y-6 rounded-lg p-6 sm:p-8"
          style={{ 
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-subtle)'
          }}
          onSubmit={handleSubmit(onSubmit)} 
        >
          {/* Professional Bio */}
          <div>
            <label htmlFor="bio" 
                   className="block text-sm font-semibold mb-1.5"
                   style={{ color: 'var(--text-primary)' }}>
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
            <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              Brief overview of your professional journey and expertise.
            </p>
            {errors.bio && <span className="text-red-500 text-sm">{errors.bio.message}</span>}
          </div>

          {/* Technical Skills */}
          <div>
            <label htmlFor="skills" 
                   className="block text-sm font-semibold mb-1.5"
                   style={{ color: 'var(--text-primary)' }}>
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
            <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              Separate multiple skills with commas
            </p>
            {errors.skills && <span className="text-red-500 text-sm">{errors.skills.message}</span>}
          </div>

          {/* Availability */}
          <div>
            <label htmlFor="availability" 
                   className="block text-sm font-semibold mb-1.5"
                   style={{ color: 'var(--text-primary)' }}>
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
          <div>
            <label htmlFor="motivation" 
                   className="block text-sm font-semibold mb-1.5"
                   style={{ color: 'var(--text-primary)' }}>
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

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-subtle)' }} />

          {/* Submit */}
          <div>
            <button 
              type="submit" 
              className="btn-primary w-full flex justify-center py-3 px-4 text-sm font-semibold"
              disabled={isPending || isSubmitting}  
            >
              {isPending || isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>

            {isError && (
              <p className="mt-2 text-red-500 text-sm text-center">
                Error: {error?.message || 'Application failed. Please try again.'}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}