<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Adicionar Especialista" />

      <b-row>
        <b-col lg="8" offset-lg="2">
          <ExpertForm :expert="expert" @submit="add">
            <button
              type="submit"
              class="btn btn-outline-success btn-lg mr-2 mb-2"
            >
              <i class="fas fa-plus-square"></i> ADICIONAR
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
import { ADD_EXPERT } from "@/store/experts/expert.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import ExpertForm from "@/components/ExpertForm.vue";
import router from "@/router";
import { mapGetters } from "vuex";

export default {
  name: "AddExpert",
  components: {
    HeaderPage,
    ExpertForm
  },
  data: () => {
    return {
      expert: {
        title: "",
        name: "",
        email: "",
        specialty: "",
        institution: "",
        bio: "",
        families: [],
        active: true
      }
    };
  },
  computed: {
    ...mapGetters("expert", ["getMessage"])
  },
  methods: {
    add() {
      this.$store.dispatch(`expert/${ADD_EXPERT}`, this.$data.expert).then(
        () => {
          this.$alert(this.getMessage, "Especialista adicionado!", "success");
          router.push({ name: "listExperts" });
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    }
  }
};
</script>
