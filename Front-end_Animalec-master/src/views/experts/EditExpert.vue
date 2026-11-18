<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Editar Especialista" />

      <b-row>
        <b-col lg="8" offset-lg="2">
          <ExpertForm v-if="expert" :expert="expert" @submit="update">
            <button
              type="submit"
              class="btn btn-outline-success btn-lg mr-2 mb-2"
            >
              <i class="fas fa-edit"></i> ATUALIZAR
            </button>
            <router-link
              :to="{ name: 'listExperts' }"
              tag="button"
              type="button"
              class="btn btn-outline-danger btn-lg mb-2"
            >
              <i class="fas fa-window-close"></i> CANCELAR
            </router-link>
          </ExpertForm>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { FETCH_EXPERTS, EDIT_EXPERT } from "@/store/experts/expert.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import ExpertForm from "@/components/ExpertForm.vue";
import router from "@/router";
import { mapGetters } from "vuex";

export default {
  name: "EditExpert",
  components: {
    HeaderPage,
    ExpertForm
  },
  data: () => {
    return {
      expert: null
    };
  },
  computed: {
    ...mapGetters("expert", ["getExpertsById", "getMessage"])
  },
  methods: {
    loadExpert() {
      const expert = this.getExpertsById(this.$route.params.expertId);
      if (!expert) {
        this.$alert("Especialista não encontrado.", "Erro", "error");
        router.push({ name: "listExperts" });
        return;
      }
      this.expert = JSON.parse(JSON.stringify(expert));
    },
    update() {
      this.$store.dispatch(`expert/${EDIT_EXPERT}`, this.$data.expert).then(
        () => {
          this.$alert(this.getMessage, "Especialista atualizado!", "success");
          router.push({ name: "listExperts" });
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    }
  },
  created() {
    if (this.getExpertsById(this.$route.params.expertId)) {
      this.loadExpert();
    } else {
      this.$store
        .dispatch(`expert/${FETCH_EXPERTS}`)
        .then(this.loadExpert, err =>
          this.$alert(`${err.message}`, "Erro", "error")
        );
    }
  }
};
</script>
