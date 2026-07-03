import Card from '../ui/card';
import { Button } from '../ui/button';
import Input from '../ui/input';

const SKILL_AREAS = ['All', 'Programming', 'Frontend', 'Data Science', 'AI/ML', 'Design', 'Cloud'];
const LOCATION_TYPES = ['All', 'ONLINE', 'PHYSICAL'];

export default function FilterBar({ filters, onFilterChange, onReset }) {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value, page: 1 });
  };

  return (
    <Card variant="default">
      <Card.Body>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            label="Search"
            placeholder="Search by title..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
          />
          
          <div>
            <label className="block text-caption font-medium text-text-secondary mb-2">Skill Area</label>
            <select
              value={filters.skillArea || 'All'}
              onChange={(e) => handleChange('skillArea', e.target.value === 'All' ? '' : e.target.value)}
              className="w-full px-4 py-2.5 rounded-sharp bg-transparent border border-charcoal/50 text-text-primary focus:border-neon-volt focus:outline-none"
            >
              {SKILL_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-caption font-medium text-text-secondary mb-2">Location Type</label>
            <select
              value={filters.locationType || 'All'}
              onChange={(e) => handleChange('locationType', e.target.value === 'All' ? '' : e.target.value)}
              className="w-full px-4 py-2.5 rounded-sharp bg-transparent border border-charcoal/50 text-text-primary focus:border-neon-volt focus:outline-none"
            >
              {LOCATION_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-caption font-medium text-text-secondary mb-2">Show</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleChange('upcoming', true)}
                className={`flex-1 px-4 py-2.5 rounded-sharp border transition-all font-medium
                  ${filters.upcoming === true 
                    ? 'bg-neon-volt text-pure-black border-neon-volt' 
                    : 'bg-transparent border-charcoal/50 text-text-primary hover:bg-hover-gray'
                  }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => handleChange('upcoming', false)}
                className={`flex-1 px-4 py-2.5 rounded-sharp border transition-all font-medium
                  ${filters.upcoming === false 
                    ? 'bg-neon-volt text-pure-black border-neon-volt' 
                    : 'bg-transparent border-charcoal/50 text-text-primary hover:bg-hover-gray'
                  }`}
              >
                All
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onReset}>Clear Filters</Button>
        </div>
      </Card.Body>
    </Card>
  );
}