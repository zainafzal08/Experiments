import { LitElement, html, css } from "https://unpkg.com/lit-element?module";
import {Database} from './database.js';
import {WorryJournal} from './worry-journal.js';
import {ThoughtDiary} from './thought-diary.js';
import {ADD_ICON, JOURNAL_ICON, RETORT_ICON, ARROW_DOWN_ICON} from './icons.js';

const PAGES = [
  {
    title: 'Thought Diary',
    icon: JOURNAL_ICON,
    component: ThoughtDiary
  },
  {
    title: 'Worries',
    icon: RETORT_ICON,
    component: WorryJournal
  }
];

class AppView extends LitElement {
    data = new Database(() => this.requestUpdate());

    // Lit Element Implementation.
    static get properties() {
      return {
        title: {
          type: String
        },
        active: {
          type: Number
        },
        drawerOpen: {
          type: Boolean,
          attribute: true,
          reflect: true
        },
      };
    }

    constructor() {
      super();
      this.active = 0;
      this.title = PAGES[this.active].title;
      this.currentlyEditing = null;
    }

    firstUpdated() {
      this.addEventListener('edit-item', (e) => void this.editItem(e.detail));
    }
    
    static get styles() {
      return css`
        :host {
          width: 100vw;
          display: flex;
          justify-content: center;
          --title-height: 80px;
          --navbar-height: 50px;
          --footer-height: 64px;
        }
        p {
          font-size: .8rem;
        }
        .page {
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          background: var(--primary-color);
        }
        .page h1 {
          color: #FCE8E9;
          width: 100%;
          text-align: center;
          margin-bottom: 8px;
        }
        .page p {
          width: 80%;
          text-align: center;
          color: #FAD1D4;
        }
        .page > * {
          z-index: 2;
        }
        .page input {
          width: min(80%, 500px);
          border: none;
          font-size: 1.1rem;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 32px;
          padding: 0.2rem .8rem;
          color: white;
          margin: 32px 0px 16px 0px;
          text-align: center;
        }
        .page input:focus {
          outline: none;
        }
        .page button {
          padding: .3rem 1rem;
          border-radius: 32px;
          border: 3px solid white;
          color: white;
          background: none;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 800;
        }
        .page button:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .page svg {
          position: absolute;
          width: 50%;
          opacity: .2;
          z-index: 1;
        }
        main {
          width: min(500px, 100vw);
          height: 100vh;
          overflow: hidden;
        }
        :host([draweropen]) .content {
          opacity: .3;
        }
        :host([draweropen]) h1 {
          opacity: .3;
        }
        main h1 {
          width: 100%;
          height: var(--title-height);
          text-align: center;
          color: var(--primary-color);
          font-size: 2rem;
          margin: 0;
          box-sizing: border-box;
          padding-top: 32px;
        }
        main .content {
          height: calc(100% - var(--title-height) - var(--navbar-height))
        }
        main .drawer {
          background: var(--primary-color);
          border-top-right-radius: 16px;
          border-top-left-radius: 16px;
          box-shadow: 0px -4px 12px 1px rgba(250, 209, 212, 0.87);
          transition: transform ease-out .2s;
        }
        :host([draweropen]) main .drawer {
          transform: translateY(calc(-100% + var(--navbar-height)));
        }
        .drawer nav {
          width: 100%;
          height: var(--navbar-height);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .drawer .link {
          background: none;
          border: none;
          outline: none;
          color: white;
          cursor: pointer;
          margin: 0 16px;
          border-top: 2px solid #00000000;
          border-bottom: 2px solid #00000000;
          opacity: 0.7;
        }
        main .drawer .link[data-active="true"] {
          opacity: 1;
        }
        main .drawer .link:hover {
          opacity: 1;
          border-bottom: 2px solid #FFFFFF;
        }
        .toggle {
          background: none;
          border: none;
          outline: none;
          position: absolute;
          right: 14px;
          top: 14px;
          color: white;
          cursor: pointer;
          opacity: 0.8;
        }
        .toggle:hover {
          opacity: 1;
        }
        .toggle svg {
          height: 24px;
        }
        .scrollable {
          width: 100%;
          max-height: calc(90vh - var(--navbar-height) - var(--footer-height));
          overflow: scroll;
        }
        .fields {
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          padding: 16px 24px;
          pading-top: 0;
          width: 100%;
        }
        .fields label {
          color: white;
          opacity: .8;
          padding: 16px 0 8px 0;
        }
        .fields textarea {
          resize: none;
          background: rgba(255, 255, 255, .2);
          height: 64px;
          border-radius: 12px;
          border: none;
          font-family: 'Rubik', sans-serif;
          color: rgba(255, 255, 255, .8);
          box-sizing: border-box;
          padding: 8px;
        }
        .fields textarea:focus {
          outline: none;
          color: rgba(255, 255, 255, 1);
          background: rgba(255, 255, 255, .3);
        }
        .footer {
          height: var(--footer-height);
          width: 100%;
          display: grid;
          place-items: center;
        }
        .footer button {
          width: 80%;
          height: 32px;
          border-radius: 8px;
          background: rgba(255, 255, 255, .3);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .footer button svg {
          width: 16px;
          height: 16px;
        }
        .footer button:hover {
          background: rgba(255, 255, 255, .4);
        }
      `;
    }
    
    renderNavItem(index, page) {
      return html`
        <button @click=${() => this.navigate(index)} data-active=${index === this.active} class="link">
          ${page.icon}
        </button>`
    }

    render() {
        if (this.data.hasState() && !this.data.hasPassword()) {
          return this.passwordPrompt('Worry Journal', 'Your journal is locked, please enter the password to unlock.');
        } else if (!this.data.hasState() && !this.data.hasPassword()) {
          return this.passwordPrompt(
            'Welcome to Worry Journal',
            'A simple app to help you with your worries. To begin please set a password for your journal.');
        }
        const page = PAGES[this.active];
        const content = new page.component();
        const fields = content.getFieldList();
        content.data = this.data;
        return html`
          <main>
            <h1>${this.title}</h1>
            <div class="content">
              ${content}
            </div>
            <div class="drawer">
              <nav>
                ${PAGES.map((index, page) => this.renderNavItem(page, index))}
                <button class="toggle" @click=${() => this.toggleDrawer()}>
                  ${ this.drawerOpen ? ARROW_DOWN_ICON : ADD_ICON }
                </button>
              </nav>
              <div class="scrollable">
                <div class="fields">
                  ${fields.map(field => this.renderField(field))}
                </div>
                <div class="footer">
                  <button @click=${() => this.addItem(content, fields)}>${ADD_ICON} Add</button>
                </footer>
              </div>
            </div>
          </main>`
          ;
    }

    // App View Implementation.
    editItem(fields) {
      for (const field of Object.keys(fields)) {
        const e = this.shadowRoot.getElementById(field);
        if (!e) {
          continue;
        }
        e.value = fields[field];
      }
      this.currentFocusedItem = fields;
      this.drawerOpen = true;
    }

    addItem(component, fields) {
      const values = this.currentFocusedItem || {};
      for (const field of fields) {
        const e = this.shadowRoot.getElementById(field.id);
        if (!e) {
          continue;
        }
        values[field.id] = e.value;
      }
      component.addItem(values);
      this.drawerOpen = false;
      this.clearDrawer();
    }

    renderField(field) {
      if (field.type === 'textarea') {
        return html`
          <label>${field.label}</label>
          <textarea id=${field.id}></textarea>
        `;
      } else {
        throw new Error(`No such field type '${field.type}'`);
      }
    }

    clearDrawer() {
      for (const e of this.shadowRoot.querySelectorAll('textarea')) {
        e.value = '';
      }
      this.currentFocusedItem = null;
    }

    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen;
      if (this.drawerOpen === false && this.currentFocusedItem) {
        this.clearDrawer();
        this.currentFocusedItem = null;
      }
    }

    navigate(newIndex) {
      this.active = newIndex;
      this.title = PAGES[this.active].title;
    }

    async setPassword() {
      const passwd = this.shadowRoot.querySelector('#password').value;
      if (passwd.length < 4) {
        alert('Password too short, must be > 3 characters');
        return;
      }
      try {
        await this.data.setPassword(passwd);
        this.requestUpdate();
      } catch(e) {
        if (e.name === 'Invalid password') {
          alert('Incorrect password');
          return;
        }
        throw e;
      }
    }
    
    passwordPrompt(title, subtitle) {
      return html`
        <div class="page" @keydown=${(e) => e.key === 'Enter' && this.setPassword()}>
          <h1>${title}</h1>
          <p>${subtitle}</p>
          <input autocomplete="off" id="password" type="text"/>
          <button @click=${() => this.setPassword()}>GO</button>
          <svg viewBox="0 0 72 71" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M53.6001 23.8668H50.6668V18.0001C50.6668 9.90411 44.0961 3.33344 36.0001 3.33344C27.9041 3.33344 21.3334 9.90411 21.3334 18.0001V23.8668H18.4001C15.1734 23.8668 12.5334 26.5068 12.5334 29.7334V59.0668C12.5334 62.2935 15.1734 64.9335 18.4001 64.9335H53.6001C56.8268 64.9335 59.4668 62.2935 59.4668 59.0668V29.7334C59.4668 26.5068 56.8268 23.8668 53.6001 23.8668ZM36.0001 50.2668C32.7735 50.2668 30.1335 47.6268 30.1335 44.4001C30.1335 41.1735 32.7735 38.5334 36.0001 38.5334C39.2268 38.5334 41.8668 41.1735 41.8668 44.4001C41.8668 47.6268 39.2268 50.2668 36.0001 50.2668ZM45.0935 23.8668H26.9068V18.0001C26.9068 12.9841 30.9841 8.90678 36.0001 8.90678C41.0161 8.90678 45.0935 12.9841 45.0935 18.0001V23.8668Z" fill="white" fill-opacity="0.4"/>
          </svg>
        </div>
      `;
    }
  }
  
  customElements.define("app-view", AppView);