import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, BookOpen } from "lucide-react";
import Button from "../components/common/ui/Button";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[60vh] text-center">

      {/* ICON */}
      <div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-red-50">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>

      {/* ERROR CODE */}
      <h1 className="text-5xl font-bold text-gray-900">404</h1>

      {/* MESSAGE */}
      <p className="max-w-md mt-3 text-base text-gray-600">
        The page you are looking for doesn’t exist or has been moved.
      </p>

      {/* ACTIONS */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">

        {/* BACK */}
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>

        {/* KNOWLEDGE BASE */}
        <Button
          onClick={() => navigate("/knowledge")}
          className="flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          Knowledge Base
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;