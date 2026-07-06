# Hackathon de Python: From Code to Startup

Aplicación web estática, profesional y lista para GitHub Pages para gestionar la selección y reclamo de retos de un hackathon universitario.

## Stack

- HTML5
- CSS3
- JavaScript ES6 con módulos
- Firebase Firestore para almacenamiento y actualizaciones en tiempo real
- Sin React, Angular, Vue, Bootstrap, Tailwind ni jQuery

## Estructura

```txt
hackathon/
|-- index.html
|-- challenge.html
|-- dashboard.html
|-- faq.html
|-- resources.html
|-- styles.css
|-- app.js
|-- firebase.js
|-- config.example.js
|-- challenges.js
|-- README.md
|-- assets/
|   |-- images/
|   `-- icons/
`-- components/
```

## Dónde poner los logos

El logo principal ya está configurado como imagen transparente en:

```txt
assets/images/event-logo.png
```

Puedes reemplazar ese archivo por otro logo con el mismo nombre para actualizarlo en todas las páginas.

## Retos y temáticas

Los retos se cargan desde `challenges.js`. La estructura fue simplificada para usar solo los campos que se muestran en la interfaz:

```js
{
  id: "education",
  icon: "📚",
  label: "Educación",
  title: "Reto: Educación",
  cardDescription: "Resumen para la tarjeta de selección.",
  brief: "Descripción corta del reto.",
  mission: "Misión que verá el equipo al revelar el reto.",
  focus: ["Punto 1", "Punto 2"],
  success: "Criterio de éxito para la presentación."
}
```

Los IDs `education`, `health`, `sustainability` y `automation` también se usan en Firestore, así que no deben cambiarse sin actualizar las reglas.

## Configurar Firebase Firestore

### 1. Crear proyecto

1. Entra a Firebase Console.
2. Crea un proyecto nuevo.
3. En el menú Build, abre Firestore Database.
4. Crea una base de datos Firestore.
5. Selecciona la región que prefieras.

### 2. Crear app web

1. Ve a Project settings.
2. En Your apps, crea una Web App.
3. Copia el objeto `firebaseConfig`.
4. Abre `config.example.js`.
5. Reemplaza los valores `REPLACE_WITH_...` con tus credenciales reales.

El archivo que debes editar es exactamente este:

```txt
config.example.js
```

La app ya importa ese archivo desde `firebase.js`, asi que no tienes que tocar imports.

### 3. Activar reglas de Firestore

Para un evento rapido sin login, puedes usar estas reglas. Permiten lectura publica y permiten reclamar cada tematica una sola vez.

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /hackathonChallenges/{themeId} {
      allow read: if true;

      allow create: if themeId in ['education', 'health', 'sustainability', 'automation']
        && request.resource.data.status == 'claimed'
        && request.resource.data.teamName is string
        && request.resource.data.leaderName is string
        && request.resource.data.leaderEmail is string
        && request.resource.data.themeId == themeId;

      allow update: if themeId in ['education', 'health', 'sustainability', 'automation']
        && resource.data.status != 'claimed'
        && request.resource.data.status == 'claimed'
        && request.resource.data.themeId == themeId;

      allow delete: if false;
    }
  }
}
```

Nota: para una version con control total, agrega Firebase Auth y limita reclamos a usuarios autenticados o a un panel admin.

## Como funciona Firestore en esta app

La coleccion usada es:

```txt
hackathonChallenges
```

Cada documento usa el id de la tematica:

```txt
education
health
sustainability
automation
```

Cuando un equipo confirma el reclamo se guarda:

```js
{
  themeId,
  themeLabel,
  teamName,
  leaderName,
  leaderEmail,
  status: "claimed",
  claimedAt
}
```

La UI escucha cambios usando `onSnapshot()` en `firebase.js`, por eso todas las tarjetas cambian a `Claimed by Equipo X` sin refrescar.

## Editar hora de presentaciones

Abre `challenges.js` y cambia:

```js
presentationAt: "2026-07-06T16:00:00-05:00",
presentationLabel: "4:00 p.m.",
timezoneLabel: "Panama UTC-5"
```

## Probar localmente

Por usar módulos ES6, abre el proyecto con un servidor local, no con doble clic.

Opcion rapida con Python:

```bash
python -m http.server 8000
```

Luego abre:

```txt
http://localhost:8000
```

## Subir a GitHub Pages

### 1. Crear repositorio

1. En GitHub, crea un repositorio nuevo.
2. Puedes llamarlo `hackathon-python` o similar.
3. Sube el contenido de la carpeta `hackathon/` al root del repositorio.
4. Asegurate de que `index.html` quede en la raiz del repo.

Correcto:

```txt
index.html
styles.css
app.js
...
```

Incorrecto:

```txt
hackathon/index.html
hackathon/styles.css
...
```

### 2. Publicar

1. Entra al repositorio.
2. Abre Settings.
3. En el menu lateral, abre Pages.
4. En Build and deployment, seleccióna Deploy from a branch.
5. Selecciona la rama `main`.
6. Selecciona la carpeta `/root`.
7. Guarda.
8. Espera a que GitHub Pages termine de publicar.

Tu sitio quedara en una URL similar a:

```txt
https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/
```

## Checklist antes del evento

- [ ] Pegar credenciales reales en `config.example.js`.
- [ ] Activar Firestore.
- [ ] Publicar reglas de seguridad.
- [x] Retos cargados en `challenges.js`.
- [ ] Cambiar hora de presentaciones si aplica.
- [ ] Agregar logos en `assets/images/`.
- [ ] Probar con dos navegadores al mismo tiempo para validar el bloqueo en tiempo real.

## Mantenimiento futuro

Para reutilizar esta app en otros hackathons:

1. Cambia `EVENT_CONFIG` en `challenges.js`.
2. Cambia las categorias o retos en `CHALLENGES`.
3. Cambia colores en `:root` dentro de `styles.css`.
4. Mantén Firestore como fuente de verdad para reclamos en vivo.
