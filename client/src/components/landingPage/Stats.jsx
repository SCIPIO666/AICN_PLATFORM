export default function Stats() {
  const stats = [
    {
      value: '98%',
      label: 'Satisfaction'
    },
    {
      value: '50,000',
      label: 'Happy Students'
    },
    {
      value: '4,000',
      label: 'Classes Monthly'
    }
  ];

  return (
    <div
      className="
        border-t
        border-default
        grid
        md:grid-cols-3
      "
    >
      {stats.map((item) => (
        <div
          key={item.label}
          className="p-6"
        >
          <h3
            className="
              text-sub-heading
              font-bold
            "
          >
            {item.value}
          </h3>

          <p
            className="text-caption"
            style={{ color: 'var(--text-secondary)' }}
          >
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}