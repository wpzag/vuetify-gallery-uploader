import HelloWorld from "./components/HelloWorld.vue";

const HelloWorldSimple = {
 install(Vue, options) {
  // Let's register our component globally
  // https://vuejs.org/v2/guide/components-registration.html
  Vue.component("hello-world", HelloWorld);
 }
};

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(HelloWorldSimple);
}

export default HelloWorldSimple;