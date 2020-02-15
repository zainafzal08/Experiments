import { LitElement, html, css } from "https://unpkg.com/lit-element?module";
import tasks from "./tasks.js"
import './todo-card.js'

class AppView extends LitElement {

  constructor() {
    super();
    tasks.listen('task-edit', () => {
      this.progress = tasks.getProgress();
    });
    this.progress = tasks.getProgress();
  }

  static get properties() {
    return { 
      progress: { type: Number }
    };
  }

  static get styles() {
    return css`
      :host {
        width: 100%;
        height: 100vh;
        padding: 48px 64px;
        box-sizing: border-box;
        display: flex;
        flex-direction: flex-start;
        align-items: center;
        flex-direction: column;
        --theme-light: #6CD4F9;
        --theme-dark: #2980B9;
      }
      h1, h2 {
        font-size: 3rem;
        color: #444;
        margin: 0;
        padding: 0;
      }
      h2 {
        margin-top: 1rem;
        font-size: 1.6rem;
        color: #BBB;
      }
      .progress {
        width: 100%;
        height: 8px;
        border-radius: 50px;
        background: #EBEBEB;
        margin-top: 48px;
      }
      .bar {
        height: 100%;
        border-radius: 50px;
        transition: all .5s;
        background: linear-gradient(90deg, var(--theme-dark) 0%, var(--theme-light) 100%);
      }
      .progress-label {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 10px;
      }
      .progress-label span {
        color: var(--theme-light);
        font-size: 1.5rem;
      }
      .grid {
        margin-top: 48px;
        width: 100%;
        display: flex;
        justify-content: space-around;
      }
    `;
  }

  render() {
    return html`
      <h1>Todo</h1>
      <h2>What's the plan for today?</h2>
      <div class="progress">
        <div class="bar"  style=${`width: ${this.progress}%`}></div>
      </div>
      <div class="progress-label">
        <span>${`${this.progress}%`}</span>
      </div>
      <div class="grid">
        <todo-card id='first'></todo-card>
        <todo-card id='second'></todo-card>
        <todo-card id='third'></todo-card>
      </div>
    `;
  }
}

customElements.define("app-view", AppView);