import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PlayerStats } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function analyzePlayerStats(model: any, stats: PlayerStats): Promise<string> {
  const prompt = `Analyze these World of Warships player statistics and provide detailed insights about the player's performance and playstyle:

${JSON.stringify(stats, null, 2)}

Please analyze:
1. Overall Performance:
   - Win rate and its significance
   - Average damage and what it indicates
   - Survival rate and its impact
   
2. Combat Effectiveness:
   - Main battery accuracy
   - Ship spotting abilities
   - Aircraft defense capabilities
   
3. Notable Achievements:
   - Highest damage game
   - Best experience game
   - Most ships destroyed
   
4. Areas for Improvement:
   - Identify weak points
   - Suggest specific tactics
   - Recommend focus areas

Please provide specific, actionable insights based on these statistics.`;

//console.log(prompt);
  const messages = [
    { role: "system", content: "You should roast/shame this player about the World of Warships game. Address the person in the third person (this/them). Focus on the max_ variables and the wins/losses ratio (use a percentage for this for the wins, only). The reply should not have more than 400 characters." },
    { role: "user", content: JSON.stringify(stats) }
  ];
  console.log(messages);
  try {
    const reply = await model.chat.completions.create({
      messages,
      stream: false
    });

    return reply.choices[0].message.content;
    
  } catch (error) {
    console.error('Error analyzing stats:', error);
    return "Failed to analyze statistics. Please try again later.";
  }
}

export function limitPvpOccurrences(json: any, maxOccurrences: number) {
  let occurrenceCount = 0;

  function traverseAndFilter(obj: any): any {
      if (Array.isArray(obj)) {
          return obj.map(traverseAndFilter);
      } else if (typeof obj === "object" && obj !== null) {
          const newObj: Record<string, any> = {};
          for (const key in obj) {
              if (key === "pvp") {
                  if (occurrenceCount < maxOccurrences) {
                      occurrenceCount++;
                      newObj[key] = traverseAndFilter(obj[key]);
                  }
              } else {
                  newObj[key] = traverseAndFilter(obj[key]);
              }
          }
          return newObj;
      }
      return obj;
  }

  return traverseAndFilter(json);
}