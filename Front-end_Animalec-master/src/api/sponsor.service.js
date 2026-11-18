import { readCollection, writeCollection, newId, respond } from "./localdb.js";

const COLLECTION = "sponsors";

function validate(sponsor, list) {
  const name = (sponsor.name || "").trim();
  if (!name) throw Error("Indique o nome do patrocinador.");
  if (!/^https?:\/\/\S+\.\S+/.test(sponsor.website || "")) {
    throw Error("O website deve começar por http:// ou https://.");
  }
  if (sponsor.logo && !/^https?:\/\/\S+/.test(sponsor.logo)) {
    throw Error("O link do logótipo deve começar por http:// ou https://.");
  }
  const duplicated = list.some(
    s => s._id !== sponsor._id && s.name.toLowerCase() === name.toLowerCase()
  );
  if (duplicated) throw Error("Já existe um patrocinador com esse nome.");
  return { ...sponsor, name };
}

export const sponsorService = {
  async getSponsors() {
    return respond(200, "Patrocinadores obtidos.", readCollection(COLLECTION));
  },

  async addSponsor(token, payload) {
    const list = readCollection(COLLECTION);
    const sponsor = {
      ...validate(payload, list),
      _id: newId(),
      registration_date: new Date().toISOString()
    };
    list.push(sponsor);
    writeCollection(COLLECTION, list);
    return respond(201, "Patrocinador criado.", sponsor);
  },

  async editSponsor(token, payload) {
    const list = readCollection(COLLECTION);
    const index = list.findIndex(s => s._id === payload._id);
    if (index < 0) throw Error("Patrocinador não encontrado.");
    list[index] = validate(payload, list);
    writeCollection(COLLECTION, list);
    return respond(200, "Patrocinador atualizado.", list[index]);
  },

  async removeSponsor(token, id) {
    const list = readCollection(COLLECTION);
    if (!list.some(s => s._id === id))
      throw Error("Patrocinador não encontrado.");
    writeCollection(COLLECTION, list.filter(s => s._id !== id));
    return respond(200, "Patrocinador removido.");
  }
};

export default sponsorService;
