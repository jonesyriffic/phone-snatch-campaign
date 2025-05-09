import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a variation of the email content to help bypass MP email filters.
 * This makes each email unique while keeping the core message intact.
 */
export async function generateEmailVariation(
  originalContent: string,
  userContext: { 
    fullName: string;
    postcode: string;
  }
): Promise<string> {
  try {
    // Define the system prompt for creating email variations
    const systemPrompt = `You are an expert assistant that helps create variations of emails to MPs about phone theft concerns in the E20 area. 
Your task is to rephrase the email content to make it unique while preserving:
1. All key facts and requests
2. The overall tone and urgency
3. The personal information provided by the constituent

Make these specific changes:
- Vary sentence structures and paragraph organizations
- Use different synonyms and phrases
- Ensure the email remains professional and respectful
- Keep the same key points and requests
- DO NOT invent new facts or claims
- DO NOT change any specific data points or statistics
- Your output should ONLY be the modified email content, nothing else
- The content should remain similar in length to the original

The constituent's name is ${userContext.fullName} and they live in ${userContext.postcode}.`;

    // Request a completion from OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: originalContent }
      ],
      temperature: 0.7, // Medium creativity
      max_tokens: 1500, // Limit token count to avoid excessive length
    });

    // Return the generated text
    return response.choices[0].message.content || originalContent;
  } catch (error) {
    console.error('Error generating email variation:', error);
    // If there's an error, return the original content
    return originalContent;
  }
}