import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section
      className="
        card-neon
        p-12
        text-center
      "
    >
      <p className="label-uppercase">
        Get Started
      </p>

      <h2
        className="
          text-feature-heading
          font-bold
          mt-2
        "
      >
        Join Thousands Of Learners
      </h2>

      <Link
        className="
          btn-neon
          mt-6
        "
        to='/signup'
      >
        Create Account
      </Link>
    </section>
  );
}