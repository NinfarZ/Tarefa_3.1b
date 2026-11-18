export const animalCatalog = [
  { id: "cao", name: "Cão", family: "Canidae", group: "mamífero" },
  { id: "lobo", name: "Lobo", family: "Canidae", group: "mamífero" },
  { id: "gato", name: "Gato", family: "Felidae", group: "mamífero" },
  { id: "tigre", name: "Tigre", family: "Felidae", group: "mamífero" },
  { id: "leao", name: "Leão", family: "Felidae", group: "mamífero" },
  { id: "castor", name: "Castor", family: "Castoridae", group: "mamífero" },
  {
    id: "golfinho",
    name: "Golfinho",
    family: "Delphinidae",
    group: "mamífero"
  },
  { id: "pardal", name: "Pardal", family: "Passeridae", group: "ave" },
  { id: "sapo", name: "Sapo", family: "Bufonidae", group: "anfíbio" }
];

export const familyCatalog = [
  ...new Set(animalCatalog.map(animal => animal.family))
].sort((a, b) => a.localeCompare(b, "pt"));

export function animalName(id) {
  const animal = animalCatalog.find(a => a.id === id);
  return animal ? animal.name : id;
}

export function animalsOfFamily(family) {
  return animalCatalog.filter(a => a.family === family).map(a => a.name);
}
