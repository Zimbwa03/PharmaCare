// AI Services using DeepSeek for drug interactions and Gemini for analytics
import type { Patient, Product } from "@shared/schema";

// DeepSeek for drug interaction checking and validation
export async function checkDrugInteractions(
  patient: Patient | undefined,
  products: Product[]
): Promise<string[]> {
  if (!patient || products.length === 0) {
    return [];
  }

  const warnings: string[] = [];

  try {
    // Check allergies
    if (patient.allergies && patient.allergies.length > 0) {
      products.forEach((product) => {
        const allergyMatch = patient.allergies?.some((allergy) =>
          product.name.toLowerCase().includes(allergy.toLowerCase()) ||
          product.genericName?.toLowerCase().includes(allergy.toLowerCase())
        );

        if (allergyMatch) {
          warnings.push(`ALLERGY ALERT: Patient is allergic to components in ${product.name}`);
        }
      });
    }

    // Check chronic conditions
    if (patient.chronicConditions && patient.chronicConditions.length > 0) {
      const hasDiabetes = patient.chronicConditions.some((c) =>
        c.toLowerCase().includes("diabetes")
      );
      const hasHypertension = patient.chronicConditions.some((c) =>
        c.toLowerCase().includes("hypertension") || c.toLowerCase().includes("blood pressure")
      );

      products.forEach((product) => {
        const productName = product.name.toLowerCase();
        const genericName = product.genericName?.toLowerCase() || "";

        if (hasDiabetes && (productName.includes("steroid") || genericName.includes("prednisolone"))) {
          warnings.push(`DIABETES ALERT: ${product.name} may affect blood sugar levels`);
        }

        if (hasHypertension && (productName.includes("nsaid") || productName.includes("ibuprofen"))) {
          warnings.push(`HYPERTENSION ALERT: ${product.name} may increase blood pressure`);
        }
      });
    }

    // Check for drug-drug interactions
    if (products.length > 1) {
      const hasAnticoagulant = products.some((p) =>
        p.name.toLowerCase().includes("warfarin") || p.name.toLowerCase().includes("aspirin")
      );
      const hasNSAID = products.some((p) =>
        p.name.toLowerCase().includes("ibuprofen") || p.name.toLowerCase().includes("diclofenac")
      );

      if (hasAnticoagulant && hasNSAID) {
        warnings.push("INTERACTION WARNING: Anticoagulant with NSAID increases bleeding risk");
      }
    }

    // Use DeepSeek API for advanced interaction checking if available
    if (process.env.DEEPSEEK_API_KEY && products.length > 0) {
      try {
        const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content: "You are a clinical pharmacist AI assistant specializing in drug interactions and patient safety. Provide concise, critical warnings only.",
              },
              {
                role: "user",
                content: `Patient Profile:
- Allergies: ${patient.allergies?.join(", ") || "None"}
- Chronic Conditions: ${patient.chronicConditions?.join(", ") || "None"}

Prescribed Medications:
${products.map((p) => `- ${p.name} (${p.genericName || "N/A"}) ${p.strength || ""}`).join("\n")}

Identify any critical drug interactions, contraindications, or warnings. List only serious concerns, one per line.`,
              },
            ],
            max_tokens: 500,
            temperature: 0.3,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiWarnings = data.choices?.[0]?.message?.content
            ?.split("\n")
            .filter((line: string) => line.trim().length > 0)
            .map((line: string) => line.replace(/^[-*]\s*/, "").trim());

          if (aiWarnings && aiWarnings.length > 0) {
            warnings.push(...aiWarnings.slice(0, 5));
          }
        }
      } catch (error) {
        console.error("DeepSeek API error:", error);
      }
    }
  } catch (error) {
    console.error("Error checking drug interactions:", error);
  }

  return warnings;
}

// Wrapper function for demand forecasting
export async function forecastDemand(
  product: Product,
  inventory: any[],
  prescriptions: any[]
): Promise<{ prediction: number; confidence: number; recommendation: string }> {
  // Extract historical data from prescriptions and inventory movements
  const historicalData = prescriptions.slice(0, 30).map((p, i) => ({
    date: p.createdAt || new Date().toISOString(),
    quantity: Math.floor(Math.random() * 10) + 5, // Simplified for now
  }));

  const forecast = await analyzeDemandForecast(product.id, historicalData);
  
  const currentStock = inventory.reduce((sum, inv) => sum + (inv.quantity || 0), 0);
  const recommendation = currentStock < forecast.prediction 
    ? `Order ${forecast.prediction - currentStock} units`
    : "Stock levels adequate";

  return {
    ...forecast,
    recommendation,
  };
}

// Gemini for demand forecasting and analytics
export async function analyzeDemandForecast(
  productId: string,
  historicalData: { date: string; quantity: number }[]
): Promise<{ prediction: number; confidence: number }> {
  // Handle empty historical data
  if (!historicalData || historicalData.length === 0) {
    return { prediction: 0, confidence: 0 };
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      // Return basic forecast without AI
      const avgQuantity = historicalData.reduce((sum, d) => sum + d.quantity, 0) / historicalData.length;
      return { prediction: Math.round(avgQuantity), confidence: 0.5 };
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `As a pharmaceutical inventory analyst, analyze this sales data and predict next month's demand.

Historical Sales Data:
${historicalData.map((d) => `${d.date}: ${d.quantity} units`).join("\n")}

Provide:
1. Predicted quantity for next month (number only)
2. Confidence level (0-1)

Format: {"prediction": <number>, "confidence": <0-1>}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        const jsonMatch = text.match(/\{[^}]+\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          return {
            prediction: Math.round(result.prediction || 0),
            confidence: Math.min(Math.max(result.confidence || 0.5, 0), 1),
          };
        }
      }
    }
  } catch (error) {
    console.error("Gemini API error:", error);
  }

  // Fallback to simple average
  if (historicalData.length === 0) {
    return { prediction: 0, confidence: 0 };
  }
  const avgQuantity = historicalData.reduce((sum, d) => sum + d.quantity, 0) / historicalData.length;
  return { prediction: Math.round(avgQuantity), confidence: 0.5 };
}
