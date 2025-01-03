import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PlayerStats } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function analyzePlayerStats(model: any, stats: PlayerStats): Promise<string> {
  //   const prompt = `Analyze these World of Warships player statistics and provide detailed insights about the player's performance and playstyle:

  // ${JSON.stringify(stats, null, 2)}

  // Please analyze:
  // 1. Overall Performance:
  //    - Win rate and its significance
  //    - Average damage and what it indicates
  //    - Survival rate and its impact

  // 2. Combat Effectiveness:
  //    - Main battery accuracy
  //    - Ship spotting abilities
  //    - Aircraft defense capabilities

  // 3. Notable Achievements:
  //    - Highest damage game
  //    - Best experience game
  //    - Most ships destroyed

  // 4. Areas for Improvement:
  //    - Identify weak points
  //    - Suggest specific tactics
  //    - Recommend focus areas

  // Please provide specific, actionable insights based on these statistics.`;

  console.log(JSON.stringify(stats));
  const messages = [
    {
      role: "system",
      content: `You should roast, and be very mean to this player about the World of Warships game. They always suck at it, there is nothing positive about these statistics.
                Address the person in the third person (this/them). 
                Focus on the max_ variables and the wins/losses ratio (use a percentage for this for the wins, only), and recent battles.
                Do not mention the player level, and do not mention any loss ratio, only win, and do not mention damage to buildings.
                The reply should not have more than 600 characters, and it should have 2 paragraphs.`
    },
    { role: "user", content: JSON.stringify(stats) }
  ];
  
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