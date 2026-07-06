/*
  Challenge catalog.
  Static challenge content only. Firestore owns realtime claim state.
*/

export const EVENT_CONFIG = Object.freeze({
  eventName: "Hackathon de Python",
  eventTagline: "From Code to Startup",
  presentationAt: "2026-07-06T16:00:00-05:00",
  presentationLabel: "4:00 p.m.",
  timezoneLabel: "Panama UTC-5",
  locationLabel: "Salón 3-411",
  modalityLabel: "Presencial",
  teamSizeLabel: "Equipos de 3 personas"
});

export const CHALLENGES = Object.freeze([
  {
    id: "education",
    icon: "📚",
    label: "Educación",
    title: "Reto: Educación",
    cardDescription: "Soluciones para aprendizaje, gestión académica y acceso a recursos educativos.",
    brief: "Los administradores de laboratorios universitarios o talleres técnicos gestionan el préstamo de herramientas y equipos costosos mediante bitácoras de papel o formularios estáticos, lo que genera pérdidas de inventario, retrasos en las prácticas y falta de responsables en caso de daños.",
    mission: "Identifiquen un usuario objetivo, definan una propuesta de valor clara y desarrollen un prototipo funcional que pueda demostrarse ante el jurado.",
    focus: ["Aprendizaje", "Gestión académica", "Acceso a recursos", "Experiencia estudiantil"],
    success: "La solución debe mostrar valor real para estudiantes, docentes o comunidades educativas, con una demo clara y funcional."
  },
  {
    id: "health",
    icon: "🏥",
    label: "Salud",
    title: "Reto: Salud",
    cardDescription: "Herramientas para bienestar, prevención, acompañamiento o gestión de información en salud.",
    brief: "Los pacientes con enfermedades crónicas y/o personas de la tercera edad, suelen olvidar si ya se tomaron la dosis exacta de sus medicamentos diarios, lo que genera duplicidad de dosis o tratamientos incompletos.",
    mission: "Definan un problema concreto, expliquen a quién beneficia y desarrollen un prototipo que demuestre cómo la tecnología puede mejorar la toma de decisiones o la experiencia del usuario.",
    focus: ["Bienestar", "Prevención", "Seguimiento", "Gestión de información"],
    success: "La solución debe comunicar impacto potencial, facilidad de uso y una propuesta de valor responsable."
  },
  {
    id: "sustainability",
    icon: "🌱",
    label: "Sostenibilidad",
    title: "Reto: Sostenibilidad",
    cardDescription: "Ideas para uso eficiente de recursos, conciencia ambiental e impacto social positivo.",
    brief: " El consumo fantasma de energía (dispositivos conectados que no se usan) y la falta de visibilidad en tiempo real hacen que los hogares y pequeñas oficinas desperdicien electricidad y paguen facturas altas sin saber por qué.",
    mission: "Conviertan una problemática ambiental o social en una propuesta funcional que pueda medirse, explicarse y presentarse como una oportunidad de emprendimiento.",
    focus: ["Recursos", "Datos ambientales", "Consumo responsable", "Impacto social"],
    success: "La solución debe demostrar un beneficio claro, medible o comunicable para usuarios, comunidades o instituciones."
  },
  {
    id: "automation",
    icon: "⚙️",
    label: "Automatización",
    title: "Reto: Automatización",
    cardDescription: "Prototipos para reducir tareas repetitivas, mejorar procesos y acelerar decisiones.",
    brief: "Las pequeñas empresas de logística y distribución pierden horas diarias planificando rutas de entrega de forma empírica en mapas tradicionales, lo que incrementa el gasto de combustible, acelera el desgaste de los vehículos y genera retrasos e insatisfacción en los clientes finales.",
    mission: "Detecten un proceso que consuma tiempo, diseñen una mejora concreta y desarrollen un prototipo que evidencie ahorro, eficiencia o mejor experiencia de uso.",
    focus: ["Productividad", "Flujos de trabajo", "Reducción de errores", "Procesos internos"],
    success: "La solución debe mostrar antes/después del proceso y explicar por qué la automatización genera valor real."
  }
]);

export function getChallengeById(id) {
  return CHALLENGES.find((challenge) => challenge.id === id) || null;
}

export function getChallengeIds() {
  return CHALLENGES.map((challenge) => challenge.id);
}
