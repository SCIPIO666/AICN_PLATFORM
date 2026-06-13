export default function Footer() {
  return (
    <footer
      className="
        mt-16
        border-t
        border-default
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          py-8
          px-6
          flex
          justify-between
        "
      >
        <span className="font-bold">
          AICN Training
        </span>

        <span
          style={{
            color: 'var(--text-secondary)'
          }}
        >
          © 2026 All rights reserved
        </span>
      </div>
    </footer>
  );
}