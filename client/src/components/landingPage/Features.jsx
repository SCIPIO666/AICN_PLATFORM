     import image from '../../public/heroe4.jpg'
     import image2   from  '../../public/heroe3.jpg'
     import image3   from   '../../public/thought-catalog-505eectW54k-unsplash.jpg'
export default function Features() {
  const features = [
    {
      title: 'Live Training',
      desc: 'Attend instructor-led sessions.',
      url: image2

    },
    {
      title: 'Certificates',
      desc: 'Earn verified certificates.',
      url: image

    },
    {
      title: 'Expert Trainers',
      desc: 'Learn from professionals.',
      url: image3


    }
  ];

  return (
    <section className="space-y-8">

      <div className="text-center">

        <p className="label-uppercase">
          Features
        </p>

        <h2
          className="
            text-feature-heading
            font-bold
          "
        >
          Everything You Need To Learn
        </h2>

      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {features.map((feature) => (
          <div
            key={feature.title}
            className="card-inset p-6"
          >
            <h3
              className="
                text-feature-title
                font-semibold
              "
            >
              {feature.title}
            </h3>

            <p
              className="mt-3"
              style={{
                color: 'var(--text-secondary)'
              }}
            >
              {feature.desc}
            </p>
            <img src={feature.url} className='' alt='feature image'/>

          </div>
        ))}

      </div>

    </section>
  );
}