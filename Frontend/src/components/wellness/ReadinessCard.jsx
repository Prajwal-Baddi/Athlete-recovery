export default function ReadinessCard({
  score,
}) {
  return (
    <div className="card">
      <h3 className="text-xl mb-6">
        Readiness Today
      </h3>

      <div className="flex items-center justify-center">
        <div
          className="
          w-48 h-48
          rounded-full
          border-[12px]
          border-green-500
          flex
          items-center
          justify-center
          text-5xl
          font-bold
          text-green-400"
        >
          {score}%
        </div>
      </div>

      <p className="text-center mt-6 text-apex-txt2">
        Ready For Training
      </p>
    </div>
  );
}