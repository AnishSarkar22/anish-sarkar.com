import HeroText from "../components/HeroText";
import { useMediaQuery } from "react-responsive";
// import { Particles } from "../components/Particles";
import StarsCanvas from "../components/StarsCanvas";



const Hero = () => {
  const isMobile = useMediaQuery({ maxWidth: 853 });
  return (
    <section
      className={`relative w-full overflow-hidden ${
        isMobile ? "min-h-screen" : "h-screen"
      }`}
    >
      {/* Video background at the very top */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className={`rotate-180 absolute -top-42 left-0 w-full ${
          isMobile ? "h-[450px] scale-150" : "h-full top-[-340px]"
        } object-cover -z-20 transition-all duration-300`}
        style={{ objectPosition: isMobile ? "top" : "center" }}
      >
        <source src="/videos/blackhole.webm" type="video/webm" />
      </video>

      <div className="relative flex flex-col h-full w-full">
        {/* <Particles
          className="absolute inset-0 pointer-events-none"
          quantity={100}
          ease={80}
          color={"#ffffff"}
          refresh
        /> */}
        <StarsCanvas className="absolute inset-0 -z-10" />

        <HeroText />
      </div>
    </section>
  );
};

export default Hero;
