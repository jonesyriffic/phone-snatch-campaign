import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { emailFormSchema, type EmailFormData } from "@/lib/validation";

const DEFAULT_EMAIL_CONTENT = `Dear Ms. Kumaran,

I am writing to you today as a concerned resident of E20 within your Stratford and Bow constituency to express my urgent alarm regarding the escalating crisis of phone thefts in our local area.

For those of us living in E20, the sight of thieves on e-bikes brazenly snatching phones has become an unacceptable daily reality. This isn't an isolated issue; it's a persistent threat that significantly impacts our sense of safety and security. These incidents are a constant topic of discussion in our local WhatsApp groups and have been repeatedly raised in our local police forum meetings, yet the problem persists and, anecdotally, appears to be worsening.

The current situation is untenable and requires immediate and robust intervention. We, your constituents in E20, urge you to take the following specific actions:

1.  Raise this critical issue in Parliament to highlight the severity of phone crime in our community and across London.
2.  Address this matter directly with the Commissioner of the Metropolitan Police, demanding a strategic and effective response to combat these thefts in E20.
3.  Convey our grave concerns to the Home Secretary, emphasizing the need for national support and resources to tackle this type of crime.
4.  Engage with the Mayor of London to ensure a coordinated approach and adequate resources are allocated to our area to address this problem.
5.  Champion the call for the reinstatement of a dedicated local police post or presence for the E20 area, which we believe would act as a significant deterrent.
6.  Advocate for significantly improved CCTV coverage in known hotspots within E20 to aid in the prevention and prosecution of these crimes.
7.  Support and help facilitate the establishment of a local awareness campaign to educate residents on preventative measures and reporting mechanisms.

[Optional: Your brief self-description or specific observation will be inserted here if provided]

We believe that with your strong representation, we can begin to reclaim our streets and restore a sense of security for all residents in E20. We look forward to hearing about the actions you will take on our behalf.

Sincerely,

[Your Full Name will be automatically added here by the app]
[Your Postcode will be automatically added here by the app]
[Your Email Address will be automatically added here by the app]`;

interface EmailFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function EmailForm({ onSuccess, onError }: EmailFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      fullName: "",
      postcode: "",
      email: "",
      anonymous: false,
      emailContent: DEFAULT_EMAIL_CONTENT,
    },
  });

  // Remove the description placeholder from the email content on component mount
  useEffect(() => {
    let content = form.getValues("emailContent");
    
    // Remove the optional description line from the template
    content = content.replace(
      "[Optional: Your brief self-description or specific observation will be inserted here if provided]\n\n", 
      ""
    );
    // Also try with just a single newline in case there's no double spacing
    content = content.replace(
      "[Optional: Your brief self-description or specific observation will be inserted here if provided]\n", 
      ""
    );
    // And also try with the placeholder alone in case it's at the end without newlines
    content = content.replace(
      "[Optional: Your brief self-description or specific observation will be inserted here if provided]", 
      ""
    );
    
    form.setValue("emailContent", content);
  }, []);

  async function onSubmit(data: EmailFormData) {
    setIsSubmitting(true);
    
    try {
      // Validate postcode is E20
      if (!data.postcode.toLowerCase().startsWith('e20')) {
        onError("This form is only for E20 residents. Please enter a valid E20 postcode.");
        setIsSubmitting(false);
        return;
      }
      
      // Prepare the email data
      const finalEmailContent = data.emailContent
        .replace("[Your Full Name will be automatically added here by the app]", data.fullName)
        .replace("[Your Postcode will be automatically added here by the app]", data.postcode)
        .replace("[Your Email Address will be automatically added here by the app]", data.email);
      
      // Create mailto: link with the email data
      const subject = encodeURIComponent("Urgent Action Needed: Escalating Phone Thefts in E20, Stratford and Bow");
      const body = encodeURIComponent(finalEmailContent);
      const to = "uma.kumaran.mp@parliament.uk";
      const cc = `${data.email},phone.thefts@andrewjones.uk`;
      
      const mailtoLink = `mailto:${to}?subject=${subject}&body=${body}&cc=${cc}`;
      
      // Track the email metrics in the background
      try {
        await apiRequest("POST", "/api/track-email", {
          ...data,
          emailContent: finalEmailContent,
        });
        console.log("Email metrics tracked successfully");
      } catch (trackingError) {
        // Don't fail the overall submission if just tracking fails
        console.error("Failed to track email metrics:", trackingError);
      }
      
      // Open the mailto link in a new window
      window.open(mailtoLink, '_blank');
      
      // Show success message
      onSuccess();
    } catch (error) {
      console.error("Error processing form:", error);
      onError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="bg-white rounded-lg shadow-md p-6 mb-8">
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Personal Details */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">Your Details</h2>
                
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">Full Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. John Smith" 
                          {...field} 
                          className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="postcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">Postcode <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. E20 1JG" 
                          {...field} 
                          className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">Email Address <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="e.g. john.smith@example.com" 
                          {...field} 
                          className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="anonymous"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-slate-50">
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <FormLabel className="text-sm font-medium text-slate-700">
                            Display as Anonymous on dashboard
                          </FormLabel>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                      <FormDescription className="text-xs text-slate-500 ml-6">
                        Your name will appear as "Anonymous" in the campaign dashboard if selected
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* Privacy Notice */}
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                  <p className="text-sm text-slate-600">
                    <span className="font-medium text-slate-700">Privacy Notice:</span> Your details will be used solely for sending this email. We collect anonymized metrics (postcode, submission time) to track the campaign's overall impact.
                  </p>
                </div>
              </div>
              
              {/* Right Column: Email Content */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">Email Preview</h2>
                
                {/* Email Information */}
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-slate-600 font-medium">To:</span>
                    <span className="col-span-2 text-slate-800">uma.kumaran.mp@parliament.uk</span>
                    
                    <span className="text-slate-600 font-medium">Subject:</span>
                    <span className="col-span-2 text-slate-800">Urgent Action Needed: Escalating Phone Thefts in E20, Stratford and Bow</span>
                    
                    <span className="text-slate-600 font-medium">CC:</span>
                    <span className="col-span-2 text-slate-800">Your email address, phone.thefts@andrewjones.uk</span>
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="emailContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Email Content <span className="text-slate-500 text-xs">(editable)</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={16} 
                          {...field} 
                          className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-4 flex flex-col items-center">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full md:w-auto px-8 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary-dark transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {isSubmitting ? "Sending..." : "Send Email to MP"}
              </Button>
              
              {/* Help Text */}
              <p className="text-sm text-slate-500 mt-2">
                By clicking "Send Email", you're sending this message directly to Uma Kumaran MP
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}