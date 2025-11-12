import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const FROM = import.meta.env.RESEND_FROM || "Terrenos La Fortuna <no-reply@terrenoslafortunacr.com>";
const TO = import.meta.env.LEADS_TO || ["terrenoslafortunacr@gmail.com", "luiscr1104@gmail.com"];

export async function sendContactEmail({
  firstname,
  lastname,
  email,
  phone,
  message,
  interest, // 👈 ya viene del endpoint
}: {
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  message: string;
  interest?: string;
}) {
  const fullName = `${firstname} ${lastname}`.trim();

  // 📨 Email para ti (lead) — incluye INTERÉS
  const html = `
  <div style="font-family:'Segoe UI',Roboto,Arial,sans-serif;background-color:#f8fafb;padding:40px 0;">
    <div style="max-width:640px;margin:auto;background:white;border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,0.08);overflow:hidden;">
      <div style="background:linear-gradient(135deg,#16a34a,#047857);color:white;padding:24px 32px;">
        <h1 style="margin:0;font-size:22px;font-weight:700;">Nuevo Contacto — Terrenos La Fortuna</h1>
        <p style="margin:4px 0 0;font-size:14px;opacity:.9;">Se ha recibido un nuevo mensaje desde el sitio web</p>
      </div>

      <div style="padding:32px;">
        <table style="width:100%;border-collapse:collapse;font-size:15px;color:#333;">
          <tr>
            <td style="padding:10px 0;color:#555;width:130px;">👤 Nombre</td>
            <td style="padding:10px 0;"><strong>${fullName}</strong></td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#555;">📧 Email</td>
            <td style="padding:10px 0;"><a href="mailto:${email}" style="color:#16a34a;text-decoration:none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#555;">📱 Teléfono</td>
            <td style="padding:10px 0;">${phone || "—"}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#555;">🏷️ Interés</td>
            <td style="padding:10px 0;">${interest || "—"}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#555;vertical-align:top;">💬 Mensaje</td>
            <td style="padding:10px 0;white-space:pre-wrap;border-left:3px solid #16a34a;padding-left:12px;">${message}</td>
          </tr>
        </table>

        <div style="margin-top:28px;padding-top:20px;border-top:1px solid #eee;text-align:center;">
          <p style="font-size:13px;color:#888;">Responder a este correo contestará directamente a <b>${email}</b>.</p>
        </div>
      </div>

      <div style="background:#f3f4f6;text-align:center;padding:16px;">
        <p style="font-size:13px;color:#555;margin:0;">La Fortuna, San Carlos, Costa Rica 🌿</p>
      </div>
    </div>
  </div>`;

  await resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: email,
    subject: `Nuevo lead — ${fullName}${interest ? ` (Interés: ${interest})` : ""}`, // 👈 interés en el asunto
    html,
  });

  // 💌 Auto-respuesta al cliente (sin cambios)
  const clientHtml = `
  <div style="font-family:'Segoe UI',Roboto,Arial,sans-serif;background-color:#f8fafb;padding:40px 0;">
    <div style="max-width:640px;margin:auto;background:white;border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,0.08);overflow:hidden;">
      <div style="background:linear-gradient(135deg,#16a34a,#047857);color:white;padding:24px 32px;text-align:center;">
        <h2 style="margin:0;font-size:22px;font-weight:700;">¡Gracias, ${firstname}!</h2>
        <p style="margin:6px 0 0;font-size:14px;opacity:.9;">Tu mensaje fue recibido correctamente 🌿</p>
      </div>

      <div style="padding:32px;text-align:center;color:#333;">
        <p style="font-size:15px;margin-bottom:16px;">
          Un asesor de <strong>Terrenos La Fortuna</strong> se pondrá en contacto contigo muy pronto para brindarte detalles sobre nuestras propiedades.
        </p>

        <p style="font-size:15px;margin-bottom:28px;">
          Si deseas atención inmediata, escríbenos por WhatsApp:
        </p>

        <a href="https://wa.me/50689354697?text=Hola!%20Estoy%20interesado(a)%20en%20propiedades%20en%20La%20Fortuna"
          style="display:inline-block;background-color:#16a34a;color:white;padding:12px 28px;border-radius:8px;font-weight:600;text-decoration:none;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
          💬 Contactar por WhatsApp
        </a>

        <div style="margin-top:36px;border-top:1px solid #eee;padding-top:12px;">
          <p style="font-size:12px;color:#999;margin:0;">La Fortuna, San Carlos, Costa Rica</p>
        </div>
      </div>
    </div>
  </div>`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Hemos recibido tu mensaje — Terrenos La Fortuna",
    html: clientHtml,
  });
}
