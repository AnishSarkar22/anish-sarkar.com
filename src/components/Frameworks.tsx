import { OrbitingCircles } from "./OrbitingCircles";
import PropTypes from "prop-types";

export function Frameworks() {
  const skills = [
    // "bash",
    "git",
    "python",
    "java",
    "django",
    "flask",
    "fastapi",
    "tensorflow",
    "sqlite",
    "mysql",
    "postgresql",
    "docker",
    "fedora",
    "aws",
    // "html5",
    // "css3",
    "javascript",
    "react",
    "svelte",
    // "vitejs",
  ];
  return (
    <div className="relative flex h-[15rem] w-full flex-col items-center justify-center">
      <OrbitingCircles iconSize={40}>
        {skills.map((skill, index) => (
          <Icon key={index} src={`assets/logos/${skill}.svg`} />
        ))}
      </OrbitingCircles>
      <OrbitingCircles iconSize={25} radius={100} reverse speed={2}>
        {skills.reverse().map((skill, index) => (
          <Icon key={index} src={`assets/logos/${skill}.svg`} />
        ))}
      </OrbitingCircles>
    </div>
  );
}

const Icon = ({ src }) => (
  <img src={src} className="duration-200 rounded-sm hover:scale-110" />
);

Icon.propTypes = {
  src: PropTypes.string.isRequired,
};
