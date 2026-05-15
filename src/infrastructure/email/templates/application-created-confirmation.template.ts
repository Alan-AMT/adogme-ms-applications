export const applicationCreatedConfirmationTemplate = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>¡Solicitud enviada!</title>
  <style>
    body { margin: 0; padding: 0; background: #fafafa; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #18181b; -webkit-font-smoothing: antialiased; }
    a { color: #ff6b6b; text-decoration: none; }
    .container { max-width: 600px; margin: 0 auto; padding: 24px 16px 40px; }
    .brand { text-align: center; margin-bottom: 24px; }
    .brand__logo { font-size: 28px; font-weight: 900; color: #ff6b6b; letter-spacing: -0.02em; line-height: 1; }
    .brand__tagline { font-size: 11px; color: #a1a1aa; margin-top: 6px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
    .intro { background: #fff; border: 1.5px solid #f0f0f0; border-radius: 20px; padding: 24px; margin-bottom: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.04); }
    .intro__hi { font-size: 14px; color: #71717a; margin: 0 0 6px 0; font-weight: 600; }
    .intro__title { font-size: 20px; font-weight: 900; color: #18181b; margin: 0 0 10px 0; line-height: 1.3; letter-spacing: -0.01em; }
    .intro__desc { font-size: 14px; color: #52525b; margin: 0; line-height: 1.6; }
    .intro__strong { color: #ff6b6b; font-weight: 800; }
    .card { background: #fff; border: 1.5px solid #f0f0f0; border-radius: 20px; padding: 20px 22px; margin-bottom: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.04); }
    .dog { display: table; width: 100%; }
    .dog__photo-cell { display: table-cell; vertical-align: middle; width: 88px; padding-right: 14px; }
    .dog__photo { width: 80px; height: 80px; border-radius: 16px; object-fit: cover; border: 1.5px solid #f0f0f0; display: block; }
    .dog__info { display: table-cell; vertical-align: middle; }
    .dog__name { font-size: 19px; font-weight: 900; color: #18181b; margin: 0 0 6px 0; letter-spacing: -0.01em; }
    .dog__shelter { font-size: 13px; color: #71717a; font-weight: 600; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; background: #fef9c3; color: #854d0e; vertical-align: middle; margin-bottom: 6px; }
    .steps { padding: 4px 0; }
    .step { display: table; width: 100%; padding: 10px 0; border-bottom: 1px solid #fafafa; }
    .step:last-child { border-bottom: none; }
    .step__num-cell { display: table-cell; vertical-align: top; width: 30px; padding-top: 1px; }
    .step__num { display: inline-block; width: 22px; height: 22px; line-height: 22px; text-align: center; border-radius: 999px; font-size: 11px; font-weight: 900; background: #fff5f5; color: #ff6b6b; border: 1.5px solid #fecdd3; }
    .step__text { display: table-cell; font-size: 13px; color: #3f3f46; font-weight: 600; line-height: 1.5; vertical-align: top; }
    .highlight { background: #fff5f5; border: 1.5px solid #fecdd3; border-radius: 16px; padding: 16px 18px; margin-bottom: 14px; }
    .highlight__text { font-size: 14px; color: #52525b; line-height: 1.65; margin: 0; }
    .highlight__shelter { font-size: 15px; font-weight: 800; color: #18181b; display: block; margin-top: 6px; }
    .footer { text-align: center; padding: 28px 16px 8px; font-size: 12px; color: #a1a1aa; line-height: 1.7; }
    .footer__brand { color: #ff6b6b; font-weight: 800; }
  </style>
</head>
<body>
  <div class="container">
    <div class="brand">
      <div class="brand__logo">adogme</div>
      <div class="brand__tagline">refugios &middot; adopción</div>
    </div>

    <div class="intro">
      <p class="intro__hi">Hola {{name}},</p>
      <h1 class="intro__title">¡Tu solicitud está en camino! 🐾</h1>
      <p class="intro__desc">
        Recibimos tu solicitud para adoptar a <span class="intro__strong">{{dogName}}</span>.
        Estamos muy emocionados por este gran paso que estás dando. El refugio revisará tu información
        y pronto tendrás noticias. ¡Gracias por elegir adoptar!
      </p>
    </div>

    <div class="card">
      <div class="dog">
        <div class="dog__photo-cell">
          <img src="{{dogImage}}" alt="{{dogName}}" class="dog__photo">
        </div>
        <div class="dog__info">
          <div class="badge">Solicitud pendiente</div>
          <p class="dog__name">{{dogName}}</p>
          <p class="dog__shelter">{{shelterName}}</p>
        </div>
      </div>
    </div>

    <div class="card">
      <h2 style="font-size:15px;font-weight:900;color:#18181b;margin:0 0 14px 0;padding-bottom:10px;border-bottom:1.5px solid #f4f4f5;letter-spacing:-0.01em;">¿Qué sigue?</h2>
      <div class="steps">
        <div class="step">
          <div class="step__num-cell"><span class="step__num">1</span></div>
          <div class="step__text">El equipo de <strong>{{shelterName}}</strong> revisará tu solicitud con mucho cuidado.</div>
        </div>
        <div class="step">
          <div class="step__num-cell"><span class="step__num">2</span></div>
          <div class="step__text">Te contactarán directamente por correo electrónico para informarte sobre el estado de tu solicitud.</div>
        </div>
        <div class="step">
          <div class="step__num-cell"><span class="step__num">3</span></div>
          <div class="step__text">Si todo va bien, ¡coordinarán el encuentro con <strong>{{dogName}}</strong>!</div>
        </div>
      </div>
    </div>

    <div class="highlight">
      <p class="highlight__text">
        ¿Quieres saber más o tienes alguna pregunta? Puedes contactar directamente al refugio, estarán encantados de ayudarte.
        <span class="highlight__shelter">{{shelterName}}</span>
      </p>
    </div>

    <div class="footer">
      Este correo fue enviado por <span class="footer__brand">adogme</span><br>
      La plataforma que conecta refugios con familias adoptantes.
    </div>
  </div>
</body>
</html>`;
