  <template>
    <div v-if="visible" class="loading-container">
      <div v-if="isLoading" class="spinner"></div>
      <div v-if="isError" class="error-icon">!</div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      isLoading: {
        type: Boolean,
        default: true
      },
      isError: {
        type: Boolean,
        default: false
      }
    }
  }
  </script>
  
  <style scoped>
  .loading-container {
    /* position: absolute; */
    /* top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); */
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center ;
  }
  
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #3498db;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-icon {
    font-size: 25px;
    color: red;
  }
  </style>
  