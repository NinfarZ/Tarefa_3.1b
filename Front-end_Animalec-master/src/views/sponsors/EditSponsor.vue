<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Editar Patrocinador" />

      <b-row>
        <b-col lg="8" offset-lg="2">
          <SponsorForm v-if="sponsor" :sponsor="sponsor" @submit="update">
            <button
              type="submit"
              class="btn btn-outline-success btn-lg mr-2 mb-2"
            >
              <i class="fas fa-edit"></i> ATUALIZAR
            </button>
            <router-link
              :to="{ name: 'listSponsors' }"
              tag="button"
              type="button"
              class="btn btn-outline-danger btn-lg mb-2"
            >
              <i class="fas fa-window-close"></i> CANCELAR
            </router-link>
          </SponsorForm>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import {
  FETCH_SPONSORS,
  EDIT_SPONSOR
} from "@/store/sponsors/sponsor.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import SponsorForm from "@/components/SponsorForm.vue";
import router from "@/router";
import { mapGetters } from "vuex";

export default {
  name: "EditSponsor",
  components: {
    HeaderPage,
    SponsorForm
  },
  data: () => {
    return {
      sponsor: null
    };
  },
  computed: {
    ...mapGetters("sponsor", ["getSponsorsById", "getMessage"])
  },
  methods: {
    loadSponsor() {
      const sponsor = this.getSponsorsById(this.$route.params.sponsorId);
      if (!sponsor) {
        this.$alert("Patrocinador não encontrado.", "Erro", "error");
        router.push({ name: "listSponsors" });
        return;
      }
      this.sponsor = JSON.parse(JSON.stringify(sponsor));
    },
    update() {
      this.$store.dispatch(`sponsor/${EDIT_SPONSOR}`, this.$data.sponsor).then(
        () => {
          this.$alert(this.getMessage, "Patrocinador atualizado!", "success");
          router.push({ name: "listSponsors" });
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    }
  },
  created() {
    if (this.getSponsorsById(this.$route.params.sponsorId)) {
      this.loadSponsor();
    } else {
      this.$store
        .dispatch(`sponsor/${FETCH_SPONSORS}`)
        .then(this.loadSponsor, err =>
          this.$alert(`${err.message}`, "Erro", "error")
        );
    }
  }
};
</script>
