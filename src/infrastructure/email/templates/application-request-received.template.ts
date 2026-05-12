export const applicationRequestReceivedTemplate = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva solicitud de adopción</title>
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
    .card__title { font-size: 15px; font-weight: 900; color: #18181b; margin: 0 0 14px 0; padding-bottom: 10px; border-bottom: 1.5px solid #f4f4f5; letter-spacing: -0.01em; }
    .dog { display: table; width: 100%; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1.5px solid #f4f4f5; }
    .dog__photo-cell { display: table-cell; vertical-align: middle; width: 88px; padding-right: 14px; }
    .dog__photo { width: 80px; height: 80px; border-radius: 16px; object-fit: cover; border: 1.5px solid #f0f0f0; display: block; }
    .dog__info { display: table-cell; vertical-align: middle; }
    .dog__name { font-size: 19px; font-weight: 900; color: #18181b; margin: 0 0 6px 0; letter-spacing: -0.01em; }
    .dog__meta { font-size: 12px; color: #71717a; font-weight: 600; }
    .dog__meta-sep { color: #d4d4d8; margin: 0 6px; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; background: #fef9c3; color: #854d0e; vertical-align: middle; }
    .row { display: table; width: 100%; padding: 9px 0; border-bottom: 1px solid #fafafa; }
    .row:last-child { border-bottom: none; }
    .row__label { display: table-cell; font-size: 11px; font-weight: 700; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: top; padding-right: 12px; width: 42%; }
    .row__value { display: table-cell; font-size: 14px; color: #18181b; font-weight: 600; text-align: right; vertical-align: top; word-break: break-word; }
    .row--stacked { display: block; padding: 9px 0; border-bottom: 1px solid #fafafa; }
    .row--stacked:last-child { border-bottom: none; }
    .row--stacked .row__label { display: block; width: auto; margin-bottom: 6px; padding-right: 0; }
    .row--stacked .row__value { display: block; text-align: left; font-weight: 600; line-height: 1.55; }
    .yn { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 800; letter-spacing: 0.02em; }
    .yn--yes { background: #dcfce7; color: #166534; }
    .yn--no { background: #fee2e2; color: #991b1b; }
    .chip { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #fff5f5; color: #ff6b6b; font-size: 11px; font-weight: 700; border: 1px solid #fecdd3; margin: 0 4px 4px 0; }
    .chips-empty { color: #9ca3af; font-weight: 500; font-size: 13px; }
    .conf { display: table; width: 100%; padding: 7px 0; }
    .conf__icon-cell { display: table-cell; width: 28px; vertical-align: top; padding-top: 1px; }
    .conf__icon { display: inline-block; width: 22px; height: 22px; line-height: 22px; text-align: center; border-radius: 999px; font-size: 13px; font-weight: 900; }
    .conf__icon--yes { background: #dcfce7; color: #16a34a; }
    .conf__icon--no { background: #fee2e2; color: #ef4444; }
    .conf__label { display: table-cell; font-size: 13px; color: #3f3f46; font-weight: 600; line-height: 1.5; vertical-align: top; }
    .contact { padding: 4px 0; }
    .contact-row { padding: 9px 0; border-bottom: 1px solid #fafafa; }
    .contact-row:last-child { border-bottom: none; }
    .contact-row__label { font-size: 11px; font-weight: 700; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
    .contact-row__value { font-size: 15px; color: #18181b; font-weight: 700; }
    .contact-row__value a { color: #ff6b6b; font-weight: 700; }
    .score { display: table; width: 100%; }
    .score__circle-cell { display: table-cell; vertical-align: middle; width: 88px; padding-right: 16px; }
    .score__circle { width: 72px; height: 72px; border-radius: 50%; border-width: 3px; border-style: solid; text-align: center; line-height: 66px; font-size: 20px; font-weight: 900; }
    .score__info { display: table-cell; vertical-align: middle; }
    .score__label { font-size: 15px; font-weight: 900; color: #18181b; margin: 0 0 5px 0; }
    .score__sub { font-size: 12px; color: #71717a; font-weight: 500; margin: 0; line-height: 1.5; }
    .cta { text-align: center; margin: 24px 0 8px; }
    .cta__btn { display: inline-block; padding: 14px 36px; background: #ff6b6b; color: #ffffff !important; font-size: 15px; font-weight: 800; border-radius: 999px; text-decoration: none; letter-spacing: 0.01em; box-shadow: 0 4px 14px rgba(255,107,107,0.35); }
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
      <p class="intro__hi">Hola {{refugioNombre}},</p>
      <h1 class="intro__title">Nueva solicitud de adopción</h1>
      <p class="intro__desc">
        <span class="intro__strong">{{adoptanteNombre}}</span> ha enviado una solicitud para adoptar a
        <span class="intro__strong">{{perroNombre}}</span>. A continuación encontrarás todos los datos del formulario para tu revisión.
      </p>
    </div>
    <div class="card">
      <div class="dog">
        <div class="dog__photo-cell">
          <img src="{{perroFoto}}" alt="{{perroNombre}}" class="dog__photo">
        </div>
        <div class="dog__info">
          <p class="dog__name">{{perroNombre}}</p>
          <div class="dog__meta">
            <span class="badge">Pendiente</span>
            <span class="dog__meta-sep">&middot;</span>
            <span>{{fechaSolicitudFormatted}}</span>
          </div>
        </div>
      </div>
      <div class="row"><span class="row__label">Adoptante</span><span class="row__value">{{adoptanteNombre}}</span></div>
      <div class="row"><span class="row__label">Correo</span><span class="row__value"><a href="mailto:{{correo}}">{{correo}}</a></span></div>
    </div>
    <div class="card">
      <h2 class="card__title">Contacto del adoptante</h2>
      <div class="contact">
        <div class="contact-row"><div class="contact-row__label">Teléfono</div><div class="contact-row__value"><a href="tel:{{telefono}}">{{telefono}}</a></div></div>
        <div class="contact-row"><div class="contact-row__label">Correo electrónico</div><div class="contact-row__value"><a href="mailto:{{correo}}">{{correo}}</a></div></div>
      </div>
    </div>
    {{#if hasCompatibilityScore}}
    <div class="card">
      <h2 class="card__title">Compatibilidad ML</h2>
      <div class="score">
        <div class="score__circle-cell">
          <div class="score__circle" style="background-color:{{compatibilityScoreBg}};border-color:{{compatibilityScoreColor}};color:{{compatibilityScoreColor}};">
            {{compatibilityScore}}%
          </div>
        </div>
        <div class="score__info">
          <p class="score__label">{{compatibilityScoreLabel}}</p>
          <p class="score__sub">Puntuación calculada por el modelo de recomendación según el perfil de estilo de vida del adoptante.</p>
        </div>
      </div>
    </div>
    {{/if}}
    <div class="card">
      <h2 class="card__title">Información personal</h2>
      <div class="row"><span class="row__label">Nombre completo</span><span class="row__value">{{nombreCompleto}}</span></div>
      <div class="row"><span class="row__label">Edad</span><span class="row__value">{{edad}} años</span></div>
      <div class="row"><span class="row__label">Teléfono</span><span class="row__value">{{telefono}}</span></div>
      <div class="row"><span class="row__label">Correo</span><span class="row__value">{{correo}}</span></div>
      <div class="row"><span class="row__label">Ocupación</span><span class="row__value">{{ocupacion}}</span></div>
      <div class="row--stacked"><span class="row__label">Dirección</span><span class="row__value">{{direccion}}</span></div>
      {{#if redesSociales}}<div class="row--stacked"><span class="row__label">Redes sociales</span><span class="row__value">{{redesSociales}}</span></div>{{/if}}
    </div>
    <div class="card">
      <h2 class="card__title">Vivienda y entorno</h2>
      <div class="row"><span class="row__label">Tipo</span><span class="row__value">{{viviendaTipoLabel}}</span></div>
      <div class="row"><span class="row__label">Tenencia</span><span class="row__value">{{viviendaTenenciaLabel}}</span></div>
      {{#if esRentada}}<div class="row"><span class="row__label">Permite animales</span><span class="row__value">{{#if viviendaPermiteAnimales}}<span class="yn yn--yes">Sí</span>{{else}}<span class="yn yn--no">No</span>{{/if}}</span></div>{{/if}}
      <div class="row"><span class="row__label">Tiene jardín</span><span class="row__value">{{#if viviendaTieneJardin}}<span class="yn yn--yes">Sí</span>{{else}}<span class="yn yn--no">No</span>{{/if}}</span></div>
      {{#if viviendaTieneJardin}}
      <div class="row"><span class="row__label">Tamaño jardín</span><span class="row__value">{{viviendaTamanoJardin}} m²</span></div>
      <div class="row"><span class="row__label">Reja o cerca</span><span class="row__value">{{#if viviendaTieneRejaOCerca}}<span class="yn yn--yes">Sí</span>{{else}}<span class="yn yn--no">No</span>{{/if}}</span></div>
      {{/if}}
      <div class="row--stacked"><span class="row__label">Quiénes viven</span><span class="row__value">{{entornoQuienesViven}}</span></div>
      <div class="row"><span class="row__label">Todos de acuerdo</span><span class="row__value">{{#if entornoTodosDeAcuerdo}}<span class="yn yn--yes">Sí</span>{{else}}<span class="yn yn--no">No</span>{{/if}}</span></div>
      <div class="row"><span class="row__label">Hay niños</span><span class="row__value">{{#if entornoHayNinos}}<span class="yn yn--yes">Sí</span>{{else}}<span class="yn yn--no">No</span>{{/if}}</span></div>
      <div class="row"><span class="row__label">Hay alérgicos</span><span class="row__value">{{#if entornoHayAlergicos}}<span class="yn yn--yes">Sí</span>{{else}}<span class="yn yn--no">No</span>{{/if}}</span></div>
      {{#if numFotosViviendaLabel}}<div class="row"><span class="row__label">Fotos de vivienda</span><span class="row__value"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fff5f5;color:#ff6b6b;font-size:12px;font-weight:800;border:1px solid #fecdd3;">📷 {{numFotosViviendaLabel}}</span></span></div>{{/if}}
    </div>
    <div class="card">
      <h2 class="card__title">Rutina y estilo de vida</h2>
      <div class="row"><span class="row__label">Horas solo</span><span class="row__value">{{rutinaHorasSolo}} h al día</span></div>
      <div class="row--stacked"><span class="row__label">Dónde permanece solo</span><span class="row__value">{{rutinaDondePermaneceSolo}}</span></div>
      <div class="row"><span class="row__label">Dónde dormiría</span><span class="row__value">{{rutinaDondeDormiriaLabel}}</span></div>
      <div class="row"><span class="row__label">Actividad física</span><span class="row__value">{{rutinaActividadFisicaLabel}}</span></div>
      <div class="row--stacked">
        <span class="row__label">Actividades planeadas</span>
        <span class="row__value">
          {{#each actividadesPlaneadas}}<span class="chip">{{this}}</span>{{else}}<span class="chips-empty">Ninguna especificada</span>{{/each}}
        </span>
      </div>
    </div>
    <div class="card">
      <h2 class="card__title">Mascotas y experiencia</h2>
      <div class="row"><span class="row__label">Tiene mascotas</span><span class="row__value">{{#if tieneMascotas}}<span class="yn yn--yes">Sí</span>{{else}}<span class="yn yn--no">No</span>{{/if}}</span></div>
      {{#if tieneMascotas}}
        {{#if mascotasCuantasYCuales}}<div class="row--stacked"><span class="row__label">Cuántas y cuáles</span><span class="row__value">{{mascotasCuantasYCuales}}</span></div>{{/if}}
        {{#if mascotasEdades}}<div class="row"><span class="row__label">Edades</span><span class="row__value">{{mascotasEdades}}</span></div>{{/if}}
        {{#if mascotasEsterilizadasShown}}<div class="row"><span class="row__label">Esterilizadas</span><span class="row__value">{{#if mascotasEsterilizadas}}<span class="yn yn--yes">Sí</span>{{else}}<span class="yn yn--no">No</span>{{/if}}</span></div>{{/if}}
        {{#if mascotasConvivencia}}<div class="row--stacked"><span class="row__label">Convivencia</span><span class="row__value">{{mascotasConvivencia}}</span></div>{{/if}}
      {{/if}}
      <div class="row"><span class="row__label">Experiencia previa</span><span class="row__value">{{#if experienciaPreviaTuvo}}<span class="yn yn--yes">Sí</span>{{else}}<span class="yn yn--no">No</span>{{/if}}</span></div>
      {{#if experienciaPreviaTuvo}}{{#if experienciaQuePaso}}<div class="row--stacked"><span class="row__label">Qué pasó</span><span class="row__value">{{experienciaQuePaso}}</span></div>{{/if}}{{/if}}
    </div>
    <div class="card">
      <h2 class="card__title">Responsabilidad</h2>
      <div class="row--stacked"><span class="row__label">Motivación</span><span class="row__value">{{motivacion}}</span></div>
      <div class="row--stacked"><span class="row__label">Si te mudas</span><span class="row__value">{{siMudanza}}</span></div>
      <div class="row--stacked"><span class="row__label">Comportamiento no esperado</span><span class="row__value">{{siComportamientoNoEsperado}}</span></div>
      <div class="row--stacked"><span class="row__label">Razones para devolver</span><span class="row__value">{{situacionesParaDevolver}}</span></div>
      <div class="row"><span class="row__label">Capacidad económica</span><span class="row__value">{{#if capacidadEconomica}}<span class="yn yn--yes">Sí</span>{{else}}<span class="yn yn--no">No</span>{{/if}}</span></div>
      <div class="row--stacked"><span class="row__label">Cuidados médicos</span><span class="row__value">{{cuidadosMedicos}}</span></div>
    </div>
    <div class="card">
      <h2 class="card__title">Confirmaciones</h2>
      <div class="conf"><div class="conf__icon-cell"><span class="conf__icon {{#if aceptaAlimentacionVeterinaria}}conf__icon--yes{{else}}conf__icon--no{{/if}}">{{#if aceptaAlimentacionVeterinaria}}✓{{else}}✕{{/if}}</span></div><div class="conf__label">Acepta brindar alimentación adecuada y atención veterinaria</div></div>
      <div class="conf"><div class="conf__icon-cell"><span class="conf__icon {{#if aceptaNoAbandono}}conf__icon--yes{{else}}conf__icon--no{{/if}}">{{#if aceptaNoAbandono}}✓{{else}}✕{{/if}}</span></div><div class="conf__label">Acepta no abandonar al animal bajo ninguna circunstancia</div></div>
      <div class="conf"><div class="conf__icon-cell"><span class="conf__icon {{#if aceptaContactarRefugio}}conf__icon--yes{{else}}conf__icon--no{{/if}}">{{#if aceptaContactarRefugio}}✓{{else}}✕{{/if}}</span></div><div class="conf__label">Acepta contactar al refugio ante dudas o dificultades</div></div>
      <div class="conf"><div class="conf__icon-cell"><span class="conf__icon {{#if aceptaSeguimiento}}conf__icon--yes{{else}}conf__icon--no{{/if}}">{{#if aceptaSeguimiento}}✓{{else}}✕{{/if}}</span></div><div class="conf__label">Acepta seguimiento posterior por parte del refugio</div></div>
      <div class="conf"><div class="conf__icon-cell"><span class="conf__icon {{#if aceptaInfoVeridica}}conf__icon--yes{{else}}conf__icon--no{{/if}}">{{#if aceptaInfoVeridica}}✓{{else}}✕{{/if}}</span></div><div class="conf__label">Confirma que la información proporcionada es verídica</div></div>
    </div>
    <div class="cta">
      <a href="{{reviewUrl}}" class="cta__btn">Revisar solicitud</a>
    </div>
    <div class="footer">
      Este correo fue enviado por <span class="footer__brand">adogme</span><br>
      La plataforma que conecta refugios con familias adoptantes.
    </div>
  </div>
</body>
</html>`;
