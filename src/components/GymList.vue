<template>
  <div class="gym-list">
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else class="row g-4">
      <div v-for="gym in gyms" :key="gym._id" class="col-md-6 col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ gym.name }}</h5>
            <div class="card-text">
              <p><strong>Location:</strong></p>
              <p>{{ gym.location.address }}</p>
              <p>{{ gym.location.city }}, {{ gym.location.state }} {{ gym.location.zipCode }}</p>
              <p>
                <strong>Equipment Count:</strong> {{ gym.equipments ? gym.equipments.length : 0 }}
              </p>
            </div>
          </div>
          <div class="card-footer">
            <button @click="$emit('edit-gym', gym)" class="btn btn-primary me-2">
              Edit
            </button>
            <button @click="$emit('delete-gym', gym._id)" class="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GymList',
  props: {
    gyms: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.gym-list {
  padding: 20px;
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
</style>