export default function ArchitectureBlock() {
  return (
    <div id="architecture" className="flex flex-col gap-12 py-12">
      {/* Title */}
      <div className="flex flex-col gap-8">
        <h2 className="font-display text-d2-mobile md:text-d2-tablet xl:text-d2-desktop tracking-[-2px] text-brand-vanilla">
          Architecture
        </h2>
        <p className="font-text text-b1 text-brand-vanilla/70 max-w-3xl">
          This website is structured to serve both as a landing page for humans and as a well-organized resource for AI agent interpretation. Think of it as our brand brain that will continue to grow and extend use cases over time.
        </p>
      </div>

      {/* Architecture Diagram */}
      <div className="w-full flex justify-center">
        <div className="bg-[#191919] p-[20%] rounded-2xl w-full max-w-5xl">
          <img
            src={`${import.meta.env.BASE_URL}architecture-diagram.png`}
            alt="Brand OS Architecture Diagram"
            className="w-full h-auto rounded-xl object-contain"
          />
        </div>
      </div>
    </div>
  )
}
