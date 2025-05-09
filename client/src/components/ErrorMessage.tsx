import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircleIcon } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onTryAgain: () => void;
}

export default function ErrorMessage({ message, onTryAgain }: ErrorMessageProps) {
  return (
    <Card className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8">
      <CardContent className="p-0">
        <div className="flex flex-col items-center">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <AlertCircleIcon className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-red-700 mb-2">Error</h3>
          <p className="text-red-600 mb-2">{message}</p>
          <Button 
            onClick={onTryAgain} 
            className="mt-4 px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition duration-200"
          >
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
