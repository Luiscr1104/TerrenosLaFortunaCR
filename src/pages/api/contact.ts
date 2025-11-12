import type { APIContext } from "astro";
import { sendContactEmail } from "../../lib/sendEmail"; // solo queda esta función

export const prerender = false;

export async function POST({ request }: APIContext) {
  try {
    // 🔹 Inicialización
    let firstname = "";
    let lastname = "";
    let email = "";
    let phone = "";
    let message = "";
    let interest = "";

    // Anti-bot
    let website = "";
    let startTime: number | null = null;

    const contentType = request.headers.get("content-type") || "";

    // 📦 Leer datos del request (JSON o FormData)
    if (contentType.includes("application/json")) {
      const body = await request.json();

      firstname = body.firstname || "";
      lastname = body.lastname || "";
      email = body.email || "";
      phone = body.phone || "";
      message = body.message || "";
      interest = body.interest || "";

      website = body.website || "";
      startTime = body.start_time ? Number(body.start_time) : null;
    } else {
      const formData = await request.formData();

      firstname = (formData.get("firstname") as string) || "";
      lastname = (formData.get("lastname") as string) || "";
      email = (formData.get("email") as string) || "";
      phone = (formData.get("phone") as string) || "";
      message = (formData.get("message") as string) || "";
      interest = (formData.get("interest") as string) || "";

      website = (formData.get("website") as string) || "";
      const startRaw = formData.get("start_time") as string | null;
      startTime = startRaw ? Number(startRaw) : null;
    }

    // 🕵️‍♂️ Honeypot: si el campo oculto viene lleno, es bot
    if (website) {
      console.warn("🚫 Honeypot triggered — spam bot");
      return new Response(
        JSON.stringify({ success: false, message: "Invalid submission." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ⏱️ Time trap: si se envía demasiado rápido, probablemente es bot
    if (!startTime || Number.isNaN(startTime)) {
      console.warn("🚫 Missing start_time — possible bot");
      return new Response(
        JSON.stringify({ success: false, message: "Invalid submission." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const elapsed = Date.now() - startTime;
    if (elapsed < 2000) {
      console.warn(`🚫 Form submitted too fast (${elapsed}ms) — bot?`);
      return new Response(
        JSON.stringify({ success: false, message: "Invalid submission." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ Validación básica
    if (!firstname || !lastname || !email) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Nombre, apellidos y correo electrónico son obligatorios.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✉️ Enviar solo con Resend
    await sendContactEmail({
      firstname,
      lastname,
      email,
      phone,
      message,
      interest,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "✅ Mensaje enviado correctamente.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Error al procesar contacto:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "❌ Ocurrió un error al enviar tu mensaje.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
