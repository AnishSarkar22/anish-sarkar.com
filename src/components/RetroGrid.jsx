// NOT USED NOW

import { twMerge } from "tailwind-merge";
import PropTypes from "prop-types";

export function RetroGrid({
  className,
  angle = 65,
  cellSize = 60,
  opacity = 0.5,
  lightLineColor = "gray",
  darkLineColor = "gray",
  ...props
}) {
  const gridStyles = {
    "--grid-angle": `${angle}deg`,
    "--cell-size": `${cellSize}px`,
    "--opacity": opacity,
    "--light-line": lightLineColor,
    "--dark-line": darkLineColor,
  };

  return (
    <div
      className={twMerge(
        "pointer-events-none absolute inset-0 w-full h-full overflow-hidden [perspective:200px]",
        `opacity-[var(--opacity)]`,
        className
      )}
      style={gridStyles}
      {...props}
    >
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div className="animate-retro-grid [background-image:linear-gradient(to_right,var(--light-line)_1px,transparent_0),linear-gradient(to_bottom,var(--light-line)_1px,transparent_0)] [background-repeat:repeat] [background-size:var(--cell-size)_var(--cell-size)] [height:400vh] [inset:0%_0px] [margin-left:-100%] [transform-origin:50%_0_0] [width:300vw] dark:[background-image:linear-gradient(to_right,var(--dark-line)_1px,transparent_0),linear-gradient(to_bottom,var(--dark-line)_1px,transparent_0)]" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent to-70%" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/90" />
    </div>
  );
}

RetroGrid.propTypes = {
  className: PropTypes.string,
  angle: PropTypes.number,
  cellSize: PropTypes.number,
  opacity: PropTypes.number,
  lightLineColor: PropTypes.string,
  darkLineColor: PropTypes.string,
};
