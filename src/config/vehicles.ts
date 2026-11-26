/**
 * Lista de montadoras e modelos populares no Brasil, usada APENAS
 * como sugestão de preenchimento no seletor de baterias.
 *
 * Isto NÃO é uma base de aplicação (não diz qual bateria serve em
 * qual carro). Quando existir uma base validada, implemente-a em
 * `src/lib/applications.ts`.
 */
export const vehicleMakes: { name: string; models: string[] }[] = [
  { name: "Fiat", models: ["Argo", "Cronos", "Mobi", "Pulse", "Fastback", "Strada", "Toro", "Uno", "Palio", "Siena", "Doblò", "Fiorino"] },
  { name: "Volkswagen", models: ["Gol", "Polo", "Virtus", "T-Cross", "Nivus", "Saveiro", "Voyage", "Fox", "Up!", "Jetta", "Taos", "Amarok"] },
  { name: "Chevrolet", models: ["Onix", "Onix Plus", "Tracker", "Spin", "S10", "Montana", "Cruze", "Prisma", "Cobalt", "Celta", "Corsa", "Equinox"] },
  { name: "Toyota", models: ["Corolla", "Corolla Cross", "Yaris", "Etios", "Hilux", "SW4", "RAV4"] },
  { name: "Hyundai", models: ["HB20", "HB20S", "Creta", "Tucson", "i30", "Santa Fe"] },
  { name: "Honda", models: ["Civic", "City", "HR-V", "Fit", "WR-V", "CR-V"] },
  { name: "Renault", models: ["Kwid", "Sandero", "Logan", "Duster", "Captur", "Oroch", "Master"] },
  { name: "Jeep", models: ["Renegade", "Compass", "Commander"] },
  { name: "Ford", models: ["Ka", "Fiesta", "EcoSport", "Ranger", "Focus", "Territory", "Transit"] },
  { name: "Nissan", models: ["Kicks", "Versa", "March", "Sentra", "Frontier"] },
  { name: "Peugeot", models: ["208", "2008", "3008", "Partner"] },
  { name: "Citroën", models: ["C3", "C4 Cactus", "Aircross", "Jumpy"] },
  { name: "Mitsubishi", models: ["L200", "Pajero", "ASX", "Outlander", "Eclipse Cross"] },
  { name: "BYD", models: ["Dolphin", "Dolphin Mini", "Song Plus", "Seal", "King"] },
  { name: "Kia", models: ["Sportage", "Cerato", "Picanto", "Sorento", "Stonic"] },
];

export const engineOptions = ["1.0", "1.0 Turbo", "1.3", "1.4", "1.5", "1.6", "1.8", "2.0", "2.0 Turbo", "Diesel", "Híbrido", "Elétrico"];

export const currentYear = new Date().getFullYear();
export const yearOptions = Array.from({ length: currentYear + 1 - 1995 + 1 }, (_, i) => String(currentYear + 1 - i));
