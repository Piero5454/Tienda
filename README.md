# Plano Digital

Landing page para promocionar servicios de desarrollo de sitios web, apps y dashboards, hecha con [Nuxt](https://nuxt.com).

Sitio publicado: https://piero5454.github.io/Tienda/

## Estructura

```
nuxt.config.ts                  Configuración de Nuxt (título, meta, fuentes, baseURL)
app/app.vue                     Componente raíz
app/pages/index.vue             Página principal (arma las secciones)
app/components/                 Una sección por componente (HeroStudio, ServicesSection, ContactSection, ...)
app/assets/css/styles.css       Estilos (colores, tipografías, diseño responsive)
public/                         Archivos que se copian tal cual (incluye .nojekyll)
.github/workflows/deploy.yml    Genera el sitio y lo publica en GitHub Pages
```

## Personalizar

- Correo, WhatsApp y horario: objeto `contact` en `app/components/ContactSection.vue`.
- Número de WhatsApp del formulario: constante `WHATSAPP` en el mismo archivo.
- Servicios, proceso, tecnologías y preguntas: arreglos al inicio de cada componente.
- Colores y tipografías: variables al inicio de `app/assets/css/styles.css`.

## Desarrollo local

```
npm install
npm run dev
```

Abre http://localhost:3000

## Publicar

Cada push a `main` ejecuta el workflow que genera el sitio estático (`npm run generate`) y lo publica en GitHub Pages.
En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions** (una sola vez).

### Render

En Render (Static Site) el sitio se genera solo al instalar dependencias: el `postinstall` ejecuta `nuxt generate` cuando existe la variable `RENDER`.
Publish directory: `.output/public`. Opcionalmente, Build Command: `npm ci && npm run generate`.
