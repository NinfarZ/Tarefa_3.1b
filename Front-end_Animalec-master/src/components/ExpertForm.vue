<template>
  <form @submit.prevent="$emit('submit')">
    <fieldset>
      <legend class="h5">Dados do especialista</legend>
      <div class="form-row">
        <div class="form-group col-md-3">
          <label for="sltExpertTitle">Título</label>
          <select
            id="sltExpertTitle"
            v-model="expert.title"
            class="form-control form-control-lg"
          >
            <option value="">—</option>
            <option>Dr.</option>
            <option>Dra.</option>
            <option>Prof.</option>
            <option>Prof.ª</option>
          </select>
        </div>
        <div class="form-group col-md-9">
          <label for="txtExpertName">Nome</label>
          <input
            id="txtExpertName"
            v-model="expert.name"
            type="text"
            class="form-control form-control-lg"
            placeholder="escreve nome"
            maxlength="80"
            required
          />
        </div>
      </div>
      <div class="form-group">
        <label for="txtExpertEmail">E-mail</label>
        <input
          id="txtExpertEmail"
          v-model="expert.email"
          type="email"
          class="form-control form-control-lg"
          placeholder="escreve e-mail"
          required
        />
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="txtExpertSpecialty">Especialidade</label>
          <input
            id="txtExpertSpecialty"
            v-model="expert.specialty"
            type="text"
            class="form-control form-control-lg"
            placeholder="ex.: Comportamento Animal"
            required
          />
        </div>
        <div class="form-group col-md-6">
          <label for="txtExpertInstitution">Instituição</label>
          <input
            id="txtExpertInstitution"
            v-model="expert.institution"
            type="text"
            class="form-control form-control-lg"
            placeholder="escreve instituição"
            required
          />
        </div>
      </div>
      <div class="form-group">
        <label for="txtExpertBio">Nota biográfica</label>
        <textarea
          id="txtExpertBio"
          v-model="expert.bio"
          class="form-control form-control-lg"
          placeholder="escreve nota biográfica"
          rows="5"
          maxlength="500"
          required
        ></textarea>
      </div>
    </fieldset>

    <fieldset class="mt-3">
      <legend class="h5">Famílias de animais em que é especialista</legend>
      <div class="form-row">
        <div
          v-for="family of familyCatalog"
          :key="family"
          class="col-12 col-md-6"
        >
          <div class="form-check">
            <input
              :id="`chkFamily-${family}`"
              v-model="expert.families"
              :value="family"
              type="checkbox"
              class="form-check-input"
            />
            <label :for="`chkFamily-${family}`" class="form-check-label">
              {{ family }}
              <small class="text-muted"
                >({{ animalsOfFamily(family).join(", ") }})</small
              >
            </label>
          </div>
        </div>
      </div>
    </fieldset>

    <fieldset class="mt-3">
      <legend class="h5">Estado</legend>
      <div class="form-check">
        <input
          id="chkExpertActive"
          v-model="expert.active"
          type="checkbox"
          class="form-check-input"
        />
        <label for="chkExpertActive" class="form-check-label">
          Especialista ativo (visível na aplicação)
        </label>
      </div>
    </fieldset>

    <footer class="mt-4">
      <slot></slot>
    </footer>
  </form>
</template>

<script>
import { familyCatalog, animalsOfFamily } from "@/api/catalog";

export default {
  name: "ExpertForm",
  props: ["expert"],
  data: () => ({ familyCatalog }),
  methods: { animalsOfFamily }
};
</script>
