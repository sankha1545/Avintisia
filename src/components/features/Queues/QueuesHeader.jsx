// components/features/Queues/QueuesHeader.jsx

import Button from "../../common/ui/Button";

const QueuesHeader = ({ onCreate }) => (
  <div className="flex justify-between">
    <h1 className="text-xl font-bold">Queues</h1>
    <Button onClick={onCreate}>Create Queue</Button>
  </div>
);

export default QueuesHeader;