import Stats from './Stats';
import heoreimage from '../../public/heroe2.jpg'
import { Link } from 'react-router-dom';
export default function HeroSection() {
  return (
    <section className="card-base overflow-hidden">

      <div className="grid lg:grid-cols-2 min-h-[700px]">

        {/* LEFT */}

        <div className="p-12 lg:p-16 flex flex-col justify-center">

          <div className="space-y-8">

            <div>

              <div className="flex items-center gap-2 mb-4">

                <span className="text-yellow-400">
                  ★★★★★
                </span>

                <span
                  className="text-caption"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  4.9 / 500+ Happy Learners
                </span>

              </div>

              <h1
                className="
                  text-display-hero
                  font-bold
                  leading-none
                  text-balance
                "
              >
                Education Without Boundaries Starts Here
              </h1>

            </div>

            <p
              className="text-body-large max-w-xl"
              style={{ color: 'var(--text-secondary)' }}
            >
              Interactive online education platform
              designed for students, professionals
              and lifelong learners.
            </p>

            <Link className="btn-neon" to='sessions'>
              Start Learning →
            </Link>

          </div>
        </div>

        {/* RIGHT */}

        <div className="relative">

          <img
            src={heoreimage}
            alt=""
            className="
              h-full
              w-full
              object-cover
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-black/20
            "
          />
        </div>

      </div>

      <Stats />

    </section>
  );
}