import { Groq } from "groq-sdk";

// Definimos una interfaz para la estructura de los mensajes
// Esto soluciona el error de la línea 12
interface ChatMessage {
  role: 'user' | 'bot' | 'system' | 'assistant';
  content: string;
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    // Mapeamos los mensajes con tipos seguros
    const formattedMessages = messages.map((m: ChatMessage) => ({
      role: (m.role === 'bot' ? 'assistant' : m.role) as 'user' | 'assistant' | 'system',
      content: m.content
    }));

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `Eres el 'Guía de Niebla', experto en Ixtaczoquitlán, Veracruz.
          
          REGLAS DE FORMATO (ORDEN):
          1. Usa negritas para resaltar lugares o datos importantes.
          2. Usa listas con viñetas para dar opciones o pasos.
          3. Divide la información en párrafos cortos.
          
          REGLAS DE CONTENIDO:
          - Solo habla de Ixtaczoquitlán.
          - Si no sabes algo, admítelo con amabilidad.`
        },
        ...formattedMessages,
      ],
      temperature: 0.5,
      max_tokens: 1024,
    });

    return Response.json({ text: response.choices[0].message.content });
  } catch (error: unknown) {
    // Tipamos el error como 'unknown' y luego extraemos el mensaje con seguridad
    // Esto soluciona el error de la línea 42
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    
    console.error("Error de Groq:", errorMessage);
    return Response.json({ 
      error: "Error en el servidor", 
      details: errorMessage 
    }, { status: 500 });
  }
}