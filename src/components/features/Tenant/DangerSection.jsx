// components/features/Tenant/DangerSection.jsx

import SectionCard from "./SectionCard";
import Button from "../../common/ui/Button";

const DangerSection = ({ onDelete }) => (
  <SectionCard title="Danger Zone" icon="alert">
    <Button variant="danger" onClick={onDelete}>
      Delete Workspace
    </Button>
  </SectionCard>
);

export default DangerSection;