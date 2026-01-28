<template>
    <div class="loading-container">
        <div class="spinner"></div>
        <p>Loading...</p>
    </div>
</template>

<script>
export default {
    name: 'Loading',
}
</script>

<style scoped>
.loading-container {
    height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 50px;
}

.spinner {
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-left-color: #ffffff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>