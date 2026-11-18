<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Gestão de Especialistas" />

      <b-row class="mb-4">
        <b-col lg="10" offset-lg="1">
          <nav aria-label="Ações da gestão de especialistas">
            <router-link
              :to="{ name: 'addExpert' }"
              tag="button"
              class="btn btn-outline-success mr-2 mt-2"
            >
              <i class="fas fa-plus-square"></i> ADICIONAR ESPECIALISTA
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
              <label for="txtSearchExpert" class="sr-only"
                >Pesquisar especialista</label
              >
              <input
                id="txtSearchExpert"
                v-model="search"
                type="search"
                class="form-control"
                placeholder="pesquisar por nome, especialidade ou instituição"
              />
            </div>
            <div class="col-md-4 mb-2">
              <label for="sltFamilyExpert" class="sr-only"
                >Filtrar por família</label
              >
              <select
                id="sltFamilyExpert"
                v-model="familyFilter"
                class="form-control"
              >
                <option value="">TODAS AS FAMÍLIAS</option>
                <option
                  v-for="family of familyCatalog"
                  :key="family"
                  :value="family"
                >
                  {{ family }}
                </option>
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
                  filteredExperts.length
                }}
                de
                {{
                  experts.length
                }}
                especialistas
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
                      @click="sortExperts()"
                      @keyup.enter="sortExperts()"
                    ></i>
                  </th>
                  <th scope="col" class="d-none d-md-table-cell">
                    ESPECIALIDADE
                  </th>
                  <th scope="col" class="d-none d-lg-table-cell">FAMÍLIAS</th>
                  <th scope="col">ESTADO</th>
                  <th scope="col">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="expert of filteredExperts" :key="expert._id">
                  <td class="pt-4">{{ fullName(expert) }}</td>
                  <td class="pt-4 d-none d-md-table-cell">
                    {{ expert.specialty }}
                  </td>
                  <td class="pt-4 d-none d-lg-table-cell">
                    {{ expert.families.join(", ") }}
                  </td>
                  <td class="pt-4">
                    <span
                      :class="
                        expert.active
                          ? 'badge badge-success'
                          : 'badge badge-secondary'
                      "
                    >
                      {{ expert.active ? "Ativo" : "Inativo" }}
                    </span>
                  </td>
                  <td>
                    <router-link
                      :to="{
                        name: 'editExpert',
                        params: { expertId: expert._id }
                      }"
                      tag="button"
                      class="btn btn-outline-success mr-2 mt-2"
                    >
                      <i class="fas fa-edit"></i> EDITAR
                    </router-link>
                    <button
                      type="button"
                      class="btn btn-outline-success mr-2 mt-2"
                      @click="viewExpert(expert._id)"
                    >
                      <i class="fas fa-search"></i> VER
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-danger mr-2 mt-2"
                      @click="removeExpert(expert._id)"
                    >
                      <i class="fas fa-trash-alt"></i> REMOVER
                    </button>
                  </td>
                </tr>
                <tr v-if="!filteredExperts.length">
                  <td colspan="5" class="text-center text-muted py-4">
                    Nenhum especialista encontrado.
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
import { FETCH_EXPERTS, REMOVE_EXPERT } from "@/store/experts/expert.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import { familyCatalog, animalsOfFamily } from "@/api/catalog";
import { formatDate, escapeHtml } from "@/helpers/format";
import { mapGetters } from "vuex";

const MODULE_NAME = "expert";

export default {
  name: "ManageExperts",
  components: {
    HeaderPage
  },
  data: function() {
    return {
      experts: [],
      sortType: 1,
      search: "",
      familyFilter: "",
      familyCatalog
    };
  },
  computed: {
    ...mapGetters(MODULE_NAME, ["getExperts", "getMessage"]),
    filteredExperts() {
      const needle = this.search.trim().toLowerCase();
      return this.experts.filter(expert => {
        const text = `${expert.name} ${expert.specialty} ${expert.institution}`;
        const matchesText = !needle || text.toLowerCase().includes(needle);
        const matchesFamily =
          !this.familyFilter || expert.families.includes(this.familyFilter);
        return matchesText && matchesFamily;
      });
    }
  },
  methods: {
    fetchExperts() {
      this.$store.dispatch(`${MODULE_NAME}/${FETCH_EXPERTS}`).then(
        () => {
          this.experts = [...this.getExperts].sort(this.compareNames);
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    },
    sortExperts() {
      this.sortType *= -1;
      this.experts.sort(this.compareNames);
    },
    compareNames(e1, e2) {
      return e1.name.localeCompare(e2.name, "pt") * this.sortType;
    },
    fullName(expert) {
      return expert.title ? `${expert.title} ${expert.name}` : expert.name;
    },

    viewExpert(id) {
      const expert = this.experts.find(expert => expert._id === id);
      this.$fire({
        title: escapeHtml(this.fullName(expert)),
        html: this.generateTemplate(expert)
      });
    },

    generateTemplate(expert) {
      const families = expert.families
        .map(
          f =>
            `<li>${escapeHtml(f)} <small>(${escapeHtml(
              animalsOfFamily(f).join(", ")
            )})</small></li>`
        )
        .join("");
      return `
        <article class="text-left">
          <h5>${escapeHtml(expert.specialty)}</h5>
          <p>${escapeHtml(expert.bio)}</p>
          <dl>
            <dt>Estado</dt><dd>${expert.active ? "Ativo" : "Inativo"}</dd>
            <dt>Instituição</dt><dd>${escapeHtml(expert.institution)}</dd>
            <dt>E-mail</dt><dd><a href="mailto:${escapeHtml(
              expert.email
            )}">${escapeHtml(expert.email)}</a></dd>
            <dt>Famílias</dt><dd><ul>${families}</ul></dd>
            <dt>Data de registo</dt><dd><time datetime="${
              expert.registration_date
            }">${formatDate(expert.registration_date)}</time></dd>
          </dl>
        </article>
      `;
    },

    removeExpert(id) {
      const expert = this.experts.find(expert => expert._id === id);
      this.$confirm(
        "Se sim, clique em OK",
        `Deseja mesmo remover o especialista ${escapeHtml(
          this.fullName(expert)
        )}?`,
        "warning",
        { confirmButtonText: "OK", cancelButtonText: "Cancelar" }
      ).then(
        () => {
          this.$store.dispatch(`${MODULE_NAME}/${REMOVE_EXPERT}`, id).then(
            () => {
              this.$alert(this.getMessage, "Especialista removido!", "success");
              this.fetchExperts();
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
    this.fetchExperts();
  }
};
</script>
