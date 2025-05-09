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
          <p className="text-emerald-600 mb-4">Your email has been prepared and should be opening in your default email app.</p>
          
          <div className="bg-white p-4 rounded-md border border-slate-200 mt-2 mb-4 w-full max-w-md">
            <div className="flex items-center space-x-2 text-slate-700 mb-2">
              <Mail className="h-5 w-5" />
              <span className="font-medium">Important next steps:</span>
            </div>
            <ol className="text-left text-slate-600 text-sm space-y-2 pl-6 list-decimal">
              <li>Look for your email app that should have opened with the pre-filled message</li>
              <li>If it didn't open automatically, please check if you have a pop-up blocker enabled</li>
              <li>Review the email content before sending</li>
              <li>Click the Send button in your email app to deliver your message to the MP</li>
              <li>The email will be sent from your personal email address, ensuring the MP can reply directly to you</li>
            </ol>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 mt-4 mb-2 w-full max-w-md text-left">
            <div className="flex items-center text-yellow-800 mb-1 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Didn't see your email app open?
            </div>
            <p className="text-sm text-yellow-700">
              If your default email client didn't open, you can try again or copy the prepared email content and paste it into your email app manually.
            </p>
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
