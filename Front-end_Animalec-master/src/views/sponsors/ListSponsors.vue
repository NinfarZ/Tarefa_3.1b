<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Gestão de Patrocinadores" />

      <b-row class="mb-4">
        <b-col lg="10" offset-lg="1">
          <nav aria-label="Ações da gestão de patrocinadores">
            <router-link
              :to="{ name: 'addSponsor' }"
              tag="button"
              class="btn btn-outline-success mr-2 mt-2"
            >
              <i class="fas fa-plus-square"></i> ADICIONAR PATROCINADOR
            </router-link>
            <router-link
              :to="{ name: 'admin' }"
              tag="button"
              class="btn btn-outline-info mr-2 mt-2"
            >
              <i class="fas fa-bars"></i> MENU PRINCIPAL
            </router-link>
          </nav>
        </b-col>
      </b-row>

      <b-row class="mb-3">
        <b-col lg="10" offset-lg="1">
          <form class="form-row" role="search" @submit.prevent>
            <div class="col-md-8 mb-2">
              <label for="txtSearchSponsor" class="sr-only"
                >Pesquisar patrocinador</label
              >
              <input
                id="txtSearchSponsor"
                v-model="search"
                type="search"
                class="form-control"
                placeholder="pesquisar por nome, e-mail ou animal"
              />
            </div>
            <div class="col-md-4 mb-2">
              <label for="sltStateSponsor" class="sr-only"
                >Filtrar por estado</label
              >
              <select
                id="sltStateSponsor"
                v-model="stateFilter"
                class="form-control"
              >
                <option value="all">TODOS OS ESTADOS</option>
                <option value="active">ATIVOS</option>
                <option value="inactive">INATIVOS</option>
              </select>
            </div>
          </form>
        </b-col>
      </b-row>

      <b-row>
        <b-col lg="10" offset-lg="1">
          <div class="table-responsive">
            <table class="table table-striped">
              <caption>
                {{
                  filteredSponsors.length
                }}
                de
                {{
                  sponsors.length
                }}
                patrocinadores
              </caption>
              <thead class="thead-dark">
                <tr>
                  <th
                    scope="col"
                    :aria-sort="sortType === 1 ? 'ascending' : 'descending'"
                  >
                    NOME
                    <i
                      :class="
                        sortType === 1 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
                      "
                      role="button"
                      tabindex="0"
                      title="Ordenar por nome"
                      @click="sortSponsors()"
                      @keyup.enter="sortSponsors()"
                    ></i>
                  </th>
                  <th scope="col" class="d-none d-md-table-cell">ANIMAIS</th>
                  <th scope="col">ESTADO</th>
                  <th scope="col">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sponsor of filteredSponsors" :key="sponsor._id">
                  <td class="pt-4">{{ sponsor.name }}</td>
                  <td class="pt-4 d-none d-md-table-cell">
                    {{ animalNames(sponsor.animals) }}
                  </td>
                  <td class="pt-4">
                    <span
                      :class="
                        sponsor.active
                          ? 'badge badge-success'
                          : 'badge badge-secondary'
                      "
                    >
                      {{ sponsor.active ? "Ativo" : "Inativo" }}
                    </span>
                  </td>
                  <td>
                    <router-link
                      :to="{
                        name: 'editSponsor',
                        params: { sponsorId: sponsor._id }
                      }"
                      tag="button"
                      class="btn btn-outline-success mr-2 mt-2"
                    >
                      <i class="fas fa-edit"></i> EDITAR
                    </router-link>
                    <button
                      type="button"
                      class="btn btn-outline-success mr-2 mt-2"
                      @click="viewSponsor(sponsor._id)"
                    >
                      <i class="fas fa-search"></i> VER
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-danger mr-2 mt-2"
                      @click="removeSponsor(sponsor._id)"
                    >
                      <i class="fas fa-trash-alt"></i> REMOVER
                    </button>
                  </td>
                </tr>
                <tr v-if="!filteredSponsors.length">
                  <td colspan="4" class="text-center text-muted py-4">
                    Nenhum patrocinador encontrado.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import {
  FETCH_SPONSORS,
  REMOVE_SPONSOR
} from "@/store/sponsors/sponsor.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import { animalName } from "@/api/catalog";
import { formatDate, escapeHtml } from "@/helpers/format";
import { mapGetters } from "vuex";

const MODULE_NAME = "sponsor";

export default {
  name: "ManageSponsors",
  components: {
    HeaderPage
  },
  data: function() {
    return {
      sponsors: [],
      sortType: 1,
      search: "",
      stateFilter: "all"
    };
  },
  computed: {
    ...mapGetters(MODULE_NAME, ["getSponsors", "getMessage"]),
    filteredSponsors() {
      const needle = this.search.trim().toLowerCase();
      return this.sponsors.filter(sponsor => {
        const text = `${sponsor.name} ${sponsor.email} ${this.animalNames(
          sponsor.animals
        )}`;
        const matchesText = !needle || text.toLowerCase().includes(needle);
        const matchesState =
          this.stateFilter === "all" ||
          sponsor.active === (this.stateFilter === "active");
        return matchesText && matchesState;
      });
    }
  },
  methods: {
    fetchSponsors() {
      this.$store.dispatch(`${MODULE_NAME}/${FETCH_SPONSORS}`).then(
        () => {
          this.sponsors = [...this.getSponsors].sort(this.compareNames);
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    },
    sortSponsors() {
      this.sortType *= -1;
      this.sponsors.sort(this.compareNames);
    },
    compareNames(s1, s2) {
      return s1.name.localeCompare(s2.name, "pt") * this.sortType;
    },
    animalNames(ids) {
      return (ids || []).map(animalName).join(", ");
    },

    viewSponsor(id) {
      const sponsor = this.sponsors.find(sponsor => sponsor._id === id);
      this.$fire({
        title: escapeHtml(sponsor.name),
        html: this.generateTemplate(sponsor),
        imageUrl: sponsor.logo || undefined,
        imageWidth: 150,
        imageHeight: 150,
        imageAlt: `Logótipo de ${sponsor.name}`
      });
    },

    generateTemplate(sponsor) {
      const website = escapeHtml(sponsor.website);
      return `
        <article class="text-left">
          <p>${escapeHtml(sponsor.description)}</p>
          <dl>
            <dt>Estado</dt><dd>${sponsor.active ? "Ativo" : "Inativo"}</dd>
            <dt>E-mail</dt><dd><a href="mailto:${escapeHtml(
              sponsor.email
            )}">${escapeHtml(sponsor.email)}</a></dd>
            <dt>Website</dt><dd><a href="${website}" target="_blank" rel="noopener noreferrer">${website}</a></dd>
            <dt>Animais patrocinados</dt><dd>${escapeHtml(
              this.animalNames(sponsor.animals)
            ) || "—"}</dd>
            <dt>Data de registo</dt><dd><time datetime="${
              sponsor.registration_date
            }">${formatDate(sponsor.registration_date)}</time></dd>
          </dl>
        </article>
      `;
    },

    removeSponsor(id) {
      const sponsor = this.sponsors.find(sponsor => sponsor._id === id);
      this.$confirm(
        "Se sim, clique em OK",
        `Deseja mesmo remover o patrocinador ${escapeHtml(sponsor.name)}?`,
        "warning",
        { confirmButtonText: "OK", cancelButtonText: "Cancelar" }
      ).then(
        () => {
          this.$store.dispatch(`${MODULE_NAME}/${REMOVE_SPONSOR}`, id).then(
            () => {
              this.$alert(this.getMessage, "Patrocinador removido!", "success");
              this.fetchSponsors();
            },
            err => this.$alert(`${err.message}`, "Erro", "error")
          );
        },
        () => {
          this.$alert("Remoção cancelada!", "Informação", "info");
        }
      );
    }
  },
  created() {
    this.fetchSponsors();
  }
};
</script>
