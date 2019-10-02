interface Window {
  expose?: any;
  fetchFromWindow?: any;
}

declare var window: Window;

const exposeToWindow = (name, pt) => {
  if (!window.expose) {
    window.expose = {};
  }
  window.expose[name] = pt;
};

const fetchFromWindow = name => {
  if (!window.expose) {
    throw 'Didn\'t expose any param yet!';
  }
  if (name === undefined) {
    return window.expose;
  }
  if (window.expose[name] === undefined) {
  }
  return window.expose[name];
};

window.fetchFromWindow = fetchFromWindow;

export { exposeToWindow };
