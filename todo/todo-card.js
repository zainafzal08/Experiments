import { LitElement, html, css } from "https://unpkg.com/lit-element?module";
import "./todo-list-item.js"
import tasks from "./tasks.js"

class TodoCard extends LitElement {

  static get properties() {
    return { 
      id: { type: String },
      items: { type: Array }
    };
  }

  constructor() {
    super();
    this.id = '';
    this.items = [];
    tasks.listen('task-change', () => {
      this.tasksChanged();
    });
  }

  static get styles() {
    return css`
      .card {
        width: 320px;
        height: 420px;
        background: white;
        box-shadow: 5px 4px 5px rgba(108, 212, 249, 0.09);
        border-radius: 30px;
      }
      .header>div {
        font-size: 1.3rem;
        width: 100%;
        max-width: 100%;
        height: 1.6rem;
        max-height: 1.6rem;
        white-space: nowrap;
        overflow: hidden;
        padding: 0 15px 0 30px;
      }
      .header>div:focus {
        outline: none;
      }
      .header {
        width: 100%;
        min-height: 70px;
        height: 70px;
        border-top-left-radius: 30px;
        border-top-right-radius: 30px;
        border-bottom-left-radius: 30px;
        border-bottom-right-radius: 0px;
        background: var(--theme-light);
        box-shadow: 0px 2px 4px rgba(108, 212, 249, 0.50);
        display: flex;
        align-items: center;
        color: white;
      }
      .items {
        margin-top: 8px;
        height: calc(100% - 78px - 16px);
        width: 100%;
        overflow-y: scroll;
      }
      .items::-webkit-scrollbar {
         display: none;
      }
      .add-task {
        width: 100%;
        height: 60px;
        margin-top: 8px;
        display: grid;
        grid-template-rows: auto 24px auto;
        grid-template-columns: 16px 24px auto 16px;
        grid-template-areas:  "a a inputs d"
                              "c icon inputs d"
                              "b b inputs d";
      }
      .add-task svg {
        grid-area: icon;
      }
      .inputs {
        grid-area: inputs;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }

      input {
        width: 80%;
        background: none;
        border: none;
        font-size: 1rem;
        color: #999;
        margin: 4px 0;
        border-bottom: 2px solid #EBEBEB;
        outline: none;
      }
      input:focus {
        border-bottom: 2px solid var(--theme-light);
      }
      input::placeholder {
        color: #DDD;
      }
    `;
  }

  syncTitle() {
    const newVal = this.shadowRoot.querySelector('#title').innerText;
    tasks.setTopicTitle(this.id, newVal);
  }

  firstUpdated() {
    const val = tasks.getTopicTitle(this.id);
    this.shadowRoot.querySelector('#title').innerText = val;

    this.tasksChanged();

    this.shadowRoot
      .querySelector('#title')
      .addEventListener('input', () => {
        this.syncTitle();
      })

      this.shadowRoot
      .querySelector('.add-task')
      .addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.newTask();
        }
      })
  }

  tasksChanged() {
    this.items = tasks.getTasksForTopic(this.id);
  }

  newTask() {
    const title = this.shadowRoot.querySelector('#title-input').value;
    const subtitle = this.shadowRoot.querySelector('#subtitle-input').value;
    tasks.addTask(this.id, title, subtitle);
    this.shadowRoot.querySelector('#title-input').value = '';
    this.shadowRoot.querySelector('#subtitle-input').value = '';
  }

  render() {
    return html`
    <div class="card">
      <div class="header">
        <div id="title" contenteditable="true"></div>
      </div>
      <div class="items">
        ${this.items.map(id => html`
          <todo-list-item
            id=${id}
          >
          </todo-list-item>
        `)}
      </div>
    </div>
    <div class="add-task">
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path fill="#E5E5E5"; d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <div class="inputs">
        <input id="title-input" placeholder="Task Title"/>
        <input id="subtitle-input" placeholder="Task Subtitle"/>
      </div>
    </div>
    `;
  }
}

customElements.define("todo-card", TodoCard);
