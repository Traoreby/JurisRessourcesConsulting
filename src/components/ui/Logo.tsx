import Image from "next/image";

interface LogoProps {
  className?: string;
  variant?: "default" | "white";
  showText?: boolean;
}

export function Logo({ className = "", variant = "default", showText = true }: LogoProps) {
  const logoSrc = "/logo/logo.png";

  return (
    <a href="/" className={`flex items-center gap-3 md:gap-5 ${className}`}>
      <div className="relative h-16 w-16 md:h-24 md:w-24 shrink-0 transition-transform duration-300 hover:scale-[1.02]">
        <Image 
          src={logoSrc} 
          alt="Juris Ressources Consulting Logo" 
          fill 
          sizes="(max-width: 768px) 64px, 96px"
          className="object-contain scale-[1.3] md:scale-[1.4]"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight leading-none ${variant === 'white' ? 'text-white' : 'text-primary'}`}>
            Juris Ressources
          </span>
          <span className={`text-sm md:text-base font-semibold tracking-widest uppercase mt-1 ${variant === 'white' ? 'text-gray-300' : 'text-accent'}`}>
            Consulting
          </span>
        </div>
      )}
    </a>
  );
}
