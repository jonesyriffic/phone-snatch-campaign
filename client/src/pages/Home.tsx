import { Helmet } from "react-helmet";
import EmailForm from "@/components/EmailForm";
import SuccessMessage from "@/components/SuccessMessage";
import ErrorMessage from "@/components/ErrorMessage";
import { useState } from "react";
import { EmailFormData } from "@/lib/validation";

export default function Home() {
  const [showForm, setShowForm] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Sorry, there was an error sending your email. Please try again later.");

  const handleSuccess = () => {
    setShowForm(false);
    setShowSuccess(true);
    setShowError(false);
  };

  const handleError = (message: string) => {
    setShowForm(false);
    setShowSuccess(false);
    setShowError(true);
    setErrorMessage(message);
  };

  const handleNewEmail = () => {
    setShowForm(true);
    setShowSuccess(false);
    setShowError(false);
  };

  return (
    <>
      <Helmet>
        <title>E20 Residents: Email Uma Kumaran MP About Phone Thefts</title>
        <meta name="description" content="Make your voice heard! Use this form to send a pre-written (but customizable) email to your MP about the urgent phone theft issue in our area." />
      </Helmet>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-2">
            E20 Residents: Email Uma Kumaran MP About Phone Thefts
          </h1>
          <p className="text-center text-slate-600 max-w-3xl mx-auto">
            Make your voice heard! Use this form to prepare a pre-written (but customizable) email to send to your MP about the urgent phone theft issue in our area.
          </p>
        </header>

        {/* Main Content */}
        {showForm && <EmailForm onSuccess={handleSuccess} onError={handleError} />}
        {showSuccess && <SuccessMessage onNewEmail={handleNewEmail} />}
        {showError && <ErrorMessage message={errorMessage} onTryAgain={handleNewEmail} />}

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-slate-700">Why is this important?</h3>
              <p className="text-slate-600 text-sm">Phone thefts have become a major problem in the E20 area. By contacting our MP collectively, we demonstrate the scale of the issue and the urgent need for action.</p>
            </div>
            <div>
              <h3 className="font-medium text-slate-700">Can I edit the email?</h3>
              <p className="text-slate-600 text-sm">Yes, the email template is fully editable. Feel free to personalize it while keeping the core message intact.</p>
            </div>
            <div>
              <h3 className="font-medium text-slate-700">How does the email sending work?</h3>
              <p className="text-slate-600 text-sm">After filling out the form, your default email app will open with the pre-filled message. You'll need to click Send in your email app to actually send the email to the MP. This way, the email comes directly from your personal email address.</p>
            </div>
            <div>
              <h3 className="font-medium text-slate-700">Will my personal information be shared?</h3>
              <p className="text-slate-600 text-sm">We only collect anonymized metrics (like your postcode) to track campaign impact. On the dashboard, we only display your first name and last initial for privacy. Your full name and email are only shared when you choose to send the email.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-slate-500 text-sm">
          <p>This tool is created for E20 residents to address the phone theft issue. Last updated: June 2023</p>
        </footer>
      </div>
    </>
  );
}
