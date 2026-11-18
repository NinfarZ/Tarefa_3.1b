const STORAGE_KEY = "animalec_backoffice_db";

const seed = {
  sponsors: [
    {
      _id: "s1",
      name: "EcoPets",
      email: "geral@ecopets.example.org",
      website: "https://ecopets.example.org",
      logo: "",
      description:
        "Parceiro de sensibilização ambiental e proteção de felinos.",
      animals: ["tigre", "castor"],
      active: true,
      registration_date: "2026-09-02T10:15:00.000Z"
    },
    {
      _id: "s2",
      name: "PetCare",
      email: "contacto@petcare.example.org",
      website: "https://petcare.example.org",
      logo: "",
      description: "Apoia a divulgação de espécies domésticas.",
      animals: ["cao", "gato"],
      active: true,
      registration_date: "2026-09-20T15:40:00.000Z"
    },
    {
      _id: "s3",
      name: "AnimalPlus",
      email: "info@animalplus.example.org",
      website: "https://animalplus.example.org",
      logo: "",
      description: "Patrocinador de conteúdos educativos sobre aves.",
      animals: ["pardal"],
      active: false,
      registration_date: "2026-10-11T09:05:00.000Z"
    }
  ],
  experts: [
    {
      _id: "e1",
      name: "Pedro Silva",
      title: "Dr.",
      email: "pedro.silva@example.org",
      specialty: "Medicina Veterinária",
      institution: "Centro de Estudos da Fauna",
      families: ["Canidae"],
      bio: "Especialista em saúde e bem-estar de canídeos.",
      active: true,
      registration_date: "2026-08-30T11:00:00.000Z"
    },
    {
      _id: "e2",
      name: "Ana Costa",
      title: "Dra.",
      email: "ana.costa@example.org",
      specialty: "Comportamento Animal",
      institution: "Instituto de Biologia",
      families: ["Felidae", "Canidae"],
      bio: "Investigadora dedicada ao comportamento de felinos e canídeos.",
      active: true,
      registration_date: "2026-09-14T16:20:00.000Z"
    },
    {
      _id: "e3",
      name: "Miguel Santos",
      title: "Prof.",
      email: "miguel.santos@example.org",
      specialty: "Conservação",
      institution: "Centro de Biodiversidade",
      families: ["Delphinidae", "Castoridae"],
      bio: "Investigação sobre conservação de habitats aquáticos.",
      active: false,
      registration_date: "2026-10-03T08:45:00.000Z"
    }
  ]
};

const clone = value =>
  value === undefined ? undefined : JSON.parse(JSON.stringify(value));

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (
      saved &&
      Array.isArray(saved.sponsors) &&
      Array.isArray(saved.experts)
    ) {
      return saved;
    }
  } catch (e) {
    return clone(seed);
  }
  return clone(seed);
}

const db = load();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return true;
  } catch (e) {
    return false;
  }
}

export function readCollection(name) {
  return clone(db[name]);
}

export function writeCollection(name, items) {
  db[name] = clone(items);
  persist();
}

export function newId() {
  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .slice(2, 8)
  );
}

export function respond(http, message, body) {
  return new Promise(resolve =>
    setTimeout(() => resolve({ http, message, body: clone(body) }), 150)
  );
}
