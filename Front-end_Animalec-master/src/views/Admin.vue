<template>
  <section class="page-section">
    <b-container fluid>
      <HeaderPage title="Gestão do Animalec" />

      <b-row>
        <b-col
          sm="10"
          offset-sm="1"
          md="8"
          offset-md="2"
          lg="6"
          offset-lg="3"
          xl="4"
          offset-xl="4"
        >
          <nav aria-label="Entidades do back-office">
            <b-card-group deck>
              <AdminOptionBox
                routeName="listUsers"
                iconName="users"
                title="Utilizadores"
              />
              <AdminOptionBox
                routeName="listAnimals"
                iconName="dog"
                title="Animais"
              />
            </b-card-group>
            <b-card-group deck class="mt-3">
              <AdminOptionBox
                routeName="listQuizzes"
                iconName="file-alt"
                title="Quizzes"
              />
              <AdminOptionBox
                routeName="listQuestions"
                iconName="question-circle"
                title="Questões"
              />
            </b-card-group>
            <b-card-group deck class="mt-3">
              <AdminOptionBox
                routeName="listSponsors"
                iconName="handshake"
                title="Patrocinadores"
              />
              <AdminOptionBox
                routeName="listExperts"
                iconName="user-graduate"
                title="Especialistas"
              />
            </b-card-group>
          </nav>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script>
import HeaderPage from "@/components/HeaderPage.vue";
import AdminOptionBox from "@/components/AdminOptionBox.vue";

export default {
  components: {
    HeaderPage,
    AdminOptionBox
  }
};
</script>

<style scoped>
.card-deck >>> .card-header {
  padding: 0.75rem 0.25rem;
  font-size: 0.95rem;
  white-space: nowrap;
}
</style>
