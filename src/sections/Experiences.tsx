import { Timeline } from "../components/Timeline";
import { experiences } from "../constants";
const Experiences = () => {
  return (
    <div className="w-full container mx-auto max-w-7xl">
      <Timeline data={experiences} />
    </div>
  );
};

export default Experiences;
