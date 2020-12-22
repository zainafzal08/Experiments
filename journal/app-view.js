import { LitElement, html, css } from "https://unpkg.com/lit-element?module";

class AppView extends LitElement {
    ready = false;
    
    // Lit Element Implementation.
    static get styles() {
      return css`
        :host {
          width: 100vw;
          min-height: 100vh;
        }
      `;
    }
  
    connectedCallback() {
      super.connectedCallback();
      this.warmUp();
    }
  
    render() {
      return html`
        <p>hey</p>
      `;
    }

    // App View Implementation.
    warmUp() {
        
    }

  }
  
  customElements.define("app-view", AppView);