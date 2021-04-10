import { LitElement, html, css } from "https://unpkg.com/lit-element?module";
import {Database} from './database.js';

const ADD_ICON = html`
<svg xmlns="http://www.w3.org/2000/svg" fill="var(--primary-color)" height="32" viewBox="0 0 24 24" width="32"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`;

const DELETE_ICON = html`
<svg xmlns="http://www.w3.org/2000/svg" fill="var(--local-color)" height="20" viewBox="0 0 24 24" width="20"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`;

const RETORT_ICON = html`
<svg xmlns='http://www.w3.org/2000/svg' fill="var(--local-color)" height="20" viewBox='0 0 512 512'><title>Chatbubbles</title><path d='M60.44 389.17c0 .07 0 .2-.08.38.03-.12.05-.25.08-.38zM439.9 405.6a26.77 26.77 0 01-9.59-2l-56.78-20.13-.42-.17a9.88 9.88 0 00-3.91-.76 10.32 10.32 0 00-3.62.66c-1.38.52-13.81 5.19-26.85 8.77-7.07 1.94-31.68 8.27-51.43 8.27-50.48 0-97.68-19.4-132.89-54.63A183.38 183.38 0 01100.3 215.1a175.9 175.9 0 014.06-37.58c8.79-40.62 32.07-77.57 65.55-104A194.76 194.76 0 01290.3 32c52.21 0 100.86 20 137 56.18 34.16 34.27 52.88 79.33 52.73 126.87a177.86 177.86 0 01-30.3 99.15l-.19.28-.74 1c-.17.23-.34.45-.5.68l-.15.27a21.63 21.63 0 00-1.08 2.09l15.74 55.94a26.42 26.42 0 011.12 7.11 24 24 0 01-24.03 24.03z'/><path d='M299.87 425.39a15.74 15.74 0 00-10.29-8.1c-5.78-1.53-12.52-1.27-17.67-1.65a201.78 201.78 0 01-128.82-58.75A199.21 199.21 0 0186.4 244.16C85 234.42 85 232 85 232a16 16 0 00-28-10.58s-7.88 8.58-11.6 17.19a162.09 162.09 0 0011 150.06C59 393 59 395 58.42 399.5c-2.73 14.11-7.51 39-10 51.91a24 24 0 008 22.92l.46.39A24.34 24.34 0 0072 480a23.42 23.42 0 009-1.79l53.51-20.65a8.05 8.05 0 015.72 0c21.07 7.84 43 12 63.78 12a176 176 0 0074.91-16.66c5.46-2.56 14-5.34 19-11.12a15 15 0 001.95-16.39z'/></svg>`;

class AppView extends LitElement {
    data = new Database(() => this.requestUpdate());

    // Lit Element Implementation.
    static get properties() {
      return {};
    }

    static get styles() {
      return css`
        :host {
          width: 100vw;
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
          width: 80%;
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
          opacity: .1;
          z-index: 1;
        }
        .journal {
          width: calc(100% - 64px);
          padding: 0 32px;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-direction: column;
        }
        .journal h1 {
          width: 100%;
          margin-top: 64px;
          height: 50px;
          margin-bottom: 64px;
          text-align: center;
          color: var(--primary-color);
          font-size: 2.4rem;
        }
        .journal .new-entry {
          height: 64px;
          width: 100%;
          background: #f1f1f1;
          border-radius: 9px;
          display: flex;
          margin-bottom: 32px;
        }
        .journal .new-entry .action {
          width: 64px;
          height: 100%;
          display: grid;
          place-items: center;
          cursor: pointer;
        }
        .journal .new-entry input {
          width: calc(100% - 72px);
          margin-right: 8px;
          height: 100%;
          border: none;
          background: none;
          font-size: 1.4rem;
          padding: 0 16px;
          color: #444;
        }
        .journal .new-entry input:focus {
          outline: none;
        }
        .history {
          width: 100%;
          margin-bottom: 32px;
          height: calc(100vh - 274px);
          overflow: scroll;
        }

        .history .item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-bottom: 16px;
          width: 100%;
          --local-color: #BBB;
        }
        .history .item.retort {
          margin-bottom: 8px;
          --local-color: white;
          align-items: flex-end;
        }
        
        .history .item .content {
          width: 75%;
          box-sizing: border-box;
          padding-left: 16px;
          padding-right: 8px;
          min-height: 48px;
          display: flex;
          align-items: center;
          background: #f1f1f1;
          border-radius: 9px;
        }
        .history .item.retort .content {
          min-height: 32px;
          background: var(--primary-color);
          justify-content: space-between;
        }

        .history .item .content .action {
          width: 28px;
          height: 100%;
          cursor: pointer;
        }
        .history .item.retort .content .action {
          width: 20px;
          height: 20px;
        }

        .history .item .content p {
          width: calc(100% - 56px);
          margin: 0;
          padding: 16px 24px 16px 0;
          color: #444;
        }
        .history .item.retort .content p {
          color: white;
        }
        
        .history .item .date {
          font-size: 10px;
          color: #bbb;
          padding-left: 3px;
        }
        .history .item.retort .date {
          color: var(--primary-color);
          opacity: .6;
        }

        .retorts {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
      `;
    }
  
    render() {
        if (this.data.hasState() && !this.data.hasPassword()) {
          return this.passwordPrompt('Worry Journal', 'Your journal is locked, please enter the password to unlock.');
        } else if (!this.data.hasState() && !this.data.hasPassword()) {
          return this.passwordPrompt(
            'Welcome to Worry Journal',
            'A simple app to help you jot down all your worries. To begin please set a password for your journal.');
        }

        return this.renderJournal();
    }

    // App View Implementation.
    addItem() {
      const text = this.shadowRoot.querySelector('#new-item').value;
      if (text.length === 0) return;
      this.data.addItem({text});
      this.requestUpdate();
      this.shadowRoot.querySelector('#new-item').value = '';
    }

    addRetort(parentID) {
      const text = window.prompt('What is your response to this worry?');
      if (text.length === 0) return;
      this.data.addRetort({parentID, text});
    }

    deleteRetort(retortId) {
      this.data.removeRetort(retortId);
    }

    deleteItem(id) {
      this.data.removeItem(id);
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

    renderRetort(retort) {
      const formatter = new Intl.DateTimeFormat('en-AU', {dateStyle: 'full' });
      const humanDate = formatter.format(new Date(retort.date));
      return html`<div class="item retort">
        <div class="content">
          <p>${retort.text}</p>
          <div class="action" @click=${() => this.deleteRetort(retort.id)}>
            ${DELETE_ICON}
          </div>
        </div>
        <p class="date">${humanDate}</p>
      </div>`; 
    }
    
    renderItem(item) {
      const formatter = new Intl.DateTimeFormat('en-AU', {dateStyle: 'full' });
      const humanDate = formatter.format(new Date(item.date));
      const retorts = this.data.getRetorts(item.id);
      return html`<div class="item">
        <div class="content">
          <p>${item.text}</p>
          <div class="action" @click=${() => this.deleteItem(item.id)}>
            ${DELETE_ICON}
          </div>
          <div class="action" @click=${() => this.addRetort(item.id)}>
            ${RETORT_ICON}
          </div>
        </div>
        <p class="date">${humanDate}</p>
        <div class="retorts">
          ${retorts.map((retort) => this.renderRetort(retort))}
        </div>
      </div>`;
    }

    renderJournal() {
      return html`
      <div class="journal" @keydown=${(e) => e.key === 'Enter' && this.addItem()}>
        <h1>Your Worries</h1>
        <div class="history">
          ${this.data.items.map(item => this.renderItem(item))}
        </div>
        <div class="new-entry">
        <input id="new-item"/>
        <div class="action" @click=${() => this.addItem()}>
          ${ADD_ICON}
        </div>
      </div>
      </div>
      `;
    }
  }
  
  customElements.define("app-view", AppView);