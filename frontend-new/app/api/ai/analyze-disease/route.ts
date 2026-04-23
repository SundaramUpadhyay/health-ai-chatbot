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

    const { image, text } = await request.json()

    if (!image && !text) {
      return NextResponse.json({ error: "Image or text is required" }, { status: 400 })
    }

    // Prefer the deployed AI server URL and derive /predict endpoint if needed.
    const aiServerBaseUrl = process.env.AI_SERVER_URL || "http://localhost:5000"
    const configuredEndpoint = process.env.AI_MODEL_ENDPOINT
    const AI_MODEL_ENDPOINT = configuredEndpoint
      ? configuredEndpoint
      : `${aiServerBaseUrl.replace(/\/$/, "")}/predict`

    try {
      console.log("🤖 Calling AI endpoint:", AI_MODEL_ENDPOINT)
      
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 65000) // allow Render free-tier cold starts

      let requestBody: any = {}

      // Handle image analysis
      if (image) {
        let base64Image = image
        if (image.includes('base64,')) {
          base64Image = image.split('base64,')[1]
        }
        requestBody.image = base64Image
      }

      // Handle text analysis for chat
      if (text) {
        requestBody.text = text
      }

      const aiResponse = await fetch(AI_MODEL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text()
        console.error(`AI model returned status ${aiResponse.status}:`, errorText)
        throw new Error(`AI model returned status ${aiResponse.status}`)
      }

      const prediction = await aiResponse.json()
      console.log("✅ AI prediction received:", prediction)
      
      const confidence = Number(prediction.confidence ?? prediction.probability ?? 0.0)

      // Return the prediction in the expected format
      return NextResponse.json({
        disease: prediction.disease || prediction.class || prediction.predicted_class || "Unknown",
        confidence,
        prescription: prediction.prescription || prediction.treatment || ["Consult a healthcare professional"],
        recommendations: prediction.recommendations || prediction.advice || ["Please see a dermatologist for proper diagnosis"],
        reply: prediction.reply || `I detected ${prediction.disease || 'a skin condition'}. ${prediction.description || 'Please consult a healthcare professional.'}`,
      })
      
    } catch (aiError: any) {
      console.error("❌ AI model error:", aiError.message)
      console.error("Full error:", aiError)
      
      const isTimeout = aiError?.name === "AbortError"

      // Return user-friendly error
      return NextResponse.json(
        { 
          error: "AI model is currently unavailable", 
          details: isTimeout
            ? "The AI server may be waking up from inactivity. Please try again in 30-60 seconds."
            : "Please make sure the AI server endpoint is accessible.",
          technicalDetails: aiError.message,
          fallback: true 
        },
        { status: 503 }
      )
    }
  } catch (error: any) {
    console.error("Disease analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze image", details: error.message },
      { status: 500 }
    )
  }
}
