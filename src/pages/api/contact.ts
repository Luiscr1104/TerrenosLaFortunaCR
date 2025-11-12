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
    let interest = ""

    // 📦 Leer datos del request (JSON o FormData)
    if (request.headers.get("content-type")?.includes("application/json")) {
      const body = await request.json();
      firstname = body.firstname || "";
      lastname = body.lastname || "";
      email = body.email || "";
      phone = body.phone || "";
      message = body.message || "";
      interest  = body.interest  || "";
    } else {
      const formData = await request.formData();
      firstname = (formData.get("firstname") as string) || "";
      lastname = (formData.get("lastname") as string) || "";
      email = (formData.get("email") as string) || "";
      phone = (formData.get("phone") as string) || "";
      message = (formData.get("message") as string) || "";
      interest  = (formData.get("interest") as string) || "";
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
    await sendContactEmail({ firstname, lastname, email, phone, message, interest });

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
