import { LitElement, html, css } from "https://unpkg.com/lit-element?module";

import tasks from './tasks.js';

class TodoListItem extends LitElement {

  static get properties() {
    return { 
      id: { type: String },
      title: { type: String },
      subtitle: { type: String },
      checked: { type: Boolean, reflect: true, attribute: true },
    };
  }
  
  firstUpdated() {
    this.downSync();
    this.shadowRoot
      .querySelector('#check')
      .addEventListener('click', () => {
      this.toggleCheck();
    });
    this.shadowRoot
      .querySelector('#delete')
      .addEventListener('click', () => {
      this.delete();
    });
  }

  downSync() {
    const {title, subtitle, checked} = tasks.getTask(this.id);
    this.title = title;
    this.subtitle = subtitle;
    this.checked = checked;
  }
  upSync() {
    tasks.updateTaskStatus(this.id, this.checked);
  }

  static get styles() {
    return css`
      :host {
        width: calc(100% - 32px);
        margin: 0 16px;
        height: 44px;
        border-bottom: 2px solid #F3F3F3;
        display: grid;
        grid-template-columns: 40px auto 30px;
        grid-template-rows: auto auto;
        grid-template-areas: "side text delete"
        "side text delete";
        --check-color: #E5E5E5;
        --cross-color: #F2F2F2;
        padding: 8px 0;
      }
      .side {
        grid-area: side;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
      .delete {
        grid-area: delete;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
      :host([checked]) .side > svg {
        --check-color: var(--theme-light);
      }
      .side > svg:hover {
        --check-color: var(--theme-light);
        cursor: pointer;
      }
      :host([checked]) .side > svg:hover {
        transform: scale(1.08);
      }

      .delete > svg:hover {
        --cross-color: #FF7B7F;
        cursor: pointer;
      }
      .text {
        grid-area: text;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-direction: column;
      }
      .title {
        grid-area: title;
        color: #444;
        font-size: 16px;
      }
      .subtitle {
        grid-area: subtitle;
        color: #BBB;
        font-size: 12px;
        margin-top: 4px;
      }
      p {
        margin: 0;
        padding: 0;
      }
    `;
  }

  delete() {
    tasks.deleteTask(this.id);
  }

  toggleCheck() {
    this.checked = !this.checked;
    this.upSync();
  }

  render() {
    return html`
      <div class="side">
        <svg id="check" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path fill="var(--check-color)"; d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      <div class="text">
        <p class="title">${this.title}</p>
        <p class="subtitle">${this.subtitle}</p>
      </div>
      <div class="delete">
        <svg id="delete" style="width:20px;height:20px" viewBox="0 0 24 24"}>
            <path fill="var(--cross-color)" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
        </svg>
      </div>
    `;
  }
}

customElements.define("todo-list-item", TodoListItem);