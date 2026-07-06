# Hackathon de Python: From Code to Startup

Aplicacion web estatica, profesional y lista para GitHub Pages para gestionar la seleccion y reclamo de retos de un hackathon universitario.

## Stack

- HTML5
- CSS3
- JavaScript ES6 con modulos
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

## Donde poner los logos

Los espacios de logos estan vacios por diseno. Puedes colocar tus imagenes dentro de:

```txt
assets/images/
assets/icons/
```

Luego reemplaza los elementos con clase `logo-slot` por etiquetas `<img>`.

## Donde poner los retos reales

Abre `challenges.js` y completa cada objeto. No se invento contenido de retos; la plantilla deja campos vacios para que pegues la informacion final.

Ejemplo de estructura dentro del archivo:

```js
{
  id: "education",
  icon: "\\uD83D\\uDCDA",
  label: "Educacion",
  title: "",
  context: "",
  problem: "",
  objective: "",
  deliverables: [],
  restrictions: []
}
```

Puedes llenar `deliverables` y `restrictions` como arrays de strings.

## Configurar Firebase Firestore

### 1. Crear proyecto

1. Entra a Firebase Console.
2. Crea un proyecto nuevo.
3. En el menu Build, abre Firestore Database.
4. Crea una base de datos Firestore.
5. Selecciona la region que prefieras.

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

Por usar modulos ES6, abre el proyecto con un servidor local, no con doble clic.

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
4. En Build and deployment, selecciona Deploy from a branch.
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
- [ ] Pegar los retos reales en `challenges.js`.
- [ ] Cambiar hora de presentaciones si aplica.
- [ ] Agregar logos en `assets/images/`.
- [ ] Probar con dos navegadores al mismo tiempo para validar el bloqueo en tiempo real.

## Mantenimiento futuro

Para reutilizar esta app en otros hackathons:

1. Cambia `EVENT_CONFIG` en `challenges.js`.
2. Cambia las categorias o retos en `CHALLENGES`.
3. Cambia colores en `:root` dentro de `styles.css`.
4. Mantén Firestore como fuente de verdad para reclamos en vivo.
