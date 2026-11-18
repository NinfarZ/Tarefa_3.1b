import { readCollection, writeCollection, newId, respond } from "./localdb.js";

const COLLECTION = "experts";

function validate(expert, list) {
  const name = (expert.name || "").trim();
  if (!name) throw Error("Indique o nome do especialista.");
  if (!/^\S+@\S+\.\S+$/.test(expert.email || "")) {
    throw Error("Indique um e-mail válido.");
  }
  if (!expert.families || !expert.families.length) {
    throw Error("Escolha pelo menos uma família de animais.");
  }
  const duplicated = list.some(
    e =>
      e._id !== expert._id &&
      e.email.toLowerCase() === expert.email.toLowerCase()
  );
  if (duplicated) throw Error("Já existe um especialista com esse e-mail.");
  return { ...expert, name };
}

export const expertService = {
  async getExperts() {
    return respond(200, "Especialistas obtidos.", readCollection(COLLECTION));
  },

  async addExpert(token, payload) {
    const list = readCollection(COLLECTION);
    const expert = {
      ...validate(payload, list),
      _id: newId(),
      registration_date: new Date().toISOString()
    };
    list.push(expert);
    writeCollection(COLLECTION, list);
    return respond(201, "Especialista criado.", expert);
  },

  async editExpert(token, payload) {
    const list = readCollection(COLLECTION);
    const index = list.findIndex(e => e._id === payload._id);
    if (index < 0) throw Error("Especialista não encontrado.");
    list[index] = validate(payload, list);
    writeCollection(COLLECTION, list);
    return respond(200, "Especialista atualizado.", list[index]);
  },

  async removeExpert(token, id) {
    const list = readCollection(COLLECTION);
    if (!list.some(e => e._id === id))
      throw Error("Especialista não encontrado.");
    writeCollection(COLLECTION, list.filter(e => e._id !== id));
    return respond(200, "Especialista removido.");
  }
};

export default expertService;
