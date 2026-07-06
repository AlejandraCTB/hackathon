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
    brief: "Construyan una solución tecnológica en Python que atienda una problemática real del aprendizaje, la gestión académica o el acceso a recursos educativos.",
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
    brief: "Construyan una solución tecnológica en Python que apoye procesos de bienestar, prevención, seguimiento o gestión de información relacionada con salud.",
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
    brief: "Construyan una solución tecnológica en Python orientada a sostenibilidad, uso eficiente de recursos, conciencia ambiental o impacto social positivo.",
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
    brief: "Construyan una solución tecnológica en Python que automatice una tarea repetitiva, mejore un flujo de trabajo o reduzca errores en un proceso cotidiano.",
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
