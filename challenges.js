/*
  Challenge catalog.
  Do not place Firestore state here. This file only owns static challenge content.
  Fill the empty strings and arrays when the final challenges are approved.
*/

export const EVENT_CONFIG = Object.freeze({
  eventName: "Hackathon de Python",
  eventTagline: "From Code to Startup",
  presentationAt: "2026-07-06T16:00:00-05:00",
  presentationLabel: "4:00 p.m.",
  timezoneLabel: "Panama UTC-5"
});

export const CHALLENGES = Object.freeze([
  {
    id: "education",
    icon: "\uD83D\uDCDA",
    label: "Educaci\u00F3n",
    title: "",
    context: "",
    problem: "",
    objective: "",
    deliverables: [],
    restrictions: []
  },
  {
    id: "health",
    icon: "\uD83C\uDFE5",
    label: "Salud",
    title: "",
    context: "",
    problem: "",
    objective: "",
    deliverables: [],
    restrictions: []
  },
  {
    id: "sustainability",
    icon: "\uD83C\uDF31",
    label: "Sostenibilidad",
    title: "",
    context: "",
    problem: "",
    objective: "",
    deliverables: [],
    restrictions: []
  },
  {
    id: "automation",
    icon: "\u2699\uFE0F",
    label: "Automatizaci\u00F3n",
    title: "",
    context: "",
    problem: "",
    objective: "",
    deliverables: [],
    restrictions: []
  }
]);

export function getChallengeById(id) {
  return CHALLENGES.find((challenge) => challenge.id === id) || null;
}

export function getChallengeIds() {
  return CHALLENGES.map((challenge) => challenge.id);
}
