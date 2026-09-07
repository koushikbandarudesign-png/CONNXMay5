import { ArrowLeft, Construction } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

export function PagePlaceholder({ title, description }: { title: string; description?: string }) {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="mb-1">{title}</h1>
      {description && <p className="text-muted-fg t-body-large mb-6">{description}</p>}

      <div className="bg-white rounded-lg border border-dashed border-[#E8EBF0] shadow-cx-1">
        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
          <div className="h-12 w-12 rounded-full bg-mist flex items-center justify-center mb-4">
            <Construction className="h-5 w-5 text-stellar" />
          </div>
          <div className="t-title-medium text-cosmic mb-1">Coming next</div>
          <p className="t-body-medium text-muted-fg max-w-sm mb-24">
            This surface ships in the next build pass. The shell, navigation, and design tokens are wired and ready.
          </p>
          <Button variant="outline" size="sm" onClick={goBack} className="gap-2">
            <ArrowLeft className="h-3.5 w-3.5" />
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
}
