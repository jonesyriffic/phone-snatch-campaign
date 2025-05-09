import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckIcon, Mail } from "lucide-react";

interface SuccessMessageProps {
  onNewEmail: () => void;
}

export default function SuccessMessage({ onNewEmail }: SuccessMessageProps) {
  return (
    <Card className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center mb-8">
      <CardContent className="p-0">
        <div className="flex flex-col items-center">
          <div className="bg-emerald-100 p-3 rounded-full mb-4">
            <CheckIcon className="h-8 w-8 text-emerald-500" />
          </div>
          <h3 className="text-xl font-semibold text-emerald-700 mb-2">Thank You!</h3>
          <p className="text-emerald-600 mb-4">Your email has been prepared and should be opening in your email app.</p>
          
          <div className="bg-white p-4 rounded-md border border-slate-200 mt-2 mb-4 w-full max-w-md">
            <div className="flex items-center space-x-2 text-slate-700 mb-2">
              <Mail className="h-5 w-5" />
              <span className="font-medium">Next steps:</span>
            </div>
            <ol className="text-left text-slate-600 text-sm space-y-2 pl-6 list-decimal">
              <li>Check that your email app has opened with the pre-filled message</li>
              <li>Review the email content one more time</li>
              <li>Click send in your email app to deliver your message to the MP</li>
            </ol>
          </div>
          
          <Button 
            onClick={onNewEmail} 
            className="mt-4 px-6 py-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition duration-200"
          >
            Prepare Another Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
