<template>
  <div :class="['student-profile-view', { 'dark-mode': isDarkMode }]">
    <DashboardNavBar />
    
    <div class="main-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>Carregando perfil do aluno...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <i class="fas fa-exclamation-circle"></i>
        <h3>Erro ao carregar perfil</h3>
        <p>{{ error }}</p>
        <button @click="loadStudentData" class="btn-retry">Tentar novamente</button>
      </div>

      <!-- Content -->
      <div v-else class="profile-container">
        <!-- Header Section -->
        <div class="profile-header">
          <div class="header-left">
            <div class="avatar-container">
              <img 
                :src="studentAvatar || 'https://ui-avatars.com/api/?name=' + (student.name || 'User')" 
                :alt="student.name || 'Aluno'"
                class="avatar"
              />
              <span :class="['status-badge', student.status || 'inactive']">
                {{ student.status === 'active' ? 'Ativo' : 'Inativo' }}
              </span>
            </div>
            <div class="header-info">
              <h1 class="student-name">{{ student.name || 'Nome não disponível' }}</h1>
              <div class="student-meta">
                <span class="meta-item">
                  <i class="fas fa-birthday-cake"></i>
                  {{ calculateAge(student.birthDate) }} anos
                </span>
                <span class="meta-item">
                  <i class="fas fa-envelope"></i>
                  {{ student.email }}
                </span>
                <span class="meta-item">
                  <i class="fas fa-phone"></i>
                  {{ formatPhone(student.phone) }}
                </span>
              </div>
            </div>
          </div>
          <div class="header-actions">
            <button @click="showProgressModal = true" class="action-btn">
              <i class="fas fa-plus"></i>
              <span>Adicionar Progresso</span>
            </button>
          </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="tabs-container">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
          >
            <i :class="tab.icon"></i>
            <span>{{ tab.label }}</span>
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Dados Tab -->
          <div v-show="activeTab === 'dados'" class="dados-tab">
            <div class="cards-grid">
              <!-- Card Dados Pessoais -->
              <div class="info-card-new">
                <div class="card-header-new">
                  <div class="header-icon">
                    <i class="fas fa-user"></i>
                  </div>
                  <div class="header-content">
                    <h3>Dados Pessoais</h3>
                    <span class="header-badge">{{ student.personalInfo?.trainingExperience || 'Iniciante' }}</span>
                  </div>
                </div>
                <div class="card-body-new">
                  <div class="info-item-new">
                    <div class="item-icon">
                      <i class="fas fa-user"></i>
                    </div>
                    <div class="item-content">
                      <span class="item-label">NOME</span>
                      <span class="item-value">{{ student.name || 'rodrigo carlos' }}</span>
                    </div>
                  </div>
                  <div class="info-item-new">
                    <div class="item-icon">
                      <i class="fas fa-envelope"></i>
                    </div>
                    <div class="item-content">
                      <span class="item-label">EMAIL</span>
                      <span class="item-value">{{ student.email || 'rdgatuno@gmail.com' }}</span>
                    </div>
                  </div>
                  <div class="info-item-new">
                    <div class="item-icon">
                      <i class="fas fa-phone"></i>
                    </div>
                    <div class="item-content">
                      <span class="item-label">TELEFONE</span>
                      <span class="item-value">{{ student.phone || '19999999999' }}</span>
                    </div>
                  </div>
                  <div class="info-item-new">
                    <div class="item-icon">
                      <i class="fas fa-id-card"></i>
                    </div>
                    <div class="item-content">
                      <span class="item-label">CPF</span>
                      <span class="item-value">{{ student.cpf || '89457424093' }}</span>
                    </div>
                  </div>
                  <div class="info-item-new weight-height-container">
                    <div class="weight-height-item">
                      <div class="item-icon">
                        <i class="fas fa-weight"></i>
                      </div>
                      <div class="item-content">
                        <span class="item-label">PESO ATUAL</span>
                        <span class="item-value">{{ student.personalInfo?.currentWeight || 84 }} kg</span>
                      </div>
                    </div>
                    <div class="weight-height-item">
                      <div class="item-icon">
                        <i class="fas fa-ruler-vertical"></i>
                      </div>
                      <div class="item-content">
                        <span class="item-label">ALTURA</span>
                        <span class="item-value">{{ student.personalInfo?.currentHeight || 187 }} cm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card Objetivos e Metas -->
              <div class="info-card-new">
                <div class="card-header-new">
                  <div class="header-icon goals">
                    <i class="fas fa-bullseye"></i>
                  </div>
                  <div class="header-content">
                    <h3>Objetivos e Metas</h3>
                    <span class="header-badge goals">{{ student.goals?.primary?.type || 'Hipertrofia' }}</span>
                  </div>
                </div>
                <div class="card-body-new">
                  <div class="goal-main">
                    <div class="goal-icon">
                      <i class="fas fa-arrow-trend-down"></i>
                    </div>
                    <div class="goal-content">
                      <span class="goal-title">Objetivo Principal</span>
                      <span class="goal-subtitle">{{ student.goals?.primary?.type || 'Ganho de massa muscular e força' }}</span>
                    </div>
                    <span class="goal-badge">{{ student.goals?.primary?.type || 'Hipertrofia' }}</span>
                  </div>
                  
                  <div class="progress-section">
                    <div class="weight-target-section">
                      <div class="weight-target-header">
                        <div class="weight-target-icon">
                          <i class="fas fa-weight-hanging"></i>
                        </div>
                        <span class="weight-target-label">PESO ALVO</span>
                      </div>
                      <div class="weight-target-value">{{ student.goals?.weight?.target || '86.4' }} kg</div>
                      <div class="weight-progress-info">
                        <span class="progress-label-small">Progresso</span>
                        <span class="progress-percentage">{{ weightProgress.percentage || 0 }}%</span>
                      </div>
                      <div class="progress-bar-small">
                        <div class="progress-fill-small" :style="{ width: (weightProgress.percentage || 0) + '%' }"></div>
                      </div>
                    </div>
                    
                    <div class="progress-stats">
                      <div class="stat-item-simple">
                        <div class="stat-icon-simple">
                          <i class="fas fa-calendar-check"></i>
                        </div>
                        <div class="stat-content-simple">
                          <span class="stat-label-simple">INÍCIO</span>
                          <span class="stat-value-simple">Jan 2025</span>
                        </div>
                      </div>
                      <div class="stat-item-simple">
                        <div class="stat-icon-simple">
                          <i class="fas fa-trophy"></i>
                        </div>
                        <div class="stat-content-simple">
                          <span class="stat-label-simple">NÍVEL</span>
                          <span class="stat-value-simple">Iniciante</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="progress-note">
                      <span class="note-text">{{ weightGoalNote }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card Metas Pessoais -->
              <div v-if="student.goals?.personal && student.goals.personal.length > 0" class="info-card-new full-width">
                <div class="card-header-new">
                  <div class="header-icon">
                    <i class="fas fa-star"></i>
                  </div>
                  <div class="header-content">
                    <h3>Metas Pessoais</h3>
                    <span class="header-badge">{{ student.goals.personal.length }} metas</span>
                  </div>
                </div>
                <div class="card-body-new">
                  <div class="goals-list-new">
                    <div 
                      v-for="(goal, index) in student.goals.personal" 
                      :key="index"
                      class="goal-item-new"
                    >
                      <div class="goal-checkbox-new">
                        <i :class="goal.achieved ? 'fas fa-check-circle achieved' : 'far fa-circle'"></i>
                      </div>
                      <div class="goal-content-new">
                        <span class="goal-description-new">{{ goal.description }}</span>
                        <div class="goal-meta-new">
                          <span class="goal-category-new">{{ goal.category }}</span>
                          <span :class="['goal-priority-new', 'priority-' + goal.priority]">{{ goal.priority }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card Restrições -->
              <div class="info-card-new full-width">
                <div class="card-header-new">
                  <div class="header-icon health">
                    <i class="fas fa-heartbeat"></i>
                  </div>
                  <div class="header-content">
                    <h3>Restrições de Saúde</h3>
                    <span class="header-badge health">Avaliação</span>
                  </div>
                </div>
                <div class="card-body-new">
                  <!-- Cada health-item em sua própria caixa -->
                  <div class="health-items-container">
                    <div class="health-item-card">
                      <div class="health-item">
                        <div class="health-icon">
                          <i class="fas fa-procedures"></i>
                        </div>
                        <div class="health-content">
                          <span class="health-label">CONDIÇÕES CRÔNICAS</span>
                          <span class="health-value">{{ student.healthRestrictions?.hasChronicConditions ? 'Sim' : 'Não' }}</span>
                        </div>
                        <div :class="['health-status', student.healthRestrictions?.hasChronicConditions ? 'warning' : 'safe']">
                          <i :class="student.healthRestrictions?.hasChronicConditions ? 'fas fa-exclamation-triangle' : 'fas fa-check'"></i>
                        </div>
                      </div>
                    </div>
                    
                    <div class="health-item-card">
                      <div class="health-item">
                        <div class="health-icon">
                          <i class="fas fa-pills"></i>
                        </div>
                        <div class="health-content">
                          <span class="health-label">MEDICAMENTOS</span>
                          <span class="health-value">{{ student.healthRestrictions?.hasMedications ? 'Sim' : 'Não' }}</span>
                        </div>
                        <div :class="['health-status', student.healthRestrictions?.hasMedications ? 'warning' : 'safe']">
                          <i :class="student.healthRestrictions?.hasMedications ? 'fas fa-exclamation-triangle' : 'fas fa-check'"></i>
                        </div>
                      </div>
                    </div>
                    
                    <div class="health-item-card">
                      <div class="health-item">
                        <div class="health-icon">
                          <i class="fas fa-band-aid"></i>
                        </div>
                        <div class="health-content">
                          <span class="health-label">LESÕES</span>
                          <span class="health-value">{{ student.healthRestrictions?.hasInjuries ? 'Sim' : 'Não' }}</span>
                        </div>
                        <div :class="['health-status', student.healthRestrictions?.hasInjuries ? 'warning' : 'safe']">
                          <i :class="student.healthRestrictions?.hasInjuries ? 'fas fa-exclamation-triangle' : 'fas fa-check'"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Card "Sem Restrições" quando não há nenhuma restrição -->
                  <div v-if="!student.healthRestrictions?.hasChronicConditions && !student.healthRestrictions?.hasMedications && !student.healthRestrictions?.hasInjuries" class="no-restrictions-container">
                    <div class="no-restrictions-card">
                      <div class="no-restrictions-icon">
                        <i class="fas fa-check-circle"></i>
                      </div>
                      <div class="no-restrictions-content">
                        <span class="no-restrictions-text">Sem Restrições</span>
                        <span class="no-restrictions-subtitle">Nenhuma restrição de saúde identificada. Apto para treinar.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Progresso Tab -->
          <div v-show="activeTab === 'progresso'" class="progresso-tab">
            <!-- Weight Chart -->
            <div class="chart-card">
              <div class="card-header">
                <h3><i class="fas fa-chart-line"></i> Evolução de Peso (6 meses)</h3>
              </div>
              <div class="card-body">
                <div v-if="weightChartData.length === 0" class="empty-chart">
                  <i class="fas fa-chart-line"></i>
                  <p>Nenhum registro de peso disponível</p>
                </div>
                <div v-else class="weight-chart">
                  <svg :viewBox="`0 0 ${chartWidth} ${chartHeight}`" class="chart-svg">
                    <!-- Grid lines -->
                    <line v-for="i in 5" :key="'grid-' + i"
                      :x1="chartPadding" 
                      :y1="chartPadding + (chartHeight - 2 * chartPadding) * i / 5"
                      :x2="chartWidth - chartPadding" 
                      :y2="chartPadding + (chartHeight - 2 * chartPadding) * i / 5"
                      class="grid-line"
                    />
                    
                    <!-- Line path -->
                    <polyline 
                      :points="getChartPoints()" 
                      class="chart-line"
                      fill="none"
                    />
                    
                    <!-- Data points -->
                    <circle 
                      v-for="(point, idx) in weightChartData" 
                      :key="'point-' + idx"
                      :cx="getPointX(idx)"
                      :cy="getPointY(point.weight)"
                      r="4"
                      class="chart-point"
                    />
                  </svg>
                  <div class="chart-labels">
                    <span v-for="(point, idx) in weightChartData" :key="'label-' + idx" class="chart-label">
                      {{ formatDate(point.date) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Measurements Cards -->
            <div class="measurements-section">
              <div class="section-header">
                <h3><i class="fas fa-ruler-combined"></i> Medidas Corporais</h3>
                <p class="section-subtitle">Acompanhe a evolução das suas medidas</p>
              </div>
              <div class="measurements-grid-improved">
                <div class="measure-card-improved">
                  <div class="measure-card-header">
                    <div class="measure-icon-improved shoulder">
                      <i class="fas fa-arrows-up-down"></i>
                    </div>
                    <span class="measure-label-improved">Ombro</span>
                  </div>
                  <div class="measure-card-body">
                    <div class="measure-value-improved">
                      {{ getMeasurementWithChange('shoulder').value }}
                      <span class="measure-unit">cm</span>
                    </div>
                    <div 
                      v-if="getMeasurementWithChange('shoulder').change" 
                      :class="['measure-badge', getMeasurementWithChange('shoulder').change.isPositive ? 'positive' : 'negative']"
                    >
                      <i :class="getMeasurementWithChange('shoulder').change.isPositive ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                      {{ Math.abs(getMeasurementWithChange('shoulder').change.value) }}%
                    </div>
                  </div>
                </div>

                <div class="measure-card-improved">
                  <div class="measure-card-header">
                    <div class="measure-icon-improved chest">
                      <i class="fas fa-vest"></i>
                    </div>
                    <span class="measure-label-improved">Peito</span>
                  </div>
                  <div class="measure-card-body">
                    <div class="measure-value-improved">
                      {{ getMeasurementWithChange('chest').value }}
                      <span class="measure-unit">cm</span>
                    </div>
                    <div 
                      v-if="getMeasurementWithChange('chest').change" 
                      :class="['measure-badge', getMeasurementWithChange('chest').change.isPositive ? 'positive' : 'negative']"
                    >
                      <i :class="getMeasurementWithChange('chest').change.isPositive ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                      {{ Math.abs(getMeasurementWithChange('chest').change.value) }}%
                    </div>
                  </div>
                </div>

                <div class="measure-card-improved">
                  <div class="measure-card-header">
                    <div class="measure-icon-improved arm">
                      <i class="fas fa-hand-fist"></i>
                    </div>
                    <span class="measure-label-improved">Braço</span>
                  </div>
                  <div class="measure-card-body">
                    <div class="measure-value-improved">
                      {{ getMeasurementWithChange('arm').value }}
                      <span class="measure-unit">cm</span>
                    </div>
                    <div 
                      v-if="getMeasurementWithChange('arm').change" 
                      :class="['measure-badge', getMeasurementWithChange('arm').change.isPositive ? 'positive' : 'negative']"
                    >
                      <i :class="getMeasurementWithChange('arm').change.isPositive ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                      {{ Math.abs(getMeasurementWithChange('arm').change.value) }}%
                    </div>
                  </div>
                </div>

                <div class="measure-card-improved">
                  <div class="measure-card-header">
                    <div class="measure-icon-improved forearm">
                      <i class="fas fa-hand"></i>
                    </div>
                    <span class="measure-label-improved">Antebraço</span>
                  </div>
                  <div class="measure-card-body">
                    <div class="measure-value-improved">
                      {{ getMeasurementWithChange('forearm').value }}
                      <span class="measure-unit">cm</span>
                    </div>
                    <div 
                      v-if="getMeasurementWithChange('forearm').change" 
                      :class="['measure-badge', getMeasurementWithChange('forearm').change.isPositive ? 'positive' : 'negative']"
                    >
                      <i :class="getMeasurementWithChange('forearm').change.isPositive ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                      {{ Math.abs(getMeasurementWithChange('forearm').change.value) }}%
                    </div>
                  </div>
                </div>

                <div class="measure-card-improved">
                  <div class="measure-card-header">
                    <div class="measure-icon-improved waist">
                      <i class="fas fa-grip-lines"></i>
                    </div>
                    <span class="measure-label-improved">Cintura</span>
                  </div>
                  <div class="measure-card-body">
                    <div class="measure-value-improved">
                      {{ getMeasurementWithChange('waist').value }}
                      <span class="measure-unit">cm</span>
                    </div>
                    <div 
                      v-if="getMeasurementWithChange('waist').change" 
                      :class="['measure-badge', getMeasurementWithChange('waist').change.isPositive ? 'positive' : 'negative']"
                    >
                      <i :class="getMeasurementWithChange('waist').change.isPositive ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                      {{ Math.abs(getMeasurementWithChange('waist').change.value) }}%
                    </div>
                  </div>
                </div>

                <div class="measure-card-improved">
                  <div class="measure-card-header">
                    <div class="measure-icon-improved hip">
                      <i class="fas fa-circle-dot"></i>
                    </div>
                    <span class="measure-label-improved">Quadril</span>
                  </div>
                  <div class="measure-card-body">
                    <div class="measure-value-improved">
                      {{ getMeasurementWithChange('hip').value }}
                      <span class="measure-unit">cm</span>
                    </div>
                    <div 
                      v-if="getMeasurementWithChange('hip').change" 
                      :class="['measure-badge', getMeasurementWithChange('hip').change.isPositive ? 'positive' : 'negative']"
                    >
                      <i :class="getMeasurementWithChange('hip').change.isPositive ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                      {{ Math.abs(getMeasurementWithChange('hip').change.value) }}%
                    </div>
                  </div>
                </div>

                <div class="measure-card-improved">
                  <div class="measure-card-header">
                    <div class="measure-icon-improved thigh">
                      <i class="fas fa-person-walking"></i>
                    </div>
                    <span class="measure-label-improved">Coxa</span>
                  </div>
                  <div class="measure-card-body">
                    <div class="measure-value-improved">
                      {{ getMeasurementWithChange('thigh').value }}
                      <span class="measure-unit">cm</span>
                    </div>
                    <div 
                      v-if="getMeasurementWithChange('thigh').change" 
                      :class="['measure-badge', getMeasurementWithChange('thigh').change.isPositive ? 'positive' : 'negative']"
                    >
                      <i :class="getMeasurementWithChange('thigh').change.isPositive ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                      {{ Math.abs(getMeasurementWithChange('thigh').change.value) }}%
                    </div>
                  </div>
                </div>

                <div class="measure-card-improved">
                  <div class="measure-card-header">
                    <div class="measure-icon-improved calf">
                      <i class="fas fa-shoe-prints"></i>
                    </div>
                    <span class="measure-label-improved">Panturrilha</span>
                  </div>
                  <div class="measure-card-body">
                    <div class="measure-value-improved">
                      {{ getMeasurementWithChange('calf').value }}
                      <span class="measure-unit">cm</span>
                    </div>
                    <div 
                      v-if="getMeasurementWithChange('calf').change" 
                      :class="['measure-badge', getMeasurementWithChange('calf').change.isPositive ? 'positive' : 'negative']"
                    >
                      <i :class="getMeasurementWithChange('calf').change.isPositive ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                      {{ Math.abs(getMeasurementWithChange('calf').change.value) }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Progress Timeline -->
            <div class="timeline-card">
              <div class="card-header">
                <h3><i class="fas fa-history"></i> Histórico de Registros</h3>
                <span class="timeline-count">{{ progressTimeline.length }} registro(s)</span>
              </div>
              <div class="card-body">
                <div v-if="progressTimeline.length === 0" class="empty-timeline">
                  <i class="fas fa-clipboard-list"></i>
                  <p>Nenhum registro de progresso</p>
                  <p class="empty-subtitle">Adicione o primeiro registro para começar o acompanhamento</p>
                </div>
                <div v-else class="timeline-improved">
                  <div v-for="(entry, idx) in progressTimeline" :key="idx" class="timeline-entry">
                    <div class="entry-header">
                      <div class="entry-date">
                        <i class="fas fa-calendar-day"></i>
                        <span>{{ formatDateFull(entry.date) }}</span>
                      </div>
                      <div v-if="idx === 0" class="latest-badge">
                        <i class="fas fa-star"></i> Mais recente
                      </div>
                    </div>
                    <div class="entry-body">
                      <div class="entry-stats">
                        <div v-if="entry.weight" class="stat-item">
                          <div class="stat-icon weight">
                            <i class="fas fa-weight-scale"></i>
                          </div>
                          <div class="stat-info">
                            <span class="stat-label">Peso</span>
                            <span class="stat-value">{{ entry.weight }} kg</span>
                          </div>
                        </div>
                        <div v-if="entry.bodyFatPercentage" class="stat-item">
                          <div class="stat-icon bodyfat">
                            <i class="fas fa-percent"></i>
                          </div>
                          <div class="stat-info">
                            <span class="stat-label">Gordura</span>
                            <span class="stat-value">{{ entry.bodyFatPercentage }}%</span>
                          </div>
                        </div>
                        <div v-if="entry.muscleMass" class="stat-item">
                          <div class="stat-icon muscle">
                            <i class="fas fa-dumbbell"></i>
                          </div>
                          <div class="stat-info">
                            <span class="stat-label">Massa Muscular</span>
                            <span class="stat-value">{{ entry.muscleMass }} kg</span>
                          </div>
                        </div>
                      </div>
                      
                      <div v-if="entry.measurements && Object.keys(entry.measurements).length > 0" class="entry-measurements">
                        <div class="measurements-header">
                          <i class="fas fa-ruler"></i> Medidas Corporais
                        </div>
                        <div class="measurements-grid">
                          <div v-if="entry.measurements.shoulder" class="measurement-chip">
                            <span class="chip-label">Ombro</span>
                            <span class="chip-value">{{ entry.measurements.shoulder }} cm</span>
                          </div>
                          <div v-if="entry.measurements.chest" class="measurement-chip">
                            <span class="chip-label">Peito</span>
                            <span class="chip-value">{{ entry.measurements.chest }} cm</span>
                          </div>
                          <div v-if="entry.measurements.arm" class="measurement-chip">
                            <span class="chip-label">Braço</span>
                            <span class="chip-value">{{ entry.measurements.arm }} cm</span>
                          </div>
                          <div v-if="entry.measurements.forearm" class="measurement-chip">
                            <span class="chip-label">Antebraço</span>
                            <span class="chip-value">{{ entry.measurements.forearm }} cm</span>
                          </div>
                          <div v-if="entry.measurements.waist" class="measurement-chip">
                            <span class="chip-label">Cintura</span>
                            <span class="chip-value">{{ entry.measurements.waist }} cm</span>
                          </div>
                          <div v-if="entry.measurements.hip" class="measurement-chip">
                            <span class="chip-label">Quadril</span>
                            <span class="chip-value">{{ entry.measurements.hip }} cm</span>
                          </div>
                          <div v-if="entry.measurements.thigh" class="measurement-chip">
                            <span class="chip-label">Coxa</span>
                            <span class="chip-value">{{ entry.measurements.thigh }} cm</span>
                          </div>
                          <div v-if="entry.measurements.calf" class="measurement-chip">
                            <span class="chip-label">Panturrilha</span>
                            <span class="chip-value">{{ entry.measurements.calf }} cm</span>
                          </div>
                        </div>
                      </div>
                      
                      <div v-if="entry.notes" class="entry-notes">
                        <i class="fas fa-note-sticky"></i>
                        <p>{{ entry.notes }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Treinos Tab -->
          <div v-show="activeTab === 'treinos'" class="treinos-tab">
            <!-- Training Volume Chart -->
            <div class="volume-chart-card">
              <div class="card-header">
                <h3><i class="fas fa-chart-area"></i> Volume de Treino (Últimos 3 meses)</h3>
                <div class="chart-info">
                  <i class="fas fa-info-circle"></i>
                  <span class="tooltip-text">Detecta platôs e progressão</span>
                </div>
              </div>
              <div class="card-body">
                <div v-if="volumeChartData.length === 0" class="empty-chart">
                  <i class="fas fa-chart-area"></i>
                  <p>Nenhum dado de volume disponível</p>
                  <p class="chart-note">Os dados serão exibidos após o aluno completar treinos</p>
                </div>
                <div v-else class="volume-chart-container">
                  <!-- Volume Chart -->
                  <svg :viewBox="`0 0 ${chartWidth} ${volumeChartHeight}`" class="chart-svg">
                    <!-- Grid lines -->
                    <line v-for="i in 5" :key="'vol-grid-' + i"
                      :x1="chartPadding" 
                      :y1="chartPadding + (volumeChartHeight - 2 * chartPadding) * i / 5"
                      :x2="chartWidth - chartPadding" 
                      :y2="chartPadding + (volumeChartHeight - 2 * chartPadding) * i / 5"
                      class="grid-line"
                    />
                    
                    <!-- Volume area fill -->
                    <polygon 
                      :points="getVolumeAreaPoints()" 
                      class="volume-area"
                    />
                    
                    <!-- Volume line -->
                    <polyline 
                      :points="getVolumeLinePoints()" 
                      class="volume-line"
                      fill="none"
                    />
                    
                    <!-- Data points -->
                    <circle 
                      v-for="(point, idx) in volumeChartData" 
                      :key="'vol-point-' + idx"
                      :cx="getVolumePointX(idx)"
                      :cy="getVolumePointY(point.volume)"
                      r="5"
                      :class="['volume-point', { 'plateau-point': point.isPlateau }]"
                    >
                      <title>{{ formatDateFull(point.date) }}: {{ formatVolume(point.volume) }}</title>
                    </circle>
                    
                    <!-- Plateau indicators -->
                    <g v-for="(point, idx) in volumeChartData.filter(p => p.isPlateau)" :key="'plateau-' + idx">
                      <line 
                        :x1="getVolumePointX(volumeChartData.indexOf(point))"
                        :y1="getVolumePointY(point.volume) - 15"
                        :x2="getVolumePointX(volumeChartData.indexOf(point))"
                        :y2="getVolumePointY(point.volume) - 30"
                        class="plateau-line"
                      />
                      <text 
                        :x="getVolumePointX(volumeChartData.indexOf(point))"
                        :y="getVolumePointY(point.volume) - 35"
                        class="plateau-label"
                        text-anchor="middle"
                      >⚠️ Platô</text>
                    </g>
                    
                    <!-- Y-axis labels -->
                    <text 
                      v-for="i in 6" 
                      :key="'y-label-' + i"
                      :x="chartPadding - 10"
                      :y="chartPadding + (volumeChartHeight - 2 * chartPadding) * (i - 1) / 5"
                      class="axis-label"
                      text-anchor="end"
                      alignment-baseline="middle"
                    >{{ getVolumeYLabel(i) }}</text>
                  </svg>
                  
                  <!-- X-axis labels -->
                  <div class="chart-labels">
                    <span v-for="(point, idx) in volumeChartData" :key="'vol-label-' + idx" class="chart-label">
                      {{ formatDate(point.date) }}
                    </span>
                  </div>
                  
                  <!-- Volume Statistics -->
                  <div class="volume-stats">
                    <div class="volume-stat-item">
                      <span class="stat-icon"><i class="fas fa-arrow-trend-up"></i></span>
                      <div class="stat-data">
                        <span class="stat-label">Tendência</span>
                        <span :class="['stat-value', volumeTrend.class]">{{ volumeTrend.text }}</span>
                      </div>
                    </div>
                    <div class="volume-stat-item">
                      <span class="stat-icon"><i class="fas fa-chart-line"></i></span>
                      <div class="stat-data">
                        <span class="stat-label">Volume Médio</span>
                        <span class="stat-value">{{ formatVolume(averageVolume) }}</span>
                      </div>
                    </div>
                    <div class="volume-stat-item">
                      <span class="stat-icon"><i class="fas fa-fire"></i></span>
                      <div class="stat-data">
                        <span class="stat-label">Pico</span>
                        <span class="stat-value">{{ formatVolume(peakVolume) }}</span>
                      </div>
                    </div>
                    <div class="volume-stat-item">
                      <span class="stat-icon"><i class="fas fa-exclamation-triangle"></i></span>
                      <div class="stat-data">
                        <span class="stat-label">Platôs Detectados</span>
                        <span :class="['stat-value', plateauCount > 0 ? 'warning' : '']">{{ plateauCount }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Active Workout Plan -->
            <div class="active-plan-card">
              <div class="card-header">
                <h3><i class="fas fa-dumbbell"></i> Plano Ativo</h3>
              </div>
              <div class="card-body">
                <div v-if="!activePlan" class="empty-plan">
                  <i class="fas fa-clipboard-list"></i>
                  <p>Nenhum plano ativo encontrado</p>
                  <p class="empty-subtitle">Inicie um treino para ver o plano mais recente</p>
                  <button @click="openAssignPlanModal" class="btn-primary">
                    Atribuir Plano
                  </button>
                </div>
                <div v-else class="plan-details">
                  <h4>{{ activePlan.name }}</h4>
                  <p v-if="activePlan.isFromSession" class="plan-created">
                    <i class="fas fa-clock"></i> Baseado no último treino realizado
                  </p>
                  <p v-else class="plan-created">
                    <i class="fas fa-calendar"></i> Criado em: {{ formatDateFull(activePlan.createdAt) }}
                  </p>
                  <div class="plan-divisions">
                    <div v-for="(division, idx) in activePlan.divisions" :key="idx" class="division-item">
                      <div class="division-header">
                        <span class="division-name">{{ division.name }}</span>
                        <span class="division-count">{{ division.exercises?.length || 0 }} exercícios</span>
                      </div>
                      <div v-if="division.exercises && division.exercises.length > 0" class="division-exercises">
                        <div v-for="(exercise, exIdx) in division.exercises" :key="exIdx" class="exercise-item">
                          <span class="exercise-name">{{ exercise.name }}</span>
                          <span class="exercise-details">
                            {{ exercise.sets || 3 }}x{{ exercise.reps || 10 }}
                            <span v-if="exercise.weight && exercise.weight > 0"> - {{ exercise.weight }}kg</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Workout Statistics -->
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="fas fa-calendar-check"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ workoutStats.frequency }}%</span>
                  <span class="stat-label">Frequência Semanal</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="fas fa-fire"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ workoutStats.completed }}</span>
                  <span class="stat-label">Treinos Completos</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="fas fa-trophy"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ workoutStats.exercises }}</span>
                  <span class="stat-label">Exercícios Feitos</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ workoutStats.totalHours }}h</span>
                  <span class="stat-label">Horas Treinando</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="fas fa-chart-line"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ workoutStats.streak }}</span>
                  <span class="stat-label">Sequência (dias)</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="fas fa-calendar-week"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ workoutStats.weeklyCount }}/4</span>
                  <span class="stat-label">Meta Semanal</span>
                </div>
              </div>
            </div>

            <!-- Workout History -->
            <div class="history-card">
              <div class="card-header">
                <h3><i class="fas fa-history"></i> Histórico de Treinos (Últimos 10)</h3>
              </div>
              <div class="card-body">
                <div v-if="workoutHistory.length === 0" class="empty-history">
                  <i class="fas fa-dumbbell"></i>
                  <p>Nenhum treino registrado</p>
                </div>
                <div v-else class="history-list">
                  <div v-for="(workout, idx) in workoutHistory" :key="idx" class="history-item">
                    <div class="history-date">
                      <i class="fas fa-calendar"></i>
                      {{ formatDateFull(workout.date) }}
                    </div>
                    <div class="history-name">
                      {{ workout.name }}
                      <span v-if="workout.division" class="division-tag">{{ workout.division }}</span>
                    </div>
                    <div class="history-stats">
                      <span><i class="fas fa-clock"></i> {{ workout.duration }}min</span>
                      <span><i class="fas fa-list-check"></i> {{ workout.exercisesCompleted }}/{{ workout.totalExercises }}</span>
                    </div>
                    <div :class="['history-status', workout.status]">
                      {{ formatStatus(workout.status) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Add Progress -->
    <div v-if="showProgressModal" class="modal-overlay" @click="closeProgressModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2><i class="fas fa-chart-line"></i> Adicionar Progresso Físico</h2>
          <button @click="closeProgressModal" class="btn-close">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitProgress">
            <div class="form-grid">
              <div class="form-group">
                <label><i class="fas fa-weight-scale"></i> Peso (kg)</label>
                <input v-model.number="progressForm.weight" type="number" step="0.1" class="form-input" placeholder="Ex: 75.5" />
              </div>
              <div class="form-group">
                <label><i class="fas fa-percent"></i> % Gordura</label>
                <input v-model.number="progressForm.bodyFatPercentage" type="number" step="0.1" class="form-input" placeholder="Ex: 18.5" />
              </div>
              <div class="form-group">
                <label><i class="fas fa-arrows-up-down"></i> Ombro (cm)</label>
                <input v-model.number="progressForm.measurements.shoulder" type="number" step="0.1" class="form-input" placeholder="Ex: 115" />
              </div>
              <div class="form-group">
                <label><i class="fas fa-vest"></i> Peito (cm)</label>
                <input v-model.number="progressForm.measurements.chest" type="number" step="0.1" class="form-input" placeholder="Ex: 105" />
              </div>
              <div class="form-group">
                <label><i class="fas fa-hand-fist"></i> Braço (cm)</label>
                <input v-model.number="progressForm.measurements.arm" type="number" step="0.1" class="form-input" placeholder="Ex: 38" />
              </div>
              <div class="form-group">
                <label><i class="fas fa-hand"></i> Antebraço (cm)</label>
                <input v-model.number="progressForm.measurements.forearm" type="number" step="0.1" class="form-input" placeholder="Ex: 30" />
              </div>
              <div class="form-group">
                <label><i class="fas fa-grip-lines"></i> Cintura (cm)</label>
                <input v-model.number="progressForm.measurements.waist" type="number" step="0.1" class="form-input" placeholder="Ex: 85" />
              </div>
              <div class="form-group">
                <label><i class="fas fa-circle-dot"></i> Quadril (cm)</label>
                <input v-model.number="progressForm.measurements.hip" type="number" step="0.1" class="form-input" placeholder="Ex: 95" />
              </div>
              <div class="form-group">
                <label><i class="fas fa-person-walking"></i> Coxa (cm)</label>
                <input v-model.number="progressForm.measurements.thigh" type="number" step="0.1" class="form-input" placeholder="Ex: 58" />
              </div>
              <div class="form-group">
                <label><i class="fas fa-shoe-prints"></i> Panturrilha (cm)</label>
                <input v-model.number="progressForm.measurements.calf" type="number" step="0.1" class="form-input" placeholder="Ex: 38" />
              </div>
              <div class="form-group full-width">
                <label><i class="fas fa-note-sticky"></i> Observações</label>
                <textarea v-model="progressForm.notes" class="form-textarea" rows="3" placeholder="Observações sobre o progresso..."></textarea>
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" @click="closeProgressModal" class="btn-outline">Cancelar</button>
              <button type="submit" class="btn-primary" :disabled="submitting">
                <span v-if="!submitting">Salvar</span>
                <span v-else><i class="fas fa-spinner fa-spin"></i> Salvando...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal: Assign Plan -->
    <div v-if="showAssignPlanModal" class="modal-overlay" @click="closeAssignPlanModal">
      <div class="modal-content modal-large" @click.stop>
        <div class="modal-header">
          <h2><i class="fas fa-dumbbell"></i> Atribuir Plano de Treino</h2>
          <button @click="closeAssignPlanModal" class="btn-close">&times;</button>
        </div>
        <div class="modal-body">
          <!-- Loading Plans -->
          <div v-if="loadingPlans" class="loading-plans">
            <div class="loader"></div>
            <p>Carregando planos...</p>
          </div>

          <!-- No Plans -->
          <div v-else-if="workoutPlans.length === 0" class="no-plans">
            <i class="fas fa-clipboard-list"></i>
            <p>Nenhum plano de treino disponível</p>
            <p class="modal-note">Crie um plano de treino primeiro</p>
          </div>

          <!-- Plans List -->
          <div v-else class="plans-grid">
            <div 
              v-for="plan in workoutPlans" 
              :key="plan._id"
              @click="selectPlan(plan)"
              :class="['plan-card', { 'selected': selectedPlan?._id === plan._id }]"
            >
              <div class="plan-card-header">
                <h3>{{ plan.name }}</h3>
                <div v-if="selectedPlan?._id === plan._id" class="selected-badge">
                  <i class="fas fa-check-circle"></i>
                </div>
              </div>
              <div class="plan-card-body">
                <div class="plan-stat">
                  <i class="fas fa-layer-group"></i>
                  <span>{{ plan.divisions?.length || 0 }} divisões</span>
                </div>
                <div class="plan-stat">
                  <i class="fas fa-dumbbell"></i>
                  <span>{{ getTotalExercises(plan) }} exercícios</span>
                </div>
              </div>
              <div class="plan-divisions-preview">
                <div v-for="(division, idx) in plan.divisions" :key="idx" class="division-preview">
                  <span class="division-badge">{{ division.name }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-actions" v-if="workoutPlans.length > 0">
            <button type="button" @click="closeAssignPlanModal" class="btn-outline">Cancelar</button>
            <button 
              type="button" 
              @click="assignPlan" 
              class="btn-primary" 
              :disabled="!selectedPlan || submitting"
            >
              <span v-if="!submitting">Atribuir Plano</span>
              <span v-else><i class="fas fa-spinner fa-spin"></i> Atribuindo...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

    <!-- Notification Modal -->
    <NotificationModal
      v-model:visible="notification.visible"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
    />
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import NotificationModal from '@/components/NotificationModal.vue';
import { useRoute } from 'vue-router';
import { useThemeStore } from '../store/theme';
import DashboardNavBar from '../components/DashboardNavBar.vue';
import { getStudentById, addStudentProgress, getWorkoutPlans, assignPlanToStudent } from '../api';
import api from '../api';

export default {
  name: 'StudentProfileView',
  components: {
    NotificationModal,
    DashboardNavBar
  },
  setup() {
    const notification = ref({ visible: false, type: 'info', title: '', message: '' });
    const route = useRoute();
    const themeStore = useThemeStore();
    const isDarkMode = computed(() => themeStore.isDarkMode);

    // State
    const loading = ref(true);
    const error = ref(null);
    const student = ref({});
    const activeTab = ref('dados');
    const expandedHealth = ref(false);
    const showProgressModal = ref(false);
    const showAssignPlanModal = ref(false);
    const submitting = ref(false);
    const workoutPlans = ref([]);
    const selectedPlan = ref(null);
    const loadingPlans = ref(false);
    
    // Workout sessions data
    const workoutSessions = ref([]);
    const loadingSessions = ref(false);

    const tabs = [
      { id: 'dados', label: 'Dados', icon: 'fas fa-user' },
      { id: 'progresso', label: 'Progresso', icon: 'fas fa-chart-line' },
      { id: 'treinos', label: 'Treinos', icon: 'fas fa-dumbbell' }
    ];

    const progressForm = ref({
      weight: null,
      bodyFatPercentage: null,
      measurements: {
        shoulder: null,
        chest: null,
        arm: null,
        forearm: null,
        waist: null,
        hip: null,
        thigh: null,
        calf: null
      },
      notes: ''
    });

    // Chart config
    const chartWidth = ref(800);
    const chartHeight = ref(300);
    const volumeChartHeight = ref(350);
    const chartPadding = ref(40);
    
    // Helper function to calculate workout streak
    const calculateWorkoutStreak = (sessions) => {
      if (!sessions || sessions.length === 0) return 0;
      
      const completedSessions = sessions
        .filter(s => s.status === 'completed')
        .sort((a, b) => new Date(b.endTime || b.startTime) - new Date(a.endTime || a.startTime));
      
      if (completedSessions.length === 0) return 0;
      
      // Agrupar sessões por dia (ignorar hora)
      const sessionsByDay = {};
      completedSessions.forEach(session => {
        const sessionDate = new Date(session.endTime || session.startTime);
        const dayKey = sessionDate.toDateString(); // Apenas a data, sem hora
        sessionsByDay[dayKey] = true;
      });
      
      // Converter para array de datas únicas ordenadas
      const uniqueDays = Object.keys(sessionsByDay)
        .map(dayStr => new Date(dayStr))
        .sort((a, b) => b - a); // Mais recente primeiro
      
      if (uniqueDays.length === 0) return 0;
      
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Começar do dia mais recente e verificar consecutividade
      for (let i = 0; i < uniqueDays.length; i++) {
        const currentDay = new Date(uniqueDays[i]);
        currentDay.setHours(0, 0, 0, 0);
        
        const expectedDay = new Date(today);
        expectedDay.setDate(today.getDate() - i);
        
        // Se o dia atual corresponde ao esperado (hoje - i dias)
        if (currentDay.getTime() === expectedDay.getTime()) {
          streak++;
        } else {
          // Se não é consecutivo, parar a contagem
          break;
        }
      }
      
      return streak;
    };

    // Computed
    const weightChartData = computed(() => {
      if (!student.value.progressHistory || student.value.progressHistory.length === 0) return [];
      
      const logs = [...student.value.progressHistory]
        .filter(log => log.weight)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-6);
      
      return logs.map(log => ({
        date: log.date,
        weight: log.weight
      }));
    });

    const progressTimeline = computed(() => {
      if (!student.value.progressHistory) return [];
      return [...student.value.progressHistory]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);
    });

    const activePlan = computed(() => {
      // Primeiro, verificar se tem workout sessions recentes
      if (workoutSessions.value && workoutSessions.value.length > 0) {
        // Pegar a sessão mais recente que tem workoutPlanId
        const recentSessionsWithPlan = workoutSessions.value
          .filter(s => s.workoutPlanId && s.workoutName)
          .sort((a, b) => new Date(b.endTime || b.startTime) - new Date(a.endTime || a.startTime));
        
        if (recentSessionsWithPlan.length > 0) {
          const latestSession = recentSessionsWithPlan[0];
          
          // Agrupar exercícios da sessão por divisão (se houver)
          let divisions = [];
          if (latestSession.exercises && latestSession.exercises.length > 0) {
            divisions = [{
              name: latestSession.divisionName || 'Treino Principal',
              exercises: latestSession.exercises.map(ex => ({
                name: ex.exerciseName || ex.name || 'Exercício',
                sets: ex.sets ? ex.sets.length : 3,
                reps: ex.sets && ex.sets[0] ? ex.sets[0].reps : 10,
                weight: ex.sets && ex.sets[0] ? ex.sets[0].weight : 0
              }))
            }];
          }
          
          return {
            _id: latestSession.workoutPlanId,
            name: latestSession.workoutName,
            divisions: divisions,
            description: `Último treino realizado`,
            isFromSession: true
          };
        }
      }
      
      // Fallback: verificar se o estudante tem planos atribuídos
      if (student.value.workoutPlans && student.value.workoutPlans.length > 0) {
        return {
          ...student.value.workoutPlans[0],
          isFromSession: false
        };
      }
      
      return null;
    });

    const workoutStats = computed(() => {
      if (!workoutSessions.value || workoutSessions.value.length === 0) {
        return {
          frequency: 0,
          completed: 0,
          exercises: 0,
          totalHours: 0,
          streak: 0,
          weeklyCount: 0
        };
      }
      
      const completedSessions = workoutSessions.value.filter(s => s.status === 'completed');
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const sessionsThisWeek = completedSessions.filter(s => {
        const sessionDate = new Date(s.endTime || s.startTime);
        return sessionDate >= weekAgo;
      });
      
      const totalMinutes = completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      const totalHours = Math.round(totalMinutes / 60 * 10) / 10;
      
      const totalExercises = completedSessions.reduce((sum, s) => {
        return sum + (s.completedExercises || 0);
      }, 0);
      
      // Calcular streak (dias consecutivos)
      const streak = calculateWorkoutStreak(completedSessions);
      
      return {
        frequency: completedSessions.length > 0 ? Math.round((sessionsThisWeek.length / 4) * 100) : 0,
        completed: completedSessions.length,
        exercises: totalExercises,
        totalHours,
        streak,
        weeklyCount: sessionsThisWeek.length
      };
    });

    const workoutHistory = computed(() => {
      if (!workoutSessions.value || workoutSessions.value.length === 0) return [];
      
      return [...workoutSessions.value]
        .filter(s => s.status === 'completed')
        .sort((a, b) => new Date(b.endTime || b.startTime) - new Date(a.endTime || a.startTime))
        .slice(0, 10)
        .map(session => ({
          date: session.endTime || session.startTime,
          name: session.workoutName || 'Treino',
          division: session.divisionName || '',
          duration: session.duration || 0,
          exercisesCompleted: session.completedExercises || 0,
          totalExercises: session.totalExercises || 0,
          status: 'completed'
        }));
    });

    // Computed para normalizar o avatar
    const studentAvatar = computed(() => {
      return student.value.userId?.avatar || student.value.avatar || null;
    });

    // Methods
    const loadWorkoutSessions = async (studentId) => {
      try {
        loadingSessions.value = true;
        
        const response = await api.get(`/workout-sessions/sessions/student/${studentId}`);
        
        const sessions = response.data?.sessions || [];
        workoutSessions.value = sessions;
        
      } catch (error) {
        console.error('❌ [StudentProfile] Erro ao carregar workout sessions:', error);
        
        try {
          const fallbackResponse = await api.get('/workout-sessions/sessions/all');
          const allSessions = fallbackResponse.data?.sessions || [];
          workoutSessions.value = allSessions;
        } catch (fallbackError) {
          console.error('❌ [StudentProfile] Fallback também falhou:', fallbackError);
          workoutSessions.value = [];
        }
      } finally {
        loadingSessions.value = false;
      }
    };

    const loadStudentData = async () => {
      try {
        loading.value = true;
        error.value = null;
        const studentId = route.params.id;
        
        const response = await getStudentById(studentId);
        
        // Se for array, pegar o primeiro elemento
        if (Array.isArray(response.data)) {
          console.warn('⚠️ [StudentProfileView] API retornou array, pegando primeiro elemento');
          student.value = response.data[0] || {};
        } else {
          student.value = response.data;
        }
        
        // Carregar workout sessions do aluno
        if (student.value._id) {
          await loadWorkoutSessions(student.value._id);
        }
      } catch (err) {
        console.error('❌ [StudentProfileView] Erro ao carregar aluno:', err);
        console.error('❌ [StudentProfileView] Erro completo:', err.response);
        error.value = err.response?.data?.message || 'Erro ao carregar dados do aluno';
      } finally {
        loading.value = false;
      }
    };

    const calculateAge = (birthDate) => {
      if (!birthDate) return '-';
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    };

    const formatPhone = (phone) => {
      if (!phone) return '-';
      const cleaned = phone.replace(/\D/g, '');
      if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
      }
      return phone;
    };

    const calculateIMC = () => {
      const weight = student.value.personalInfo?.currentWeight;
      const height = student.value.personalInfo?.currentHeight;
      if (!weight || !height || weight <= 0 || height <= 0) return 'Não calculado';
      const imc = weight / Math.pow(height / 100, 2);
      return imc.toFixed(1);
    };

    const formatExperience = (exp) => {
      const mapping = {
        'iniciante': 'Iniciante',
        'intermediario': 'Intermediário',
        'avancado': 'Avançado',
        'atleta': 'Atleta'
      };
      return mapping[exp] || exp || '-';
    };

    const hasHealthRestrictions = () => {
      const hr = student.value.healthRestrictions;
      return hr?.hasChronicConditions || hr?.hasInjuries || hr?.hasMedications;
    };

    const getLatestMeasurement = (measurement) => {
      // Tenta pegar do progressHistory primeiro
      if (student.value.progressHistory && student.value.progressHistory.length > 0) {
        const latest = [...student.value.progressHistory]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .find(log => log.measurements && log.measurements[measurement]);
        
        if (latest?.measurements[measurement]) {
          return latest.measurements[measurement];
        }
      }
      
      // Fallback para initialMeasurements
      if (student.value.personalInfo?.initialMeasurements?.[measurement]) {
        return student.value.personalInfo.initialMeasurements[measurement];
      }
      
      return '-';
    };

    const getMeasurementWithChange = (measurement) => {
      const initial = student.value.personalInfo?.initialMeasurements?.[measurement];
      let current = null;
      
      // Pega a medida atual do progressHistory
      if (student.value.progressHistory && student.value.progressHistory.length > 0) {
        const latest = [...student.value.progressHistory]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .find(log => log.measurements && log.measurements[measurement]);
        current = latest?.measurements[measurement];
      }
      
      // Se não tem progresso, usa initial como atual
      if (!current) {
        current = initial;
      }
      
      const value = current || '-';
      let change = null;
      
      // Calcula a diferença percentual se tiver ambos os valores
      if (initial && current && initial !== current) {
        const percentage = ((current - initial) / initial * 100).toFixed(1);
        change = {
          value: percentage,
          isPositive: current > initial
        };
      }
      
      return { value, change };
    };

    const formatDate = (date) => {
      if (!date) return '';
      const d = new Date(date);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    };

    const formatDateFull = (date) => {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString('pt-BR');
    };

    const formatStatus = (status) => {
      const mapping = {
        'completed': 'Completo',
        'partial': 'Parcial',
        'missed': 'Perdido',
        'cancelled': 'Cancelado'
      };
      return mapping[status] || status;
    };

    const getTotalExercises = (plan) => {
      if (!plan.divisions) return 0;
      return plan.divisions.reduce((total, division) => {
        return total + (division.exercises?.length || 0);
      }, 0);
    };

    // Volume Chart Data and Calculations
    const volumeChartData = computed(() => {
      if (!workoutSessions.value || workoutSessions.value.length === 0) return [];
      
      // Pegar últimos 3 meses de dados de treino
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      const completedSessions = workoutSessions.value
        .filter(s => s.status === 'completed' && new Date(s.endTime || s.startTime) >= threeMonthsAgo)
        .sort((a, b) => new Date(a.endTime || a.startTime) - new Date(b.endTime || b.startTime));
      
      if (completedSessions.length === 0) return [];
      
      // Calcular volume para cada treino baseado em dados reais
      const volumeData = completedSessions.map((session) => {
        // Volume = exercícios completados * sets completados * peso médio estimado
        let totalVolume = 0;
        
        if (session.exercises && Array.isArray(session.exercises)) {
          session.exercises.forEach(exercise => {
            if (exercise.sets && Array.isArray(exercise.sets)) {
              exercise.sets.forEach(set => {
                if (set.completed && set.weight && set.actualReps) {
                  totalVolume += set.weight * set.actualReps;
                }
              });
            }
          });
        }
        
        // Se não temos dados detalhados de volume, usar aproximação
        if (totalVolume === 0) {
          totalVolume = (session.completedExercises || 0) * (session.completedSets || 0) * 50; // 50kg peso médio estimado
        }
        
        return {
          date: session.endTime || session.startTime,
          volume: totalVolume,
          isPlateau: false,
          sessionName: session.workoutName,
          division: session.divisionName
        };
      });
      
      // Detectar platôs (quando o volume não aumenta significativamente em 3+ sessões)
      for (let i = 3; i < volumeData.length; i++) {
        const last3 = volumeData.slice(i - 3, i);
        const avgLast3 = last3.reduce((sum, d) => sum + d.volume, 0) / 3;
        const current = volumeData[i].volume;
        
        // Platô: menos de 5% de melhoria nas últimas 3 sessões
        if (current <= avgLast3 * 1.05) {
          volumeData[i].isPlateau = true;
        }
      }
      
      return volumeData;
    });

    const volumeTrend = computed(() => {
      if (volumeChartData.value.length < 2) return { text: 'Sem dados', class: '' };
      
      const recent = volumeChartData.value.slice(-3);
      const older = volumeChartData.value.slice(-6, -3);
      
      if (older.length === 0) return { text: 'Iniciando', class: 'neutral' };
      
      const recentAvg = recent.reduce((sum, d) => sum + d.volume, 0) / recent.length;
      const olderAvg = older.reduce((sum, d) => sum + d.volume, 0) / older.length;
      
      const diff = ((recentAvg - olderAvg) / olderAvg) * 100;
      
      if (diff > 10) return { text: '↑ Crescente', class: 'positive' };
      if (diff < -10) return { text: '↓ Decrescente', class: 'negative' };
      return { text: '→ Estável', class: 'neutral' };
    });

    const averageVolume = computed(() => {
      if (volumeChartData.value.length === 0) return 0;
      const sum = volumeChartData.value.reduce((acc, d) => acc + d.volume, 0);
      return sum / volumeChartData.value.length;
    });

    const peakVolume = computed(() => {
      if (volumeChartData.value.length === 0) return 0;
      return Math.max(...volumeChartData.value.map(d => d.volume));
    });

    const plateauCount = computed(() => {
      return volumeChartData.value.filter(d => d.isPlateau).length;
    });

    // Weight Progress Calculations
    const weightProgress = computed(() => {
      const currentWeight = student.value.personalInfo?.currentWeight || 0;
      const targetWeight = student.value.goals?.weight?.target || 0;
      const initialWeight = student.value.personalInfo?.initialWeight || currentWeight;
      
      if (!targetWeight || !currentWeight) {
        return {
          percentage: 0,
          text: 'Meta não definida',
          remaining: 0
        };
      }

      const totalGoal = Math.abs(targetWeight - initialWeight);
      const currentProgress = Math.abs(currentWeight - initialWeight);
      const percentage = totalGoal > 0 ? Math.min((currentProgress / totalGoal) * 100, 100) : 0;
      const remaining = Math.abs(targetWeight - currentWeight);

      return {
        percentage: Math.round(percentage * 10) / 10,
        text: `Progresso ${Math.round(percentage * 10) / 10}%`,
        remaining: Math.round(remaining * 10) / 10
      };
    });

    const weightGoalNote = computed(() => {
      const progress = weightProgress.value;
      const targetWeight = student.value.goals?.weight?.target || 0;
      const currentWeight = student.value.personalInfo?.currentWeight || 0;
      
      if (!targetWeight || !currentWeight) {
        return 'Defina uma meta de peso para acompanhar seu progresso';
      }

      if (progress.remaining <= 0.5) {
        return 'Parabéns! Você atingiu sua meta de peso!';
      } else if (progress.remaining <= 2) {
        return `Falta apenas ${progress.remaining} kg para atingir sua meta!`;
      } else {
        const action = targetWeight > currentWeight ? 'ganhar' : 'perder';
        return `Faltam ${progress.remaining} kg para ${action} e atingir sua meta`;
      }
    });

    // Volume Chart Drawing Functions
    const getVolumePointX = (index) => {
      const dataWidth = chartWidth.value - 2 * chartPadding.value;
      const step = dataWidth / (volumeChartData.value.length - 1 || 1);
      return chartPadding.value + index * step;
    };

    const getVolumePointY = (volume) => {
      const volumes = volumeChartData.value.map(d => d.volume);
      const minVolume = Math.min(...volumes);
      const maxVolume = Math.max(...volumes);
      const range = maxVolume - minVolume || 1;
      const dataHeight = volumeChartHeight.value - 2 * chartPadding.value;
      
      return volumeChartHeight.value - chartPadding.value - ((volume - minVolume) / range) * dataHeight;
    };

    const getVolumeLinePoints = () => {
      return volumeChartData.value
        .map((point, idx) => `${getVolumePointX(idx)},${getVolumePointY(point.volume)}`)
        .join(' ');
    };

    const getVolumeAreaPoints = () => {
      if (volumeChartData.value.length === 0) return '';
      
      const linePoints = volumeChartData.value
        .map((point, idx) => `${getVolumePointX(idx)},${getVolumePointY(point.volume)}`)
        .join(' ');
      
      const lastX = getVolumePointX(volumeChartData.value.length - 1);
      const firstX = getVolumePointX(0);
      const bottomY = volumeChartHeight.value - chartPadding.value;
      
      return `${linePoints} ${lastX},${bottomY} ${firstX},${bottomY}`;
    };

    const getVolumeYLabel = (index) => {
      const volumes = volumeChartData.value.map(d => d.volume);
      if (volumes.length === 0) return '0';
      
      const minVolume = Math.min(...volumes);
      const maxVolume = Math.max(...volumes);
      const value = maxVolume - ((index - 1) / 5) * (maxVolume - minVolume);
      
      return Math.round(value).toString();
    };

    const formatVolume = (volume) => {
      if (!volume) return '0';
      return Math.round(volume).toLocaleString();
    };

    // Chart methods
    const getPointX = (index) => {
      const dataWidth = chartWidth.value - 2 * chartPadding.value;
      const step = dataWidth / (weightChartData.value.length - 1 || 1);
      return chartPadding.value + index * step;
    };

    const getPointY = (weight) => {
      const weights = weightChartData.value.map(d => d.weight);
      const minWeight = Math.min(...weights);
      const maxWeight = Math.max(...weights);
      const range = maxWeight - minWeight || 1;
      const dataHeight = chartHeight.value - 2 * chartPadding.value;
      
      return chartHeight.value - chartPadding.value - ((weight - minWeight) / range) * dataHeight;
    };

    const getChartPoints = () => {
      return weightChartData.value
        .map((point, idx) => `${getPointX(idx)},${getPointY(point.weight)}`)
        .join(' ');
    };

    // Modal methods
    const closeProgressModal = () => {
      showProgressModal.value = false;
      progressForm.value = {
        weight: null,
        bodyFatPercentage: null,
        measurements: {
          shoulder: null,
          chest: null,
          rightArm: null,
          forearm: null,
          waist: null,
          hip: null,
          rightThigh: null,
          calf: null
        },
        notes: ''
      };
    };

    const openAssignPlanModal = async () => {
      try {
        loadingPlans.value = true;
        showAssignPlanModal.value = true;
        const response = await getWorkoutPlans();
        workoutPlans.value = response.data;
      } catch (err) {
        console.error('Error loading workout plans:', err);
        showNotification('error', 'Erro', 'Erro ao carregar planos de treino');
      } finally {
        loadingPlans.value = false;
      }
    };

    const closeAssignPlanModal = () => {
      showAssignPlanModal.value = false;
      selectedPlan.value = null;
    };

    const selectPlan = (plan) => {
      selectedPlan.value = plan;
    };

    const assignPlan = async () => {
      if (!selectedPlan.value) {
        showNotification('warning', 'Atencao', 'Selecione um plano de treino');
        return;
      }

      try {
        submitting.value = true;
        await assignPlanToStudent(student.value._id, selectedPlan.value._id);
        await loadStudentData();
        closeAssignPlanModal();
        showNotification('success', 'Sucesso', 'Plano atribuído com sucesso!');
      } catch (err) {
        console.error('Error assigning plan:', err);
        showNotification('error', 'Erro', 'Erro ao atribuir plano');
      } finally {
        submitting.value = false;
      }
    };

    const submitProgress = async () => {
      try {
        submitting.value = true;
        
        await addStudentProgress(student.value._id, progressForm.value);
        await loadStudentData();
        
        closeProgressModal();
      } catch (err) {
        console.error('❌ Error adding progress:', err);
        showNotification('error', 'Erro', 'Erro ao adicionar progresso: ' + (err.response?.data?.message || err.message));
      } finally {
        submitting.value = false;
      }
    };

    const exportData = () => {
      // Criar CSV com dados do aluno
      const csvData = [
        ['Nome', student.value.name],
        ['Email', student.value.email],
        ['Telefone', formatPhone(student.value.phone)],
        ['Idade', calculateAge(student.value.birthDate)],
        ['Peso Atual', student.value.personalInfo?.currentWeight || '-'],
        ['Altura', student.value.personalInfo?.currentHeight || '-'],
        ['IMC', calculateIMC()],
        ['Experiência', formatExperience(student.value.personalInfo?.trainingExperience)],
        ['Objetivo', student.value.goals?.primary?.type || '-'],
        [''],
        ['Histórico de Progresso'],
        ['Data', 'Peso', '% Gordura', 'Observações']
      ];

      if (student.value.progressHistory) {
        student.value.progressHistory.forEach(entry => {
          csvData.push([
            formatDateFull(entry.date),
            entry.weight || '-',
            entry.bodyFatPercentage || '-',
            entry.notes || '-'
          ]);
        });
      }

      const csv = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${student.value.name}_dados.csv`;
      link.click();
    };

    onMounted(() => {
      loadStudentData();
    });

    const showNotification = (type, title, message) => {
      notification.value = {
        visible: true,
        type: type,
        title: title,
        message: message
      };
    };

    return {
      isDarkMode,
      notification,
      showNotification,
      loading,
      error,
      student,
      studentAvatar,
      activeTab,
      tabs,
      expandedHealth,
      showProgressModal,
      showAssignPlanModal,
      submitting,
      progressForm,
      weightChartData,
      progressTimeline,
      activePlan,
      workoutStats,
      workoutHistory,
      chartWidth,
      chartHeight,
      volumeChartHeight,
      chartPadding,
      volumeChartData,
      volumeTrend,
      averageVolume,
      peakVolume,
      plateauCount,
      weightProgress,
      weightGoalNote,
      getVolumePointX,
      getVolumePointY,
      getVolumeLinePoints,
      getVolumeAreaPoints,
      getVolumeYLabel,
      formatVolume,
      workoutPlans,
      selectedPlan,
      loadingPlans,
      workoutSessions,
      loadingSessions,
      loadWorkoutSessions,
      loadStudentData,
      calculateAge,
      formatPhone,
      calculateIMC,
      formatExperience,
      hasHealthRestrictions,
      getLatestMeasurement,
      getMeasurementWithChange,
      formatDate,
      formatDateFull,
      formatStatus,
      getPointX,
      getPointY,
      getChartPoints,
      closeProgressModal,
      openAssignPlanModal,
      closeAssignPlanModal,
      selectPlan,
      assignPlan,
      submitProgress,
      exportData,
      getTotalExercises
    };
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

/* Base Styles */
.student-profile-view {
  min-height: 100vh;
  font-family: "Inter", sans-serif;
  background: #f8fafc;
  transition: background 0.3s ease;
}

.dark-mode {
  background: #171723;
  color: #f9fafb;
}

.main-content {
  margin-left: 280px;
  padding: 2rem;
  transition: margin-left 0.3s ease;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 1rem;
  }
}

/* Loading & Error States */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1.5rem;
}

.loader {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.dark-mode .loader {
  border-color: #2d2d3f;
  border-top-color: #3b82f6;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state i {
  font-size: 3rem;
  color: #ff4444;
}

.btn-retry {
  padding: 0.75rem 1.5rem;
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-retry:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

/* Header Section */
.profile-header {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.dark-mode .profile-header {
  background: #1e1e2d;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  border-color: #2d2d3f;
}

.header-left {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #3b82f6;
}

.status-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #10b981;
  color: white;
}

.status-badge.inactive {
  background: #ef4444;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.student-name {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
}

.dark-mode .student-name {
  color: #f9fafb;
}

.student-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.9rem;
}

.dark-mode .meta-item {
  color: #9ca3af;
}

.meta-item i {
  color: #64748b
}

.header-actions {
  display: inline-flex;
  padding: 8px;
  gap: 4px;
  margin-bottom: 2rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  background: transparent;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  color: #333;
  transition: background-color 0.2s ease;
  position: relative;
  min-height: auto;
  white-space: nowrap;
}

.action-btn::before {
  display: none;
}

.action-btn:hover {
  background-color: #f5f5f5;
}

.action-btn:hover::before {
  display: none;
}

.dark-mode .action-btn {
  color: #94a3b8;
  border: none;
}

.dark-mode .action-btn:hover {
  color: #cbd5e1;
  background-color: rgba(255, 255, 255, 0.05);
}

.dark-mode .action-btn:hover::before {
  display: none;
}

.action-btn.active {
  background: #3b82f6;
  color: white;
  border: none;
  box-shadow: none;
}

.action-btn.active::before {
  display: none;
}

.action-btn.active::after {
  display: none;
}

.dark-mode .action-btn.active {
  background: #8b5cf6;
  box-shadow: none;
}

.dark-mode .action-btn.active::before {
  display: none;
}

.action-btn.active i {
  transform: none;
}

.action-btn i {
  width: 18px;
  height: 18px;
  font-size: 16px;
  transition: none;
}

.action-btn span {
  font-weight: 500;
  letter-spacing: 0;
  transition: none;
}

/*
.btn-primary,
.btn-secondary,
.btn-outline {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
}

.dark-mode .btn-primary {
  background: #8b5cf6;
}

.dark-mode .btn-primary:hover {
  background: #7c3aed;
  box-shadow: 0 8px 16px rgba(139, 92, 246, 0.3);
}

.btn-secondary {
  background: #3498db;
  color: white;
}

.btn-secondary:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  color: #3b82f6;
  border: 2px solid #3b82f6;
}

.btn-outline:hover {
  background: #3b82f6;
  color: white;
}

.dark-mode .btn-outline {
  color: #8b5cf6;
  border-color: #8b5cf6;
}

.dark-mode .btn-outline:hover {
  background: #8b5cf6;
  color: white;
}
*/

/* Tabs */
.tabs-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: inline-flex;
  padding: 8px;
  gap: 4px;
  margin-bottom: 2rem;
}

.tabs-container::before {
  display: none;
}

.dark-mode .tabs-container {
  background: #1e1e2d;
  border: 1px solid #2d2d3f;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark-mode .tabs-container::before {
  display: none;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  transition: background-color 0.2s ease;
  position: relative;
  min-height: auto;
}

.tab-btn::before {
  display: none;
}

.tab-btn:hover {
  background-color: #f5f5f5;
}

.tab-btn:hover::before {
  display: none;
}

.dark-mode .tab-btn {
  color: #94a3b8;
}

.dark-mode .tab-btn:hover {
  color: #cbd5e1;
  background-color: rgba(255, 255, 255, 0.05);
}

.dark-mode .tab-btn:hover::before {
  display: none;
}

.tab-btn.active {
  background: #3b82f6;
  color: white;
  box-shadow: none;
}

.tab-btn.active::before {
  display: none;
}

.tab-btn.active::after {
  display: none;
}

.dark-mode .tab-btn.active {
  background: #8b5cf6;
  box-shadow: none;
}

.dark-mode .tab-btn.active::before {
  display: none;
}

.tab-btn i {
  width: 18px;
  height: 18px;
  font-size: 16px;
  transition: none;
}

.tab-btn.active i {
  transform: none;
}

.tab-btn span {
  font-weight: 500;
  letter-spacing: 0;
  transition: none;
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 32px;
  margin-bottom: 2rem;
}

.info-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.dark-mode .info-card {
  background: #1e1e2d;
  border-color: #2d2d3f;
}

.info-card.full-width {
  grid-column: 1 / -1;
}

.card-header {
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-expand {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-expand:hover {
  background: rgba(255, 255, 255, 0.3);
}

.card-body {
  padding: 1.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.dark-mode .info-row {
  border-bottom-color: #2d2d3f;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row.full-width {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.info-row .label {
  color: #64748b;
  font-weight: 500;
  font-size: 0.9375rem;
}

.dark-mode .info-row .label {
  color: #9ca3af;
}

.info-row .value {
  color: #0f172a;
  font-weight: 600;
}

.dark-mode .info-row .value {
  color: #f9fafb;
}

.badge-exp {
  background: #3b82f6;
  color: white;
  padding: 0.375rem 0.875rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.dark-mode .badge-exp {
  background: #8b5cf6;
}

.badge-goal {
  background: #8b5cf6;
  color: white;
  padding: 0.375rem 0.875rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge-category {
  background: #06b6d4;
  color: white;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

/* New Info Cards Styles */
.info-card-new {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  height: 618px;
}

.dark-mode .info-card-new {
  background: #1e1e2d;
  border-color: #2d2d3f;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.info-card-new:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #3b82f6;
}

.dark-mode .info-card-new:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border-color: #8b5cf6;
}

.card-header-new {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.dark-mode .card-header-new {
  border-bottom-color: #2d2d3f;
}

.header-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  flex-shrink: 0;
}

.header-icon.goals {
  background: linear-gradient(135deg, #10b981, #059669);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.header-content h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.dark-mode .header-content h3 {
  color: #f9fafb;
}

.header-badge {
  padding: 4px 10px;
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-badge.goals {
  background: #d1fae5;
  color: #059669;
}

.dark-mode .header-badge {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.dark-mode .header-badge.goals {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.card-body-new {
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.info-item-new {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #f8fafc;
  transition: background-color 0.2s ease;
}

.dark-mode .info-item-new {
  border-bottom-color: #2d2d3f;
}

.info-item-new:last-child {
  border-bottom: none;
}

.info-item-new:hover {
  background: #f8fafc;
}

.dark-mode .info-item-new:hover {
  background: #262637;
}

.item-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 14px;
  flex-shrink: 0;
}

.dark-mode .item-icon {
  background: #1e3a8a;
  color: #93c5fd;
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.item-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dark-mode .item-label {
  color: #9ca3af;
}

.item-value {
  font-size: 16px;
  color: #1f2937;
  font-weight: 600;
}

.dark-mode .item-value {
  color: #f9fafb;
}

/* Weight and Height Container - Side by Side Layout */
.weight-height-container {
  display: flex !important;
  gap: 24px !important;
  padding: 16px 24px !important;
  border-bottom: 1px solid #f1f5f9;
  justify-content: flex-start;
  margin-top: 12px;
}

.dark-mode .weight-height-container {
  border-bottom-color: #2d2d3f;
}

.weight-height-item {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.weight-height-item .item-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 16px;
  flex-shrink: 0;
}

.dark-mode .weight-height-item .item-icon {
  background: transparent;
  color: #9ca3af;
}

.weight-height-item .item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.weight-height-item .item-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dark-mode .weight-height-item .item-label {
  color: #9ca3af;
}

.weight-height-item .item-value {
  font-size: 20px;
  color: #1f2937;
  font-weight: 600;
}

.dark-mode .weight-height-item .item-value {
  color: #f9fafb;
}

/* Goals Card Specific Styles */
.goal-main {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.dark-mode .goal-main {
  border-bottom-color: #2d2d3f;
}

.goal-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex !important;
  align-items: center;
  justify-content: center;
  color: white !important;
  font-size: 20px;
  flex-shrink: 0;
  z-index: 1;
  position: relative;
  line-height: 1;
}

.goal-icon i {
  display: block !important;
  line-height: 1;
  opacity: 1 !important;
  visibility: visible !important;
  color: white !important;
  font-size: 20px !important;
}

.goal-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.goal-title {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dark-mode .goal-title {
  color: #9ca3af;
}

.goal-subtitle {
  font-size: 16px;
  color: #1f2937;
  font-weight: 600;
}

.dark-mode .goal-subtitle {
  color: #f9fafb;
}

.goal-badge {
  padding: 6px 12px;
  background: #d1fae5;
  color: #059669;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dark-mode .goal-badge {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.progress-section {
  padding: 20px 24px;
}

/* Weight Target Section Styles */
.weight-target-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px 20px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
}

.dark-mode .weight-target-section {
  background: #262637;
  border-color: #2d2d3f;
}

.weight-target-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
}

.weight-target-icon {
  width: 24px;
  height: 24px;
  color: #64748b;
  font-size: 16px;
}

.dark-mode .weight-target-icon {
  color: #9ca3af;
}

.weight-target-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dark-mode .weight-target-label {
  color: #9ca3af;
}

.weight-target-value {
  font-size: 28px;
  color: #1f2937;
  font-weight: 700;
  margin-bottom: 12px;
}

.dark-mode .weight-target-value {
  color: #f9fafb;
}

.weight-progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-label-small {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.dark-mode .progress-label-small {
  color: #9ca3af;
}

.progress-percentage {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
}

.dark-mode .progress-percentage {
  color: #34d399;
}

.progress-bar-small {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 12px;
}

.dark-mode .progress-bar-small {
  background: #374151;
}

.progress-fill-small {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.progress-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 4px;
}

.progress-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 4px;
}

.dark-mode .progress-label {
  color: #9ca3af;
}

.progress-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-value {
  font-size: 22px;
  color: #1f2937;
  font-weight: 700;
}

.dark-mode .progress-value {
  color: #f9fafb;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.dark-mode .progress-bar {
  background: #374151;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 13px;
  color: #059669;
  font-weight: 600;
}

.dark-mode .progress-text {
  color: #34d399;
}

.progress-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

/* Simple Stats for Goals Card */
.stat-item-simple {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  padding: 8px 0;
}

.stat-icon-simple {
  width: 24px;
  height: 24px;
  color: #10b981;
  font-size: 16px;
}

.dark-mode .stat-icon-simple {
  color: #34d399;
}

.stat-content-simple {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-label-simple {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dark-mode .stat-label-simple {
  color: #9ca3af;
}

.stat-value-simple {
  font-size: 16px;
  color: #1f2937;
  font-weight: 600;
}

.dark-mode .stat-value-simple {
  color: #f9fafb;
}

.stat-item-small {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 10px;
  flex: 1;
}

.dark-mode .stat-item-small {
  background: #374151;
}

.stat-icon-small {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #dcfce7;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #059669;
  font-size: 12px;
  flex-shrink: 0;
}

.dark-mode .stat-icon-small {
  background: #064e3b;
  color: #10b981;
}

.stat-content-small {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label-small {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dark-mode .stat-label-small {
  color: #9ca3af;
}

.stat-value-small {
  font-size: 13px;
  color: #1f2937;
  font-weight: 600;
}

.dark-mode .stat-value-small {
  color: #f9fafb;
}

.progress-note {
  padding: 12px 16px;
  background: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  border-left: 4px solid #f59e0b;
}

.dark-mode .progress-note {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
}

.note-text {
  font-size: 13px;
  color: #92400e;
  font-weight: 500;
}

.dark-mode .note-text {
  color: #fbbf24;
}

/* Health Card Specific Styles */
.header-icon.health {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.header-badge.health {
  background: #fee2e2;
  color: #dc2626;
}

.dark-mode .header-badge.health {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

.health-grid {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Health Items Container */
.health-items-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
}

/* Individual Health Item Card */
.health-item-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0;
  transition: all 0.2s ease;
  min-height: 80px;
}

.dark-mode .health-item-card {
  background: #1f2937;
  border-color: #374151;
}

.health-item-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark-mode .health-item-card:hover {
  border-color: #4b5563;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.health-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: none;
}

.dark-mode .health-item {
  border: none;
}

.health-item:last-child {
  border-bottom: none;
}

.health-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #fef2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dc2626;
  font-size: 16px;
  flex-shrink: 0;
}

.dark-mode .health-icon {
  background: #4c1d1d;
  color: #fca5a5;
}

.health-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.health-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dark-mode .health-label {
  color: #9ca3af;
}

.health-value {
  font-size: 16px;
  color: #1f2937;
  font-weight: 600;
}

.dark-mode .health-value {
  color: #f9fafb;
}

.health-status {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.health-status.safe {
  background: #dcfce7;
  color: #16a34a;
}

.health-status.warning {
  background: #fef3c7;
  color: #d97706;
}

.dark-mode .health-status.safe {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
}

.dark-mode .health-status.warning {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
}

/* No Restrictions Card Styles */
.no-restrictions-container {
  padding: 0 24px 24px 24px;
}

.no-restrictions-card {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border: 1px solid #a7f3d0;
  box-shadow: 0 1px 3px rgba(16, 185, 129, 0.1);
  min-height: 60px;
}

.dark-mode .no-restrictions-card {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%);
  border-color: rgba(16, 185, 129, 0.25);
  box-shadow: 0 1px 3px rgba(16, 185, 129, 0.2);
}

.no-restrictions-icon {
  width: 24px;
  height: 24px;
  background: transparent;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 1px;
}

.dark-mode .no-restrictions-icon {
  color: #34d399;
}

.no-restrictions-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.no-restrictions-text {
  font-size: 16px;
  font-weight: 600;
  color: #065f46;
  line-height: 1.2;
}

.dark-mode .no-restrictions-text {
  color: #34d399;
}

.no-restrictions-subtitle {
  font-size: 13px;
  color: #047857;
  font-weight: 400;
  line-height: 1.3;
  margin-top: 6px;
}

.dark-mode .no-restrictions-subtitle {
  color: #6ee7b7;
}

/* Personal Goals Styles */
.goals-list-new {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.goal-item-new {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #f8fafc;
  transition: background-color 0.2s ease;
}

.dark-mode .goal-item-new {
  border-bottom-color: #2d2d3f;
}

.goal-item-new:last-child {
  border-bottom: none;
}

.goal-item-new:hover {
  background: #f8fafc;
}

.dark-mode .goal-item-new:hover {
  background: #262637;
}

.goal-checkbox-new {
  margin-top: 2px;
  flex-shrink: 0;
}

.goal-checkbox-new i {
  font-size: 18px;
  color: #cbd5e1;
  transition: color 0.2s ease;
}

.goal-checkbox-new i.achieved {
  color: #10b981;
}

.dark-mode .goal-checkbox-new i {
  color: #6b7280;
}

.dark-mode .goal-checkbox-new i.achieved {
  color: #34d399;
}

.goal-content-new {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.goal-description-new {
  font-size: 15px;
  color: #1f2937;
  font-weight: 500;
  line-height: 1.5;
}

.dark-mode .goal-description-new {
  color: #f9fafb;
}

.goal-meta-new {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.goal-category-new {
  padding: 4px 8px;
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dark-mode .goal-category-new {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.goal-priority-new {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.goal-priority-new.priority-alta {
  background: #fee2e2;
  color: #dc2626;
}

.goal-priority-new.priority-media {
  background: #fef3c7;
  color: #d97706;
}

.goal-priority-new.priority-baixa {
  background: #dcfce7;
  color: #16a34a;
}

.dark-mode .goal-priority-new.priority-alta {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

.dark-mode .goal-priority-new.priority-media {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
}

.dark-mode .goal-priority-new.priority-baixa {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
}

/* Goals List */
.goals-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.goal-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 3px solid #3b82f6;
  transition: all 0.2s;
}

.dark-mode .goal-item {
  background: #2d2d3f;
  border-left-color: #8b5cf6;
}

.goal-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.goal-checkbox {
  margin-top: 2px;
}

.goal-checkbox i {
  font-size: 1.25rem;
  color: #cbd5e1;
}

.goal-checkbox i.achieved {
  color: #10b981;
}

.goal-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.goal-description {
  font-size: 0.9375rem;
  color: #0f172a;
  font-weight: 500;
}

.dark-mode .goal-description {
  color: #f9fafb;
}

.goal-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.goal-priority {
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.goal-priority.priority-alta {
  background: #fecaca;
  color: #991b1b;
}

.goal-priority.priority-media {
  background: #fed7aa;
  color: #9a3412;
}

.goal-priority.priority-baixa {
  background: #d1fae5;
  color: #065f46;
}

/* Measure Change */
.measure-change {
  display: inline-block;
  margin-left: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
}

.measure-change.positive {
  background: #d1fae5;
  color: #065f46;
}

.measure-change.negative {
  background: #fee2e2;
  color: #991b1b;
}

/* Health Section */
.health-summary {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.health-tag {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  background: #ff4444;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.health-tag.success {
  background: #10b981;
}

.health-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-section h4 {
  color: #3b82f6;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.detail-section ul {
  margin: 0;
  padding-left: 1.5rem;
}

.detail-section li {
  margin-bottom: 0.5rem;
  color: #64748b;
}

.dark-mode .detail-section li {
  color: #9ca3af;
}

/* Chart */
.chart-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
}

.dark-mode .chart-card {
  background: #1e1e2d;
  border-color: #2d2d3f;
}

.empty-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #999;
  gap: 1rem;
}

.empty-chart i {
  font-size: 3rem;
}

.weight-chart {
  padding: 1rem;
}

.chart-svg {
  width: 100%;
  height: 300px;
}

.grid-line {
  stroke: #e2e8f0;
  stroke-width: 1;
}

.dark-mode .grid-line {
  stroke: #2d2d3f;
}

.chart-line {
  stroke: #3b82f6;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chart-point {
  fill: #3b82f6;
  stroke: white;
  stroke-width: 2;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Volume Chart Specific Styles */
.volume-chart-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.volume-chart-card .card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.volume-chart-card .card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-info {
  position: relative;
  display: flex;
  align-items: center;
  cursor: help;
}

.chart-info .fa-info-circle {
  color: var(--text-muted);
  font-size: 14px;
}

.chart-info .tooltip-text {
  position: absolute;
  right: 100%;
  margin-right: 10px;
  background: var(--bg-secondary);
  color: var(--text-color);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.chart-info:hover .tooltip-text {
  opacity: 1;
}

.volume-chart-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.volume-area {
  fill: #3b82f6;
  opacity: 0.1;
}

.volume-line {
  stroke: #3b82f6;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.volume-point {
  fill: #3b82f6;
  stroke: var(--card-bg);
  stroke-width: 3;
  cursor: pointer;
  transition: all 0.2s;
}

.volume-point:hover {
  r: 7;
  stroke-width: 4;
}

.volume-point.plateau-point {
  fill: #ef4444;
  stroke: #dc2626;
  animation: pulse-plateau 2s infinite;
}

@keyframes pulse-plateau {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.plateau-line {
  stroke: #ef4444;
  stroke-width: 2;
  stroke-dasharray: 4;
}

.plateau-label {
  fill: #ef4444;
  font-size: 12px;
  font-weight: 600;
}

.axis-label {
  fill: var(--text-muted);
  font-size: 12px;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 40px;
  margin-top: -10px;
  flex-wrap: wrap;
}

.chart-label {
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
}

.volume-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.volume-stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card-bg);
  border-radius: 8px;
  color: #3b82f6;
  font-size: 18px;
}

.stat-data {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 2px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
}

.stat-value.positive {
  color: #10b981;
}

.stat-value.negative {
  color: #ef4444;
}

.stat-value.neutral {
  color: #f59e0b;
}

.stat-value.warning {
  color: #ef4444;
}

.dark-mode .chart-point {
  stroke: #1e1e2d;
}

.chart-point:hover {
  r: 6;
}

.chart-labels {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
  font-size: 0.8125rem;
  color: #64748b;
}

.dark-mode .chart-labels {
  color: #9ca3af;
}

/* Measurements Grid */
.measurements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.measure-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.dark-mode .measure-card {
  background: #1e1e2d;
  border-color: #2d2d3f;
}

.measure-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.15);
  border-color: #3b82f6;
}

.measure-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.measure-info {
  display: flex;
  flex-direction: column;
}

.measure-label {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
}

.dark-mode .measure-label {
  color: #9ca3af;
}

.measure-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.dark-mode .measure-value {
  color: #f9fafb;
}

/* Measurements Section Improved */
.measurements-section {
  margin-bottom: 2rem;
}

.section-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.dark-mode .section-header {
  border-bottom-color: #2d3748;
}

.section-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dark-mode .section-header h3 {
  color: #f9fafb;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.dark-mode .section-subtitle {
  color: #94a3b8;
}

.measurements-grid-improved {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

.measure-card-improved {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.25rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.measure-card-improved::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--card-color, #3b82f6), transparent);
  transition: height 0.3s ease;
}

.measure-card-improved:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--card-color, #3b82f6);
}

.measure-card-improved:hover::before {
  height: 4px;
}

.dark-mode .measure-card-improved {
  background: #1e1e2d;
  border-color: #2d3748;
}

.dark-mode .measure-card-improved:hover {
  box-shadow: 0 12px 24px rgba(139, 92, 246, 0.3);
}

.measure-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.measure-icon-improved {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  color: white;
  flex-shrink: 0;
}

.measure-icon-improved.shoulder {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.measure-icon-improved.chest {
  background: linear-gradient(135deg, #a855f7, #9333ea);
}

.measure-icon-improved.arm {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
}

.measure-icon-improved.forearm {
  background: linear-gradient(135deg, #10b981, #059669);
}

.measure-icon-improved.waist {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.measure-icon-improved.hip {
  background: linear-gradient(135deg, #ec4899, #db2777);
}

.measure-icon-improved.thigh {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.measure-icon-improved.calf {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
}

.measure-label-improved {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark-mode .measure-label-improved {
  color: #cbd5e1;
}

.measure-card-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.measure-value-improved {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.dark-mode .measure-value-improved {
  color: #f9fafb;
}

.measure-unit {
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  margin-left: 0.25rem;
}

.dark-mode .measure-unit {
  color: #94a3b8;
}

.measure-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  width: fit-content;
}

.measure-badge.positive {
  background: #dcfce7;
  color: #166534;
}

.measure-badge.negative {
  background: #fee2e2;
  color: #991b1b;
}

.dark-mode .measure-badge.positive {
  background: rgba(34, 197, 94, 0.2);
  color: #86efac;
}

.dark-mode .measure-badge.negative {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

.measure-badge i {
  font-size: 0.625rem;
}

/* Timeline */
.timeline-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.dark-mode .timeline-card {
  background: #1e1e2d;
  border-color: #2d2d3f;
}

.timeline-count {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #f1f5f9;
  border-radius: 20px;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.dark-mode .timeline-count {
  background: #2d2d3f;
  color: #9ca3af;
}

.empty-timeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #999;
  gap: 1rem;
}

.empty-timeline i {
  font-size: 3rem;
  color: #cbd5e1;
}

.empty-subtitle {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-top: -0.5rem;
}

.timeline-improved {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
}

.timeline-entry {
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.dark-mode .timeline-entry {
  background: #262637;
  border-color: #2d2d3f;
}

.timeline-entry:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.dark-mode .timeline-entry:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.dark-mode .entry-header {
  background: #2d2d3f;
  border-bottom-color: #3a3a4f;
}

.entry-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #0f172a;
  font-size: 0.9375rem;
}

.dark-mode .entry-date {
  color: #f9fafb;
}

.entry-date i {
  color: #8b5cf6;
  font-size: 1rem;
}

.latest-badge {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.latest-badge i {
  font-size: 0.875rem;
}

.entry-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.entry-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.dark-mode .stat-item {
  background: #1e1e2d;
  border-color: #2d2d3f;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.stat-icon.weight {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.stat-icon.bodyfat {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.stat-icon.muscle {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dark-mode .stat-label {
  color: #9ca3af;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
}

.dark-mode .stat-value {
  color: #f9fafb;
}

.entry-measurements {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
}

.dark-mode .entry-measurements {
  background: #1e1e2d;
  border-color: #2d2d3f;
}

.measurements-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dark-mode .measurements-header {
  color: #9ca3af;
}

.measurements-header i {
  color: #8b5cf6;
}

.measurements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.625rem;
}

.measurement-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.625rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  gap: 0.25rem;
  transition: all 0.2s;
}

.dark-mode .measurement-chip {
  background: #262637;
  border-color: #3a3a4f;
}

.measurement-chip:hover {
  border-color: #8b5cf6;
  transform: translateY(-2px);
}

.chip-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.dark-mode .chip-label {
  color: #9ca3af;
}

.chip-value {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #0f172a;
}

.dark-mode .chip-value {
  color: #f9fafb;
}

.entry-notes {
  display: flex;
  gap: 0.75rem;
  padding: 0.875rem;
  background: #fffbeb;
  border-left: 3px solid #f59e0b;
  border-radius: 4px;
}

.dark-mode .entry-notes {
  background: #3a2f1f;
  border-left-color: #f59e0b;
}

.entry-notes i {
  color: #f59e0b;
  font-size: 1rem;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.entry-notes p {
  margin: 0;
  color: #78350f;
  font-size: 0.9375rem;
  line-height: 1.5;
  font-style: italic;
}

.dark-mode .entry-notes p {
  color: #fde68a;
}

/* Workout Section */
.active-plan-card,
.history-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
}

.dark-mode .active-plan-card,
.dark-mode .history-card {
  background: #1e1e2d;
  border-color: #2d2d3f;
}

.empty-plan,
.empty-history {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  color: #999;
}

.empty-plan i,
.empty-history i {
  font-size: 3rem;
}

.plan-details h4 {
  color: #0f172a;
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
}

.dark-mode .plan-details h4 {
  color: #f9fafb;
}

.plan-divisions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.division-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.dark-mode .division-item {
  background: #171723;
  border-color: #2d2d3f;
}

.division-item:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.dark-mode .division-item:hover {
  border-color: #3b82f6;
  background: #1e293b;
}

.division-name {
  font-weight: 600;
  color: #0f172a;
}

.dark-mode .division-name {
  color: #f9fafb;
}

.division-count {
  color: #64748b;
  font-size: 0.875rem;
}

.dark-mode .division-count {
  color: #9ca3af;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.dark-mode .stat-card {
  background: #1e1e2d;
  border-color: #2d2d3f;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.15);
  border-color: #3b82f6;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.75rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
}

.dark-mode .stat-value {
  color: #f9fafb;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.dark-mode .stat-label {
  color: #9ca3af;
}

/* History List */
.history-list {
  padding: 1rem;
}

.history-item {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.25rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;
}

.dark-mode .history-item {
  background: #171723;
  border-color: #2d2d3f;
}

.history-item:hover {
  background: #eff6ff;
  border-color: #3b82f6;
  transform: translateX(4px);
}

.dark-mode .history-item:hover {
  background: #1e293b;
  border-color: #3b82f6;
}

.history-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
}

.dark-mode .history-date {
  color: #9ca3af;
}

.history-name {
  font-weight: 600;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dark-mode .history-name {
  color: #f9fafb;
}

.division-tag {
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.dark-mode .division-tag {
  background: #312e81;
  color: #c7d2fe;
}

.history-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #64748b;
}

.dark-mode .history-stats {
  color: #9ca3af;
}

.history-stats span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.history-status {
  padding: 0.375rem 0.875rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  text-align: center;
}

.history-status.completed {
  background: #10b981;
  color: white;
}

.history-status.partial {
  background: #f59e0b;
  color: white;
}

.history-status.missed {
  background: #ef4444;
  color: white;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: #ffffff;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.3s ease;
}

.modal-content.modal-large {
  max-width: 900px;
}

.dark-mode .modal-content {
  background: #1e1e2d;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-close {
  background: transparent;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  line-height: 1;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 2rem;
}

.modal-note {
  color: #64748b;
  font-style: italic;
  margin-bottom: 1rem;
}

.dark-mode .modal-note {
  color: #9ca3af;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.9375rem;
  margin-bottom: 0.25rem;
}

.dark-mode .form-group label {
  color: #f9fafb;
}

.form-input,
.form-textarea {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  background: #ffffff;
  color: #0f172a;
}

.dark-mode .form-input,
.dark-mode .form-textarea {
  background: #171723;
  border-color: #2d2d3f;
  color: #f9fafb;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark-mode .form-input:focus,
.dark-mode .form-textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.dark-mode .modal-actions {
  border-top-color: #2d2d3f;
}

/* Plan Modal Styles */
.loading-plans,
.no-plans {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  color: #64748b;
}

.dark-mode .loading-plans,
.dark-mode .no-plans {
  color: #9ca3af;
}

.no-plans i {
  font-size: 3rem;
  color: #cbd5e1;
}

.dark-mode .no-plans i {
  color: #475569;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.plan-card {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark-mode .plan-card {
  background: #171723;
  border-color: #2d2d3f;
}

.plan-card:hover {
  border-color: #3b82f6;
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.15);
}

.plan-card.selected {
  border-color: #3b82f6;
  background: #eff6ff;
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.2);
}

.dark-mode .plan-card.selected {
  background: #1e293b;
  border-color: #3b82f6;
}

.plan-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.plan-card-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
}

.dark-mode .plan-card-header h3 {
  color: #f9fafb;
}

.selected-badge {
  color: #3b82f6;
  font-size: 1.5rem;
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.plan-card-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.plan-stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
}

.dark-mode .plan-stat {
  color: #9ca3af;
}

.plan-stat i {
  color: #3b82f6;
  width: 16px;
}

.plan-divisions-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.division-preview {
  flex-shrink: 0;
}

.division-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #e0e7ff;
  color: #3b82f6;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.dark-mode .division-badge {
  background: #1e3a8a;
  color: #93c5fd;
}

/* Active Plan Details */
.plan-created {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0.5rem 0 1rem 0;
}

.dark-mode .plan-created {
  color: #9ca3af;
}

.division-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  margin-bottom: 0.75rem;
}

.dark-mode .division-item {
  background: #171723;
  border-color: #2d2d3f;
}

.division-item:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.dark-mode .division-item:hover {
  border-color: #3b82f6;
  background: #1e293b;
}

.division-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.division-name {
  font-weight: 600;
  color: #0f172a;
  font-size: 1rem;
}

.dark-mode .division-name {
  color: #f9fafb;
}

.division-count {
  color: #64748b;
  font-size: 0.875rem;
}

.dark-mode .division-count {
  color: #9ca3af;
}

.division-exercises {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
}

.dark-mode .division-exercises {
  border-top-color: #2d2d3f;
}

.exercise-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.dark-mode .exercise-item {
  background: #1e1e2d;
  border-color: #2d2d3f;
}

.exercise-name {
  color: #0f172a;
  font-size: 0.875rem;
  font-weight: 500;
}

.dark-mode .exercise-name {
  color: #f9fafb;
}

.exercise-details {
  color: #64748b;
  font-size: 0.8125rem;
  font-weight: 600;
}

.dark-mode .exercise-details {
  color: #9ca3af;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
  }

  .header-left {
    flex-direction: column;
    text-align: center;
    width: 100%;
  }

  .header-actions {
    width: 100%;
    padding: 4px;
    gap: 2px;
  }

  .action-btn {
    flex: 1;
    min-width: 70px;
    padding: 12px 16px;
    margin: 0;
    flex-shrink: 0;
    border-radius: 14px;
    gap: 6px;
    font-size: 13px;
  }

  .action-btn i {
    font-size: 18px;
  }

  .action-btn span {
    display: none;
  }

  .tabs-container {
    overflow-x: auto;
    padding: 4px;
    gap: 2px;
    scrollbar-width: none;
    -ms-overflow-style: none;
    margin-bottom: 2rem;
    backdrop-filter: blur(16px) saturate(180%);
    border-radius: 18px;
    box-shadow: 
      0 6px 24px rgba(0, 0, 0, 0.08),
      0 2px 6px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }

  .tabs-container::-webkit-scrollbar {
    display: none;
  }

  .tab-btn {
    min-width: 70px;
    padding: 12px 16px;
    margin: 0;
    flex-shrink: 0;
    border-radius: 14px;
    gap: 6px;
    font-size: 13px;
  }

  .tab-btn i {
    font-size: 18px;
  }

  .tab-btn span {
    display: none;
  }

  .tab-btn.active {
    min-width: 75px;
    box-shadow: 
      0 8px 20px rgba(59, 130, 246, 0.35),
      0 4px 10px rgba(59, 130, 246, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.25);
    transform: translateY(-1px) scale(1.05);
  }

  .dark-mode .tab-btn.active {
    box-shadow: 
      0 8px 20px rgba(139, 92, 246, 0.35),
      0 4px 10px rgba(139, 92, 246, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .history-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .history-stats {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>

