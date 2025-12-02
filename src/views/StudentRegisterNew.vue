<template>
  <div class="register-page" :class="{ 'dark-mode': isDarkMode }">
    <NavBar />
    <NotificationModal 
      v-model:visible="notification.visible"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
    />
    
    <div class="register-container">
      <!-- Progress Stepper -->
      <div class="progress-stepper">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="step-item"
          :class="{
            'active': currentStep === index + 1,
            'completed': currentStep > index + 1
          }"
        >
          <div class="step-circle">
            <font-awesome-icon v-if="currentStep > index + 1" icon="check" />
            <span v-else>{{ index + 1 }}</span>
          </div>
          <div class="step-label">{{ step.label }}</div>
          <div v-if="index < steps.length - 1" class="step-line"></div>
        </div>
      </div>

      <!-- Form Card -->
      <div class="form-card">
        <div class="form-header">
          <h2 class="form-title">{{ steps[currentStep - 1].title }}</h2>
          <p class="form-subtitle">{{ steps[currentStep - 1].subtitle }}</p>
        </div>

        <form @submit.prevent="nextStep" class="register-form" novalidate>
          <!-- Resumo dos Dados Básicos -->
          <div class="info-banner">
            <div class="info-icon">
              <font-awesome-icon icon="user-check" />
            </div>
            <div class="info-content">
              <h4>Dados Cadastrados</h4>
              <p><strong>{{ form.name }}</strong> • {{ form.email }}</p>
            </div>
          </div>

          <!-- ETAPA 1: Endereço -->
          <div v-show="currentStep === 1" class="form-step">
            <div class="form-row">
              <div class="form-group">
                <label for="cep">
                  <font-awesome-icon icon="map-marker-alt" />
                  CEP *
                </label>
                <input
                  id="cep"
                  v-model="form.address.cep"
                  v-mask="'#####-###'"
                  type="text"
                  placeholder="00000-000"
                  @blur="fetchAddress"
                  :class="{ 'loading': loadingCep }"
                />
                <span v-if="loadingCep" class="info-message">Buscando endereço...</span>
              </div>

              <div class="form-group">
                <label for="city">
                  <font-awesome-icon icon="city" />
                  Cidade *
                </label>
                <input
                  id="city"
                  v-model="form.address.city"
                  type="text"
                  placeholder="Cidade"
                  readonly
                  :class="{ 'disabled': true }"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label for="street">
                  <font-awesome-icon icon="road" />
                  Rua *
                </label>
                <input
                  id="street"
                  v-model="form.address.street"
                  type="text"
                  placeholder="Nome da rua"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="number">
                  <font-awesome-icon icon="hashtag" />
                  Número *
                </label>
                <input
                  id="number"
                  v-model="form.address.number"
                  type="text"
                  placeholder="123"
                />
              </div>

              <div class="form-group">
                <label for="complement">
                  <font-awesome-icon icon="plus" />
                  Complemento
                </label>
                <input
                  id="complement"
                  v-model="form.address.complement"
                  type="text"
                  placeholder="Apto, bloco, etc."
                />
              </div>

              <div class="form-group">
                <label for="neighborhood">
                  <font-awesome-icon icon="map" />
                  Bairro *
                </label>
                <input
                  id="neighborhood"
                  v-model="form.address.neighborhood"
                  type="text"
                  placeholder="Bairro"
                  readonly
                  :class="{ 'disabled': true }"
                />
              </div>
            </div>
          </div>

          <!-- ETAPA 2: Dados Físicos -->
          <div v-show="currentStep === 2" class="form-step">
            <div class="form-row">
              <div class="form-group">
                <label for="weight">
                  <font-awesome-icon icon="weight" />
                  Peso Atual (kg) *
                </label>
                <input
                  id="weight"
                  v-model.number="form.currentWeight"
                  type="number"
                  step="0.1"
                  placeholder="70.5"
                  min="30"
                  max="300"
                />
              </div>

              <div class="form-group">
                <label for="height">
                  <font-awesome-icon icon="ruler-vertical" />
                  Altura (cm) *
                </label>
                <input
                  id="height"
                  v-model.number="form.currentHeight"
                  type="number"
                  placeholder="170"
                  min="100"
                  max="250"
                />
              </div>

              <div class="form-group">
                <label>
                  <font-awesome-icon icon="calculator" />
                  IMC Calculado
                </label>
                <div class="bmi-display">
                  <span class="bmi-value">{{ calculatedBMI }}</span>
                  <span class="bmi-label">{{ bmiCategory }}</span>
                </div>
              </div>
            </div>

            <!-- Medidas Corporais Iniciais -->
            <div class="measurements-section">
              <div class="section-header">
                <div class="header-content">
                  <h3 class="section-title">
                    <font-awesome-icon icon="ruler" />
                    Medidas Corporais Iniciais
                  </h3>
                  <span class="optional-badge">Opcional</span>
                </div>
                <p class="section-description">
                  <font-awesome-icon icon="info-circle" />
                  <strong>Pode pular esta etapa!</strong> Essas medidas servirão como parâmetro inicial para acompanhar sua evolução física. 
                  Seu instrutor irá registrar as próximas medidas durante seu acompanhamento.
                </p>
              </div>
              
              <div class="measurements-grid">
                <!-- Upper Body -->
                <div class="measurement-card">
                  <div class="card-icon upper-body">
                    <font-awesome-icon icon="arrows-up-down" />
                  </div>
                  <label for="shoulder" class="card-label">Ombro</label>
                  <div class="input-wrapper">
                    <input
                      id="shoulder"
                      v-model.number="form.initialMeasurements.shoulder"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 115"
                      class="measurement-input"
                    />
                    <span class="unit">cm</span>
                  </div>
                </div>

                <div class="measurement-card">
                  <div class="card-icon upper-body">
                    <font-awesome-icon icon="vest" />
                  </div>
                  <label for="chest" class="card-label">Peito</label>
                  <div class="input-wrapper">
                    <input
                      id="chest"
                      v-model.number="form.initialMeasurements.chest"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 105"
                      class="measurement-input"
                    />
                    <span class="unit">cm</span>
                  </div>
                </div>

                <div class="measurement-card">
                  <div class="card-icon upper-body">
                    <font-awesome-icon icon="hand-fist" />
                  </div>
                  <label for="arm" class="card-label">Braço</label>
                  <div class="input-wrapper">
                    <input
                      id="arm"
                      v-model.number="form.initialMeasurements.arm"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 38"
                      class="measurement-input"
                    />
                    <span class="unit">cm</span>
                  </div>
                </div>

                <div class="measurement-card">
                  <div class="card-icon upper-body">
                    <font-awesome-icon icon="hand" />
                  </div>
                  <label for="forearm" class="card-label">Antebraço</label>
                  <div class="input-wrapper">
                    <input
                      id="forearm"
                      v-model.number="form.initialMeasurements.forearm"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 30"
                      class="measurement-input"
                    />
                    <span class="unit">cm</span>
                  </div>
                </div>

                <!-- Core -->
                <div class="measurement-card">
                  <div class="card-icon core">
                    <font-awesome-icon icon="grip-lines" />
                  </div>
                  <label for="waist" class="card-label">Cintura</label>
                  <div class="input-wrapper">
                    <input
                      id="waist"
                      v-model.number="form.initialMeasurements.waist"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 85"
                      class="measurement-input"
                    />
                    <span class="unit">cm</span>
                  </div>
                </div>

                <div class="measurement-card">
                  <div class="card-icon core">
                    <font-awesome-icon icon="circle-dot" />
                  </div>
                  <label for="hip" class="card-label">Quadril</label>
                  <div class="input-wrapper">
                    <input
                      id="hip"
                      v-model.number="form.initialMeasurements.hip"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 95"
                      class="measurement-input"
                    />
                    <span class="unit">cm</span>
                  </div>
                </div>

                <!-- Lower Body -->
                <div class="measurement-card">
                  <div class="card-icon lower-body">
                    <font-awesome-icon icon="person-walking" />
                  </div>
                  <label for="thigh" class="card-label">Coxa</label>
                  <div class="input-wrapper">
                    <input
                      id="thigh"
                      v-model.number="form.initialMeasurements.thigh"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 58"
                      class="measurement-input"
                    />
                    <span class="unit">cm</span>
                  </div>
                </div>

                <div class="measurement-card">
                  <div class="card-icon lower-body">
                    <font-awesome-icon icon="shoe-prints" />
                  </div>
                  <label for="calf" class="card-label">Panturrilha</label>
                  <div class="input-wrapper">
                    <input
                      id="calf"
                      v-model.number="form.initialMeasurements.calf"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 38"
                      class="measurement-input"
                    />
                    <span class="unit">cm</span>
                  </div>
                </div>
              </div>

              <div class="skip-message">
                <font-awesome-icon icon="lightbulb" />
                <p>Você pode preencher essas informações depois ou deixar que seu instrutor as registre no primeiro encontro.</p>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label for="experience">
                  <font-awesome-icon icon="dumbbell" />
                  Experiência com Treinos *
                </label>
                <div class="radio-group">
                  <label class="radio-option">
                    <input type="radio" v-model="form.trainingExperience" value="iniciante" />
                    <div class="radio-content">
                      <font-awesome-icon icon="seedling" />
                      <span>Iniciante</span>
                      <small>Nunca treinei ou treino há menos de 6 meses</small>
                    </div>
                  </label>
                  <label class="radio-option">
                    <input type="radio" v-model="form.trainingExperience" value="intermediario" />
                    <div class="radio-content">
                      <font-awesome-icon icon="chart-line" />
                      <span>Intermediário</span>
                      <small>Treino entre 6 meses e 2 anos</small>
                    </div>
                  </label>
                  <label class="radio-option">
                    <input type="radio" v-model="form.trainingExperience" value="avancado" />
                    <div class="radio-content">
                      <font-awesome-icon icon="fire" />
                      <span>Avançado</span>
                      <small>Treino há mais de 2 anos</small>
                    </div>
                  </label>
                  <label class="radio-option">
                    <input type="radio" v-model="form.trainingExperience" value="atleta" />
                    <div class="radio-content">
                      <font-awesome-icon icon="trophy" />
                      <span>Atleta</span>
                      <small>Competidor ou atleta profissional</small>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- ETAPA 3: Saúde -->
          <div v-show="currentStep === 3" class="form-step">
            <!-- Informação Importante -->
            <div class="health-info-box">
              <font-awesome-icon icon="notes-medical" />
              <p>Essas informações são importantes para sua segurança e para que possamos criar um treino adequado às suas necessidades.</p>
            </div>

            <!-- Questões de Saúde -->
            <div class="health-questions">
              <h3 class="health-section-title">
                <font-awesome-icon icon="heart-pulse" />
                Condições de Saúde
              </h3>
              
              <div class="health-question-card">
                <label class="health-question-label">
                  <input type="checkbox" v-model="form.health.hasChronicConditions" @change="handleChronicConditionCheckbox" />
                  <div class="question-content">
                    <span class="question-text">Possui alguma condição crônica?</span>
                    <small class="question-hint">Ex: diabetes, hipertensão, asma, tireoide</small>
                  </div>
                </label>

                <div v-if="form.health.hasChronicConditions" class="question-details">
                  <div 
                    v-for="(condition, index) in form.health.chronicConditions" 
                    :key="'condition-' + index"
                    class="detail-item"
                  >
                    <div class="detail-item-content">
                      <input
                        v-model="condition.name"
                        type="text"
                        placeholder="Nome da condição (ex: Diabetes tipo 2)"
                        class="detail-input"
                      />
                      <button type="button" @click="removeItem(form.health.chronicConditions, index)" class="btn-remove-small">
                        <font-awesome-icon icon="times" />
                      </button>
                    </div>
                  </div>
                  <button type="button" @click="addChronicCondition" class="btn-add-small">
                    <font-awesome-icon icon="plus" /> Adicionar condição
                  </button>
                </div>
              </div>

              <div class="health-question-card">
                <label class="health-question-label">
                  <input type="checkbox" v-model="form.health.hasMedications" @change="handleMedicationCheckbox" />
                  <div class="question-content">
                    <span class="question-text">Usa medicamento regularmente?</span>
                    <small class="question-hint">Informe todos os medicamentos de uso contínuo</small>
                  </div>
                </label>

                <div v-if="form.health.hasMedications" class="question-details">
                  <div 
                    v-for="(med, index) in form.health.medications" 
                    :key="'med-' + index"
                    class="detail-item"
                  >
                    <div class="detail-item-content">
                      <input
                        v-model="med.name"
                        type="text"
                        placeholder="Nome do medicamento e dosagem"
                        class="detail-input"
                      />
                      <button type="button" @click="removeItem(form.health.medications, index)" class="btn-remove-small">
                        <font-awesome-icon icon="times" />
                      </button>
                    </div>
                  </div>
                  <button type="button" @click="addMedication" class="btn-add-small">
                    <font-awesome-icon icon="plus" /> Adicionar medicamento
                  </button>
                </div>
              </div>

              <div class="health-question-card">
                <label class="health-question-label">
                  <input type="checkbox" v-model="form.health.hasInjuries" @change="handleInjuryCheckbox" />
                  <div class="question-content">
                    <span class="question-text">Possui lesões ou limitações físicas?</span>
                    <small class="question-hint">Ex: dor no joelho, ombro, coluna, etc.</small>
                  </div>
                </label>

                <div v-if="form.health.hasInjuries" class="question-details">
                  <div 
                    v-for="(injury, index) in form.health.injuries" 
                    :key="'injury-' + index"
                    class="detail-item"
                  >
                    <div class="detail-item-content">
                      <input
                        v-model="injury.type"
                        type="text"
                        placeholder="Local e descrição (ex: Dor no joelho direito)"
                        class="detail-input"
                      />
                      <button type="button" @click="removeItem(form.health.injuries, index)" class="btn-remove-small">
                        <font-awesome-icon icon="times" />
                      </button>
                    </div>
                    <textarea
                      v-model="injury.limitations"
                      placeholder="Quais movimentos causam dor ou desconforto? Há exercícios que você não pode fazer?"
                      rows="2"
                      class="detail-textarea"
                    ></textarea>
                  </div>
                  <button type="button" @click="addInjury" class="btn-add-small">
                    <font-awesome-icon icon="plus" /> Adicionar lesão/limitação
                  </button>
                </div>
              </div>

              <div class="health-question-card">
                <label class="health-question-label">
                  <input type="checkbox" v-model="form.health.hasSurgeries" @change="handleSurgeryCheckbox" />
                  <div class="question-content">
                    <span class="question-text">Passou por alguma cirurgia?</span>
                    <small class="question-hint">Cirurgias recentes ou relevantes para atividade física</small>
                  </div>
                </label>

                <div v-if="form.health.hasSurgeries" class="question-details">
                  <div 
                    v-for="(surgery, index) in form.health.surgeries" 
                    :key="'surgery-' + index"
                    class="detail-item"
                  >
                    <div class="detail-item-content">
                      <input
                        v-model="surgery.type"
                        type="text"
                        placeholder="Tipo de cirurgia e quando foi realizada"
                        class="detail-input"
                      />
                      <button type="button" @click="removeItem(form.health.surgeries, index)" class="btn-remove-small">
                        <font-awesome-icon icon="times" />
                      </button>
                    </div>
                  </div>
                  <button type="button" @click="addSurgery" class="btn-add-small">
                    <font-awesome-icon icon="plus" /> Adicionar cirurgia
                  </button>
                </div>
              </div>
            </div>

            <!-- Estilo de Vida -->
            <div class="health-questions" style="margin-top: 2rem;">
              <h3 class="health-section-title">
                <font-awesome-icon icon="heart" />
                Estilo de Vida
              </h3>

              <div class="lifestyle-grid">
                <div class="form-group">
                  <label for="smoking">
                    <font-awesome-icon icon="smoking" />
                    Tabagismo
                  </label>
                  <select id="smoking" v-model="form.health.lifestyle.smoking">
                    <option value="nao_fuma">Não fumo</option>
                    <option value="ex_fumante">Ex-fumante</option>
                    <option value="fumante_ocasional">Fumante ocasional</option>
                    <option value="fumante_regular">Fumante regular</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="alcohol">
                    <font-awesome-icon icon="wine-glass" />
                    Álcool
                  </label>
                  <select id="alcohol" v-model="form.health.lifestyle.alcohol">
                    <option value="nao_consome">Não consumo</option>
                    <option value="ocasional">Ocasional (festas)</option>
                    <option value="moderado">Moderado (1-2x/semana)</option>
                    <option value="frequente">Frequente (3+x/semana)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="sleep">
                    <font-awesome-icon icon="bed" />
                    Qualidade do Sono
                  </label>
                  <select id="sleep" v-model="form.health.lifestyle.sleep">
                    <option value="excelente">Excelente (7-9h)</option>
                    <option value="boa">Boa (6-7h)</option>
                    <option value="regular">Regular (5-6h)</option>
                    <option value="ruim">Ruim (menos de 5h)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="stress">
                    <font-awesome-icon icon="brain" />
                    Nível de Estresse
                  </label>
                  <select id="stress" v-model="form.health.lifestyle.stress">
                    <option value="baixo">Baixo</option>
                    <option value="moderado">Moderado</option>
                    <option value="alto">Alto</option>
                    <option value="muito_alto">Muito Alto</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Alergias e Restrições -->
            <div class="health-questions" style="margin-top: 2rem;">
              <h3 class="health-section-title">
                <font-awesome-icon icon="triangle-exclamation" />
                Alergias e Restrições
              </h3>

              <div class="health-question-card">
                <label class="health-question-label">
                  <input type="checkbox" v-model="form.health.hasAllergies" @change="handleAllergyCheckbox" />
                  <div class="question-content">
                    <span class="question-text">Possui alguma alergia?</span>
                    <small class="question-hint">Alergias alimentares, medicamentos, látex, etc.</small>
                  </div>
                </label>

                <div v-if="form.health.hasAllergies" class="question-details">
                  <div 
                    v-for="(allergy, index) in form.health.allergies" 
                    :key="'allergy-' + index"
                    class="detail-item"
                  >
                    <div class="detail-item-content">
                      <input
                        v-model="allergy.name"
                        type="text"
                        placeholder="Tipo de alergia (ex: Amendoim, Lactose, Penicilina)"
                        class="detail-input"
                      />
                      <button type="button" @click="removeItem(form.health.allergies, index)" class="btn-remove-small">
                        <font-awesome-icon icon="times" />
                      </button>
                    </div>
                  </div>
                  <button type="button" @click="addAllergy" class="btn-add-small">
                    <font-awesome-icon icon="plus" /> Adicionar alergia
                  </button>
                </div>
              </div>

              <div class="health-question-card">
                <label class="health-question-label">
                  <input type="checkbox" v-model="form.health.hasDietaryRestrictions" @change="handleDietaryRestrictionCheckbox" />
                  <div class="question-content">
                    <span class="question-text">Possui restrições alimentares?</span>
                    <small class="question-hint">Vegetariano, vegano, intolerâncias, etc.</small>
                  </div>
                </label>

                <div v-if="form.health.hasDietaryRestrictions" class="question-details">
                  <div 
                    v-for="(restriction, index) in form.health.dietaryRestrictions" 
                    :key="'restriction-' + index"
                    class="detail-item"
                  >
                    <div class="detail-item-content">
                      <input
                        v-model="restriction.name"
                        type="text"
                        placeholder="Tipo de restrição (ex: Vegetariano, Intolerância a lactose)"
                        class="detail-input"
                      />
                      <button type="button" @click="removeItem(form.health.dietaryRestrictions, index)" class="btn-remove-small">
                        <font-awesome-icon icon="times" />
                      </button>
                    </div>
                  </div>
                  <button type="button" @click="addDietaryRestriction" class="btn-add-small">
                    <font-awesome-icon icon="plus" /> Adicionar restrição
                  </button>
                </div>
              </div>
            </div>

            <!-- Observações Adicionais -->
            <div class="form-group full-width" style="margin-top: 2rem;">
              <label for="healthNotes">
                <font-awesome-icon icon="notes-medical" />
                Observações Adicionais
              </label>
              <textarea
                id="healthNotes"
                v-model="form.health.generalNotes"
                placeholder="Alguma outra informação importante sobre sua saúde que devemos saber..."
                rows="3"
              ></textarea>
            </div>
          </div>

          <!-- ETAPA 4: Objetivos -->
          <div v-show="currentStep === 4" class="form-step">
            <div class="form-row">
              <div class="form-group full-width">
                <label for="goalType">
                  <font-awesome-icon icon="bullseye" />
                  Objetivo Principal *
                </label>
                <select id="goalType" v-model="form.goals.goalType">
                  <option value="">Selecione seu objetivo principal</option>
                  <option value="hipertrofia">Ganhar Massa Muscular (Hipertrofia)</option>
                  <option value="emagrecimento">Perder Peso / Emagrecer</option>
                  <option value="condicionamento">Melhorar Condicionamento Físico</option>
                  <option value="forca">Aumentar Força</option>
                  <option value="saude">Saúde e Bem-Estar</option>
                  <option value="performance">Performance Esportiva</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="targetWeight">
                  <font-awesome-icon icon="weight" />
                  Peso Meta (kg)
                </label>
                <input
                  id="targetWeight"
                  v-model.number="form.goals.targetWeight"
                  type="number"
                  step="0.1"
                  placeholder="65.0"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label for="primaryGoal">
                  <font-awesome-icon icon="flag" />
                  Descreva seu Objetivo Principal
                </label>
                <textarea
                  id="primaryGoal"
                  v-model="form.goals.primaryDescription"
                  placeholder="Ex: Quero perder 10kg e melhorar meu condicionamento para correr 5km"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div class="goals-list">
              <h4><font-awesome-icon icon="list-check" /> Metas Pessoais</h4>
              <div 
                v-for="(goal, index) in form.goals.personalGoals" 
                :key="'goal-' + index"
                class="goal-item"
              >
                <div class="form-row">
                  <div class="form-group flex-2">
                    <input
                      v-model="goal.description"
                      type="text"
                      placeholder="Descrição da meta"
                    />
                  </div>
                  <div class="form-group">
                    <select v-model="goal.category">
                      <option value="saude">Saúde</option>
                      <option value="estetica">Estética</option>
                      <option value="performance">Performance</option>
                      <option value="bem_estar">Bem-Estar</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                  <button type="button" @click="removeItem(form.goals.personalGoals, index)" class="btn-remove">
                    <font-awesome-icon icon="times" />
                  </button>
                </div>
              </div>
              <button type="button" @click="addPersonalGoal" class="btn-add">
                <font-awesome-icon icon="plus" /> Adicionar Meta
              </button>
            </div>
          </div>

          <!-- ETAPA 5: Preferências -->
          <div v-show="currentStep === 5" class="form-step">
            <div class="form-row">
              <div class="form-group full-width">
                <label>
                  <font-awesome-icon icon="calendar-days" />
                  Dias Disponíveis para Treinar *
                </label>
                <div class="days-selector">
                  <label 
                    v-for="day in daysOfWeek" 
                    :key="day.value"
                    class="day-option"
                    :class="{ 'selected': form.preferences.trainingDays.includes(day.value) }"
                  >
                    <input 
                      type="checkbox" 
                      :value="day.value" 
                      v-model="form.preferences.trainingDays"
                    />
                    <span>{{ day.label }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="timeStart">
                  <font-awesome-icon icon="clock" />
                  Horário Início Preferido *
                </label>
                <input
                  id="timeStart"
                  v-model="form.preferences.preferredTimeStart"
                  type="time"
                />
              </div>

              <div class="form-group">
                <label for="timeEnd">
                  <font-awesome-icon icon="clock" />
                  Horário Fim Preferido *
                </label>
                <input
                  id="timeEnd"
                  v-model="form.preferences.preferredTimeEnd"
                  type="time"
                />
              </div>

              <div class="form-group">
                <label for="daysPerWeek">
                  <font-awesome-icon icon="calendar-week" />
                  Frequência Semanal *
                </label>
                <select id="daysPerWeek" v-model.number="form.preferences.daysPerWeek">
                  <option value="">Selecione</option>
                  <option :value="2">2x por semana</option>
                  <option :value="3">3x por semana</option>
                  <option :value="4">4x por semana</option>
                  <option :value="5">5x por semana</option>
                  <option :value="6">6x por semana</option>
                  <option :value="7">Todos os dias</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label for="trainingType">
                  <font-awesome-icon icon="dumbbell" />
                  Tipo de Treino Preferido *
                </label>
                <select id="trainingType" v-model="form.preferences.preferredTrainingType">
                  <option value="">Selecione</option>
                  <option value="Musculação">Musculação</option>
                  <option value="Funcional">Treino Funcional</option>
                  <option value="Aeróbico">Aeróbico / Cardio</option>
                  <option value="Crossfit">Crossfit</option>
                  <option value="HIIT">HIIT</option>
                  <option value="Pilates">Pilates</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Misto">Misto</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="form.preferences.flexibleSchedule" />
                  <span>Tenho horários flexíveis</span>
                </label>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label for="additionalInfo">
                  <font-awesome-icon icon="comment" />
                  Informações Adicionais
                </label>
                <textarea
                  id="additionalInfo"
                  v-model="form.additionalInfo"
                  placeholder="Alguma preferência ou observação adicional..."
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="form-navigation">
            <button 
              type="button" 
              @click="prevStep" 
              class="btn btn-secondary"
              :disabled="currentStep === 1"
              v-if="currentStep > 1"
            >
              <font-awesome-icon icon="arrow-left" />
              Voltar
            </button>
            
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="isSubmitting"
            >
              <span v-if="!isSubmitting">
                {{ currentStep < totalSteps ? 'Próximo' : 'Finalizar Cadastro' }}
                <font-awesome-icon :icon="currentStep < totalSteps ? 'arrow-right' : 'check'" />
              </span>
              <span v-else>
                <font-awesome-icon icon="spinner" spin />
                Processando...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { API_URL } from '@/config'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/store/theme'
import NavBar from '@/components/NavBar.vue'
import NotificationModal from '@/components/NotificationModal.vue'
import axios from 'axios'

const router = useRouter()
const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)


const route = router.currentRoute.value
const userId = route.query.userId


const notification = ref({
  visible: false,
  type: 'info',
  title: '',
  message: ''
})

const showNotification = (type, title, message) => {
  notification.value = {
    visible: true,
    type,
    title,
    message
  }
}


const steps = [
  { label: 'Endereço', title: 'Onde Você Mora', subtitle: 'Informe seu endereço completo' },
  { label: 'Dados Físicos', title: 'Perfil Físico', subtitle: 'Suas medidas e experiência com treinos' },
  { label: 'Saúde', title: 'Anamnese de Saúde', subtitle: 'Informações importantes sobre sua saúde' },
  { label: 'Objetivos', title: 'Seus Objetivos', subtitle: 'O que você quer alcançar?' },
  { label: 'Preferências', title: 'Preferências de Treino', subtitle: 'Quando e como você prefere treinar' }
]

const currentStep = ref(1)
const totalSteps = 5
const isSubmitting = ref(false)
const loadingCep = ref(false)


const form = ref({
 
  userId: userId || '',
  name: route.query.name || '',
  cpf: route.query.cpf || '',
  birthDate: route.query.birthDate || '',
  email: route.query.email || '',
  phone: route.query.phone || '',
  
 
  address: {
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  },
  
 
  currentWeight: null,
  currentHeight: null,
  trainingExperience: '',
  
 
  initialMeasurements: {
    shoulder: null,
    chest: null,
    arm: null,
    forearm: null,
    waist: null,
    hip: null,
    thigh: null,
    calf: null,
    bodyFatPercentage: null
  },
  
 
  health: {
    hasChronicConditions: false,
    chronicConditions: [],
    hasMedications: false,
    medications: [],
    hasInjuries: false,
    injuries: [],
    hasSurgeries: false,
    surgeries: [],
    hasAllergies: false,
    allergies: [],
    hasDietaryRestrictions: false,
    dietaryRestrictions: [],
    lifestyle: {
      smoking: 'nao_fuma',
      alcohol: 'nao_consome',
      sleep: 'boa',
      stress: 'baixo'
    },
    generalNotes: ''
  },
  
 
  goals: {
    goalType: '',
    targetWeight: null,
    primaryDescription: '',
    personalGoals: []
  },
  
 
  preferences: {
    trainingDays: [],
    preferredTimeStart: '',
    preferredTimeEnd: '',
    daysPerWeek: null,
    preferredTrainingType: '',
    flexibleSchedule: false
  },
  
  additionalInfo: ''
})


const daysOfWeek = [
  { label: 'Dom', value: 'Domingo' },
  { label: 'Seg', value: 'Segunda' },
  { label: 'Ter', value: 'Terça' },
  { label: 'Qua', value: 'Quarta' },
  { label: 'Qui', value: 'Quinta' },
  { label: 'Sex', value: 'Sexta' },
  { label: 'Sáb', value: 'Sábado' }
]


const calculatedBMI = computed(() => {
  if (!form.value.currentWeight || !form.value.currentHeight) return '-'
  const heightInMeters = form.value.currentHeight / 100
  const bmi = form.value.currentWeight / (heightInMeters * heightInMeters)
  return bmi.toFixed(1)
})

const bmiCategory = computed(() => {
  const bmi = parseFloat(calculatedBMI.value)
  if (isNaN(bmi)) return ''
  if (bmi < 18.5) return 'Abaixo do peso'
  if (bmi < 25) return 'Peso normal'
  if (bmi < 30) return 'Sobrepeso'
  return 'Obesidade'
})


const fetchAddress = async () => {
  const cep = form.value.address.cep.replace(/\D/g, '')
  if (cep.length !== 8) {
    showNotification('warning', 'CEP Inválido', 'O CEP deve conter 8 dígitos')
    return
  }
  
  loadingCep.value = true
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    const data = await response.json()
    
    if (data.erro) {
      showNotification('error', 'CEP Não Encontrado', 'O CEP informado não foi encontrado na base de dados')
    } else {
      form.value.address.street = data.logradouro || ''
      form.value.address.neighborhood = data.bairro || ''
      form.value.address.city = data.localidade || ''
      form.value.address.state = data.uf || ''
    }
  } catch (error) {
    showNotification('error', 'Erro ao Buscar CEP', 'Não foi possível consultar o CEP. Verifique sua conexão')
  } finally {
    loadingCep.value = false
  }
}


const addChronicCondition = () => {
  form.value.health.chronicConditions.push({
    name: ''
  })
}

const addMedication = () => {
  form.value.health.medications.push({
    name: ''
  })
}

const addInjury = () => {
  form.value.health.injuries.push({
    type: '',
    limitations: ''
  })
}

const addSurgery = () => {
  form.value.health.surgeries.push({
    type: ''
  })
}

const addAllergy = () => {
  if (!form.value.health.allergies) {
    form.value.health.allergies = []
  }
  form.value.health.allergies.push({
    name: ''
  })
}

const addDietaryRestriction = () => {
  if (!form.value.health.dietaryRestrictions) {
    form.value.health.dietaryRestrictions = []
  }
  form.value.health.dietaryRestrictions.push({
    name: ''
  })
}

const addPersonalGoal = () => {
  form.value.goals.personalGoals.push({
    description: '',
    category: 'saude',
    priority: 'media'
  })
}

const removeItem = (array, index) => {
  array.splice(index, 1)
}

const handleChronicConditionCheckbox = () => {
  if (form.value.health.hasChronicConditions && form.value.health.chronicConditions.length === 0) {
    addChronicCondition()
  } else if (!form.value.health.hasChronicConditions) {
    form.value.health.chronicConditions = []
  }
}

const handleMedicationCheckbox = () => {
  if (form.value.health.hasMedications && form.value.health.medications.length === 0) {
    addMedication()
  } else if (!form.value.health.hasMedications) {
    form.value.health.medications = []
  }
}

const handleInjuryCheckbox = () => {
  if (form.value.health.hasInjuries && form.value.health.injuries.length === 0) {
    addInjury()
  } else if (!form.value.health.hasInjuries) {
    form.value.health.injuries = []
  }
}

const handleSurgeryCheckbox = () => {
  if (form.value.health.hasSurgeries && form.value.health.surgeries.length === 0) {
    addSurgery()
  } else if (!form.value.health.hasSurgeries) {
   
    form.value.health.surgeries = []
  }
}

const handleAllergyCheckbox = () => {
  if (form.value.health.hasAllergies && form.value.health.allergies.length === 0) {
    addAllergy()
  } else if (!form.value.health.hasAllergies) {
    form.value.health.allergies = []
  }
}

const handleDietaryRestrictionCheckbox = () => {
  if (form.value.health.hasDietaryRestrictions && form.value.health.dietaryRestrictions.length === 0) {
    addDietaryRestriction()
  } else if (!form.value.health.hasDietaryRestrictions) {
    form.value.health.dietaryRestrictions = []
  }
}


const nextStep = async (event) => {
 
  event.preventDefault()
  
 
  if (!validateStep()) {
    showNotification('warning', 'Campos Obrigatórios', 'Por favor, preencha todos os campos obrigatórios')
    return
  }
  
  if (currentStep.value < totalSteps) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    await submitForm()
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const validateStep = () => {
 
  switch (currentStep.value) {
    case 1:
      if (!form.value.address.cep || !form.value.address.street || 
          !form.value.address.number || !form.value.address.neighborhood || 
          !form.value.address.city) {
        return false
      }
      break
    case 2:
      if (!form.value.currentWeight || !form.value.currentHeight || 
          !form.value.trainingExperience) {
        return false
      }
      break
    case 3:
      break
    case 4:
      if (!form.value.goals.goalType) {
        return false
      }
      break
    case 5:
      if (form.value.preferences.trainingDays.length === 0 || 
          !form.value.preferences.preferredTimeStart || 
          !form.value.preferences.preferredTimeEnd || 
          !form.value.preferences.daysPerWeek || 
          !form.value.preferences.preferredTrainingType) {
        return false
      }
      break
  }
  return true
}

const submitForm = async () => {
  if (!form.value.userId) {
    showNotification('error', 'Erro no Cadastro', 'Dados do usuário não encontrados. Por favor, refaça o cadastro')
    setTimeout(() => {
      router.push('/register')
    }, 2000)
    return
  }
  
  isSubmitting.value = true
  
  try {
   
    const studentPayload = {
      userId: form.value.userId,
      name: form.value.name,
      email: form.value.email,
      cpf: form.value.cpf.replace(/\D/g, ''),
      phone: form.value.phone.replace(/\D/g, ''),
      birthDate: form.value.birthDate,
      
      personalInfo: {
        currentWeight: form.value.currentWeight,
        currentHeight: form.value.currentHeight,
        trainingExperience: form.value.trainingExperience,
        
       
        initialMeasurements: form.value.initialMeasurements,
        
        address: {
          cep: form.value.address.cep.replace(/\D/g, ''),
          street: form.value.address.street,
          number: form.value.address.number,
          complement: form.value.address.complement,
          neighborhood: form.value.address.neighborhood,
          city: form.value.address.city,
          state: form.value.address.state
        },
        
        preferences: {
          trainingDays: form.value.preferences.trainingDays,
          preferredTimeStart: form.value.preferences.preferredTimeStart,
          preferredTimeEnd: form.value.preferences.preferredTimeEnd,
          preferredTrainingType: form.value.preferences.preferredTrainingType,
          trainingGoalType: form.value.goals.goalType
        },
        
        availability: {
          daysPerWeek: form.value.preferences.daysPerWeek,
          minutesPerSession: 60,
          flexibleSchedule: form.value.preferences.flexibleSchedule
        }
      },
      
      healthRestrictions: {
        hasChronicConditions: form.value.health.hasChronicConditions,
        chronicConditions: form.value.health.chronicConditions,
        hasMedications: form.value.health.hasMedications,
        medications: form.value.health.medications,
        hasInjuries: form.value.health.hasInjuries,
        injuries: form.value.health.injuries,
        hasSurgeries: form.value.health.hasSurgeries,
        surgeries: form.value.health.surgeries,
        allergies: form.value.health.allergies.map(a => a.name).filter(a => a),
        dietaryRestrictions: form.value.health.dietaryRestrictions.map(d => d.name).filter(d => d),
        smokingStatus: form.value.health.lifestyle.smoking,
        alcoholConsumption: form.value.health.lifestyle.alcohol,
        sleepQuality: form.value.health.lifestyle.sleep,
        stressLevel: form.value.health.lifestyle.stress,
        generalNotes: form.value.health.generalNotes
      },
      
      goals: {
        primary: {
          type: form.value.goals.goalType,
          description: form.value.goals.primaryDescription
        },
        weight: {
          initial: form.value.currentWeight,
          target: form.value.goals.targetWeight
        },
        personal: form.value.goals.personalGoals
      }
    }
    
    const response = await axios.post(`${API_URL}/api/students`, studentPayload)
    console.log('response: ', response);
    
   
    showNotification('success', 'Cadastro Realizado!', 'Você será redirecionado para o login')
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    
  } catch (error) {
    showNotification('error', 'Erro no Cadastro', error.response?.data?.message || 'Erro ao realizar cadastro. Tente novamente')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

* {
  font-family: "Inter", sans-serif;
  box-sizing: border-box;
}

.register-page {
  min-height: 100vh;
  background: var(--bg-secondary);
  padding: 6rem 1rem 2rem 1rem; /* Top padding para o navbar */
}

.register-container {
  max-width: 900px;
  margin: 0 auto;
  padding-top: 1rem;
}

/* Progress Stepper */
.progress-stepper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding: 0 1rem;
  position: relative;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.step-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--card-bg);
  border: 3px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-muted);
  transition: all 0.3s ease;
  z-index: 2;
  position: relative;
}

.step-item.active .step-circle {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.dark-mode .step-item.active .step-circle {
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
}

.step-item.completed .step-circle {
  background: var(--success-color);
  border-color: var(--success-color);
  color: white;
}

.step-label {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-muted);
  text-align: center;
  transition: all 0.3s ease;
}

.step-item.active .step-label {
  color: var(--primary-color);
  font-weight: 600;
}

.step-item.completed .step-label {
  color: var(--success-color);
}

.step-line {
  position: absolute;
  top: 25px;
  left: 50%;
  width: 100%;
  height: 3px;
  background: var(--border-color);
  z-index: 1;
  transition: all 0.3s ease;
}

.step-item.completed .step-line {
  background: var(--success-color);
}

/* Form Card */
.form-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.dark-mode .form-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.form-subtitle {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin: 0;
}

/* Info Banner */
.info-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  border-radius: 12px;
  margin-bottom: 2rem;
  color: white;
}

.info-icon {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.info-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0.9;
}

.info-content p {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
}

/* Form Elements */
.register-form {
  width: 100%;
}

.form-step {
  animation: fadeInUp 0.4s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group.flex-2 {
  flex: 2;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group label i {
  color: var(--primary-color);
  font-size: 0.95rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
  color: var(--text-color);
  font-size: 0.95rem;
  transition: all 0.3s ease;
  outline: none;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark-mode .form-group input:focus,
.dark-mode .form-group select:focus,
.dark-mode .form-group textarea:focus {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
  border-color: var(--danger-color);
}

.form-group input.disabled {
  background: var(--bg-secondary);
  opacity: 0.6;
  cursor: not-allowed;
}

.form-group input.loading {
  background-image: linear-gradient(90deg, var(--bg-secondary) 0%, var(--border-color) 50%, var(--bg-secondary) 100%);
  background-size: 200% 100%;
  animation: loading 1.5s ease infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.error-message {
  font-size: 0.8rem;
  color: var(--danger-color);
  margin-top: -0.25rem;
}

.info-message {
  font-size: 0.8rem;
  color: var(--primary-color);
  margin-top: -0.25rem;
}

/* Measurements Section */
.measurements-section {
  margin: 2rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(99, 102, 241, 0.05));
  border: 2px solid rgba(59, 130, 246, 0.2);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.measurements-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6);
  background-size: 200% 100%;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.section-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.section-title i {
  color: var(--primary-color);
  font-size: 1.5rem;
}

.optional-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.875rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.section-description {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: var(--card-bg);
  border-left: 4px solid var(--primary-color);
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--text-color);
  line-height: 1.6;
  margin: 0;
}

.section-description i {
  color: var(--primary-color);
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.section-description strong {
  color: var(--primary-color);
  font-weight: 600;
}

.measurements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.measurement-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem 1rem;
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
}

.measurement-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.card-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  margin-bottom: 0.75rem;
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.card-icon.upper-body {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15));
  color: #3b82f6;
}

.card-icon.core {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.15));
  color: #8b5cf6;
}

.card-icon.lower-body {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15));
  color: #10b981;
}

.measurement-card:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
}

.card-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  text-align: center;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.measurement-input {
  width: 100%;
  padding: 0.625rem 2.5rem 0.625rem 0.875rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-color);
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
  outline: none;
}

.measurement-input:focus {
  border-color: var(--primary-color);
  background: var(--card-bg);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.measurement-input:not(:placeholder-shown) {
  border-color: #10b981;
}

.unit {
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  pointer-events: none;
}

.skip-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 8px;
  margin-top: 1.5rem;
}

.skip-message i {
  color: #f59e0b;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.skip-message p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-color);
  line-height: 1.5;
}

/* BMI Display */
.bmi-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  border-radius: 12px;
  height: 100%;
}

.bmi-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.bmi-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 0.25rem;
}

/* Radio Group - Modern & Elegant Design */
.radio-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1.25rem;
  margin-top: 0.75rem;
}

.radio-option {
  position: relative;
  cursor: pointer;
  perspective: 1000px;
}

.radio-option input[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.radio-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.75rem 1.25rem;
  border: 2px solid var(--border-color);
  border-radius: 16px;
  background: var(--bg-secondary);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.radio-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--primary-hover));
  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.radio-content::after {
  content: '✓';
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  opacity: 0;
  transform: scale(0) rotate(-180deg);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.radio-option:hover .radio-content {
  transform: translateY(-4px);
  border-color: var(--primary-color);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
}

.dark-mode .radio-option:hover .radio-content {
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
}

.radio-option input[type="radio"]:checked + .radio-content {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(99, 102, 241, 0.08));
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.2);
}

.dark-mode .radio-option input[type="radio"]:checked + .radio-content {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(124, 58, 237, 0.1));
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.25);
}

.radio-option input[type="radio"]:checked + .radio-content::before {
  transform: translateX(0);
}

.radio-option input[type="radio"]:checked + .radio-content::after {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

.radio-content i {
  font-size: 2rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.radio-option:hover .radio-content i {
  color: var(--primary-color);
  transform: scale(1.1);
}

.radio-option input[type="radio"]:checked + .radio-content i {
  color: var(--primary-color);
  transform: scale(1.15);
  filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3));
}

.radio-content span {
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.radio-option input[type="radio"]:checked + .radio-content span {
  color: var(--primary-color);
}

.radio-content small {
  font-size: 0.75rem;
  color: var(--text-muted);
  line-height: 1.4;
  transition: all 0.3s ease;
  opacity: 0.85;
}

.radio-option:hover .radio-content small {
  opacity: 1;
}

.radio-option input[type="radio"]:checked + .radio-content small {
  color: var(--text-color);
  opacity: 1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .radio-group {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
  }
  
  .radio-content {
    padding: 1.5rem 1rem;
  }
  
  .radio-content i {
    font-size: 1.75rem;
  }
  
  .radio-content span {
    font-size: 0.9rem;
  }
  
  .radio-content small {
    font-size: 0.7rem;
  }
}

/* Checkbox */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 1rem;
  border-radius: 12px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  transition: all 0.3s ease;
}

.checkbox-label:hover {
  border-color: var(--primary-color);
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--primary-color);
}

.checkbox-label span {
  font-weight: 500;
  color: var(--text-color);
}

/* Health Section - New Design */
.health-info-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(102, 126, 234, 0.1));
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: var(--text-color);
}

.health-info-box svg {
  font-size: 1.5rem;
  color: var(--primary-color);
  flex-shrink: 0;
}

.health-info-box p {
  margin: 0;
  line-height: 1.5;
}

.health-questions {
  margin-bottom: 1.5rem;
}

.health-section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 1.25rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--border-color);
}

.health-section-title svg {
  color: var(--primary-color);
  font-size: 1.25rem;
}

.health-question-card {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.health-question-card:hover {
  border-color: rgba(59, 130, 246, 0.3);
}

.health-question-label {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  cursor: pointer;
  margin-bottom: 0;
}

.health-question-label input[type="checkbox"] {
  width: 22px;
  height: 22px;
  margin-top: 2px;
  cursor: pointer;
  accent-color: var(--primary-color);
  flex-shrink: 0;
}

.question-content {
  flex: 1;
}

.question-text {
  display: block;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.question-hint {
  display: block;
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 400;
}

.question-details {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  display: block;
  width: 100%;
}

.detail-item {
  margin-bottom: 0.75rem;
  display: block;
  width: 100%;
}

.detail-item-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  margin-bottom: 0.5rem;
}

.detail-input {
  flex: 1;
  padding: 0.65rem 0.875rem;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.9rem;
  transition: all 0.3s ease;
  outline: none;
  min-height: 42px;
  max-width: calc(100% - 42px);
}

.detail-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.detail-textarea {
  width: 100%;
  padding: 0.65rem 0.875rem;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.9rem;
  transition: all 0.3s ease;
  outline: none;
  resize: vertical;
  font-family: "Inter", sans-serif;
  min-height: 60px;
  margin-top: 0.5rem;
}

.detail-textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn-add-small {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px dashed var(--border-color);
  background: transparent;
  color: var(--primary-color);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.btn-add-small:hover {
  border-color: var(--primary-color);
  background: rgba(59, 130, 246, 0.08);
}

.btn-remove-small {
  padding: 0.5rem;
  border: none;
  background: var(--danger-color);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  min-width: 32px;
  max-width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.btn-remove-small:hover {
  background: #dc2626;
  transform: scale(1.05);
}

.lifestyle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.emergency-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

/* Removed old health section styles to avoid conflicts */

/* Buttons */
.btn-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 2px dashed var(--border-color);
  background: transparent;
  color: var(--primary-color);
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  width: auto;
  margin-top: 0.75rem;
}

.btn-add:hover {
  border-color: var(--primary-color);
  background: rgba(59, 130, 246, 0.08);
  transform: translateY(-1px);
}

.dark-mode .btn-add:hover {
  background: rgba(102, 126, 234, 0.08);
}

.btn-remove {
  padding: 0.5rem;
  border: none;
  background: var(--danger-color);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  height: fit-content;
  align-self: center;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

/* Goals List */
.goals-list {
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.goals-list h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 1rem 0;
}

.goals-list h4 i {
  color: var(--primary-color);
}

.goal-item {
  margin-bottom: 1rem;
}

.goal-item .form-row {
  align-items: center;
  gap: 1rem;
}

.goal-item .form-group {
  margin-bottom: 0;
}

.goal-item .form-group input,
.goal-item .form-group select {
  width: 100%;
}

/* Days Selector */
.days-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.day-option {
  position: relative;
  cursor: pointer;
}

.day-option input[type="checkbox"] {
  position: absolute;
  opacity: 0;
}

.day-option span {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0.5rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-color);
  transition: all 0.3s ease;
}

.day-option.selected span,
.day-option input[type="checkbox"]:checked + span {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: white;
}

/* Navigation */
.form-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border: 2px solid transparent;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-color);
  border-color: var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--border-color);
  transform: translateY(-1px);
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  justify-content: center;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.dark-mode .btn-primary:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* Responsive */
@media (max-width: 768px) {
  .register-page {
    padding: 1rem 0.5rem;
  }
  
  .progress-stepper {
    padding: 0;
  }
  
  .step-label {
    font-size: 0.7rem;
  }
  
  .step-circle {
    width: 40px;
    height: 40px;
    font-size: 0.9rem;
  }
  
  .form-card {
    padding: 2rem 1.5rem;
  }
  
  .form-title {
    font-size: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .radio-group {
    grid-template-columns: 1fr;
  }
  
  .days-selector {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .form-navigation {
    flex-direction: column;
  }

  .measurements-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .measurements-section {
    padding: 1.5rem 1rem;
  }

  .section-title {
    font-size: 1.1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .step-label {
    display: none;
  }
  
  .form-card {
    padding: 1.5rem 1rem;
  }
  
  .days-selector {
    grid-template-columns: repeat(3, 1fr);
  }

  .measurements-grid {
    grid-template-columns: 1fr;
  }

  .measurement-card {
    padding: 1rem;
  }

  .card-icon {
    width: 42px;
    height: 42px;
    font-size: 1.25rem;
  }
}
</style>
