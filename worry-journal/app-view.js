import { LitElement, html, css } from "https://unpkg.com/lit-element?module";
import {Database} from './database.js';

const ADD_ICON = html`
<svg xmlns="http://www.w3.org/2000/svg" fill="var(--primary-color)" height="32" viewBox="0 0 24 24" width="32"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`;

const DELETE_ICON = html`
<svg xmlns="http://www.w3.org/2000/svg" fill="var(--primary-color)" height="20" viewBox="0 0 24 24" width="20"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`;

class AppView extends LitElement {
    data = new Database();

    // Lit Element Implementation.
    static get properties() {
      return {};
    }

    static get styles() {
      return css`
        :host {
          width: 100vw;
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
          margin-top: 32px;
          height: calc(100vh - 274px);
          overflow: scroll;
        }
        .history .item {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          margin-bottom: 16px;
        }
        .history .item .content {
          width: 100%;
          box-sizing: border-box;
          padding-left: 16px;
          min-height: 48px;
          display: flex;
          align-items: center;
          background: #f1f1f1;
          border-radius: 9px;
        }
        .history .item .content .action {
          width: 32px;
          height: 100%;
          cursor: pointer;
        }
        .history .item .content p {
          width: calc(100% - 56px);
          margin: 0;
          padding: 16px 24px 16px 0;
          color: #444;
        }
        .history .item .date {
          font-size: 10px;
          color: var(--primary-color);
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
      this.data.addItem({text});
      this.requestUpdate();
      this.shadowRoot.querySelector('#new-item').value = '';
    }

    deleteItem(id) {
      this.data.removeItem(id);
      this.requestUpdate();
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

    renderItem(item) {
      const formatter = new Intl.DateTimeFormat('en-AU', {dateStyle: 'full' });
      const humanDate = formatter.format(new Date(item.date));
      return html`<div class="item">
        <div class="content">
          <p>${item.text}</p>
          <div class="action" @click=${() => this.deleteItem(item.id)}>
            ${DELETE_ICON}
          </div>
        </div>
        <p class="date">${humanDate}</p>
      </div>`;
    }

    renderJournal() {
      return html`
      <div class="journal" @keydown=${(e) => e.key === 'Enter' && this.addItem()}>
        <h1>Your Worries</h1>
        <div class="new-entry">
          <input id="new-item"/>
          <div class="action" @click=${() => this.addItem()}>
            ${ADD_ICON}
          </div>
        </div>
        <div class="history">
          ${this.data.items.map(item => this.renderItem(item))}
        </div>
      </div>
      `;
    }
  }
  
  customElements.define("app-view", AppView);