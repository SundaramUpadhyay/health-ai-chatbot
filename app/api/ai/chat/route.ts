import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const AI_SERVER_URL = process.env.AI_SERVER_URL || "http://localhost:5000"
    
    let response: string
    let diseaseInfo: any = null

    try {
      // Try to get symptom-based diagnosis from the trained model
      const aiServerResponse = await fetch(`${AI_SERVER_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: message
        }),
        timeout: 10000
      })

      if (aiServerResponse.ok) {
        const prediction = await aiServerResponse.json()
        
        // Return diagnosis whenever model provides one; confidence text sets certainty.
        if (prediction.disease) {
          diseaseInfo = prediction
          response = prediction.reply || `Based on your symptoms, I suspect ${prediction.disease} (${(prediction.confidence * 100).toFixed(1)}% confidence).

${prediction.description || ''}

**Recommendations:**
${prediction.recommendations?.map((r: string) => `• ${r}`).join('\n') || 'Please consult a healthcare professional.'}

${prediction.prescription ? `**Prescription Options:**\n${prediction.prescription.map((p: string) => `• ${p}`).join('\n')}` : ''}

⚠️ **Important:** This is an AI assessment. Always consult a dermatologist for proper diagnosis and treatment.`
        } else {
          response = `I'm your AI Health Assistant.

I can help you with symptom-to-disease diagnosis! Please describe your symptoms in detail, such as:
• Location of the lesion/rash
• Color and appearance
• Duration and progression
• Any associated symptoms (itching, pain, bleeding)
• Whether it's from sun exposure

I can diagnose:
• Actinic Keratosis
• Basal Cell Carcinoma
• Benign Keratosis
• Dermatofibroma
• Melanoma
• Melanocytic Nevi (Moles)
• Vascular Lesions

💡 **Tip:** For more accurate diagnosis, you can also upload an image using the Image Analysis tab.

⚠️ **Always consult a healthcare professional for serious conditions!`
        }
      } else {
        throw new Error("AI server not responding")
      }
    } catch (error: any) {
      console.warn("AI server unavailable, using fallback response:", error.message)
      
      response = `I'm your AI Health Assistant.

I can help diagnose skin conditions based on your symptoms! Please describe:
• What you see (color, size, shape, texture)
• Where it is on your body
• How long you've had it
• Any symptoms (itching, pain, bleeding)

Or **upload a photo** for image-based analysis using the Image Analysis tab.

I can identify:
• Actinic Keratosis
• Basal Cell Carcinoma
• Benign Keratosis
• Dermatofibroma
• Melanoma
• Melanocytic Nevi (Moles)
• Vascular Lesions

⚠️ **Always consult a dermatologist for proper diagnosis!**`
    }

    return NextResponse.json({ response, diseaseInfo })
  } catch (error: any) {
    console.error("AI chat error:", error)
    return NextResponse.json(
      { error: "Failed to process chat message", details: error.message },
      { status: 500 }
    )
  }
}