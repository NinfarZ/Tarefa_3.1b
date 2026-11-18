<template>
  <form @submit.prevent="$emit('submit')">
    <fieldset>
      <legend class="h5">Dados do patrocinador</legend>
      <div class="form-group">
        <label for="txtSponsorName">Nome</label>
        <input
          id="txtSponsorName"
          v-model="sponsor.name"
          type="text"
          class="form-control form-control-lg"
          placeholder="escreve nome"
          maxlength="80"
          required
        />
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="txtSponsorEmail">E-mail</label>
          <input
            id="txtSponsorEmail"
            v-model="sponsor.email"
            type="email"
            class="form-control form-control-lg"
            placeholder="escreve e-mail"
            required
          />
        </div>
        <div class="form-group col-md-6">
          <label for="txtSponsorWebsite">Website</label>
          <input
            id="txtSponsorWebsite"
            v-model="sponsor.website"
            type="url"
            class="form-control form-control-lg"
            placeholder="https://"
            required
          />
        </div>
      </div>
      <div class="form-group">
        <label for="txtSponsorLogo"
          >Logótipo (link para imagem, opcional)</label
        >
        <input
          id="txtSponsorLogo"
          v-model="sponsor.logo"
          type="url"
          class="form-control form-control-lg"
          placeholder="https://"
        />
      </div>
      <div class="form-group">
        <label for="txtSponsorDescription">Descrição</label>
        <textarea
          id="txtSponsorDescription"
          v-model="sponsor.description"
          class="form-control form-control-lg"
          placeholder="escreve descrição"
          rows="5"
          maxlength="500"
          required
        ></textarea>
      </div>
    </fieldset>

    <fieldset class="mt-3">
      <legend class="h5">Animais patrocinados</legend>
      <div class="form-row">
        <div
          v-for="animal of animalCatalog"
          :key="animal.id"
          class="col-6 col-md-4 form-check-wrapper"
        >
          <div class="form-check">
            <input
              :id="`chkAnimal-${animal.id}`"
              v-model="sponsor.animals"
              :value="animal.id"
              type="checkbox"
              class="form-check-input"
            />
            <label :for="`chkAnimal-${animal.id}`" class="form-check-label">
              {{ animal.name }}
            </label>
          </div>
        </div>
      </div>
    </fieldset>

    <fieldset class="mt-3">
      <legend class="h5">Estado</legend>
      <div class="form-check">
        <input
          id="chkSponsorActive"
          v-model="sponsor.active"
          type="checkbox"
          class="form-check-input"
        />
        <label for="chkSponsorActive" class="form-check-label">
          Patrocinador ativo (visível na aplicação)
        </label>
      </div>
    </fieldset>

    <footer class="mt-4">
      <slot></slot>
    </footer>
  </form>
</template>

<script>
import { animalCatalog } from "@/api/catalog";

export default {
  name: "SponsorForm",
  props: ["sponsor"],
  data: () => ({ animalCatalog })
};
</script>
