export default {
  install(app) {
    // Import all base components from the shared directory
    const componentFiles = import.meta.glob('./components/base-components/*.vue', { eager: true })
    Object.entries(componentFiles).forEach(([path, m]) => {
      const componentName = path
        .split('/')
        .pop()
        .replace(/\.\w+$/, '') // Remove file extension
        .replace(/[-_](\w)/g, (_, c) => c.toUpperCase()) // Convert kebab-case and snake_case to camelCase
        .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter

      app.component(`${componentName}`, m.default)
    })
  }
}
