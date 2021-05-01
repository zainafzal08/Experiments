import { LitElement, html, css } from "https://unpkg.com/lit-element?module";

import {EDIT_ICON, DELETE_ICON} from './icons.js';

export class ThoughtDiary extends LitElement {
    // Lit Element Implementation.
    static get properties() {
        return {
            data: {
                type: Object
            }
        }
    }

    static get styles() {
      return css`
        :host {
          width: 100%;
          height: 100%;
        }
        main {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
        }
        .page {
          width: 100%;
          height: 100%;
          transform: translateX(0px);
          transition: transform .3s;
        }
        .page.closed {
          transform: translateX(-100%);
        }
        .history {
          width: 100%;
          height: calc(100% - 48px);
          margin-top: 16px;
          overflow: scroll;
          display: flex;
          flex-direction: column;
        }

        .history .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 16px;
          width: 100%;
          color: #BBB;
        }
        .history .item .content {
          width: 100%;
          box-sizing: border-box;
          padding-left: 16px;
          padding-right: 8px;
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
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .history .item .content .action:hover {
          color: var(--primary-color);
        }
        .history .item .content p {
          width: calc(100% - 56px);
          margin: 0;
          padding: 16px 24px 16px 0;
          color: #444;
        }
        .history .item .date {
          font-size: 10px;
          color: #bbb;
          padding-left: 3px;
        }
        span[data-highlight] {
          color: var(--primary-color);
        }
      `;
    }
    
    addItem(fieldValues) {
      this.data.updateThoughtDiaryItem({...fieldValues});
    }

    getFieldList() {
      return [
        {
          id: 'situation',
          type: 'textarea',
          label: 'Situation'
        },
        {
          id: 'emotion',
          type: 'textarea',
          label: 'Emotion + rating'
        },
        {
          id: 'thought',
          type: 'textarea',
          label: 'Thought + belief (* most upsetting)'
        },
        {
          id: 'evidenceFor',
          type: 'textarea',
          label: 'Evidence for most upsetting'
        },
        {
          id: 'evidenceAgainst',
          type: 'textarea',
          label: 'Evidence against most upsetting'
        },
        {
          id: 'altThought',
          type: 'textarea',
          label: 'Alternative thought + belief'
        },
        {
          id: 'emotionRerate',
          type: 'textarea',
          label: 'Rerate emotion'
        },
        {
          id: 'thoughtRerate',
          type: 'textarea',
          label: 'Rerate thought'
        },
        {
          id: 'next',
          type: 'textarea',
          label: 'Whats next'
        },
      ];
    }

    deleteItem(id) {
      if (window.confirm('Are you sure?')) {
        this.data.removeThoughtDiaryItem(id);
        this.requestUpdate();
      }
    }

    editItem(id) {
      const item = this.data.thoughts.find(item => item.id === id);
      if (!item) {
        throw new Error(`item ${id} could not be found`);
      }
      this.dispatchEvent(new CustomEvent('edit-item', {
        detail: item,
        bubbles: true,
        composed: true
      }));
    }

    renderThought(item) {
      const formatter = new Intl.DateTimeFormat('en-AU', {dateStyle: 'full' });
      const humanDate = formatter.format(new Date(item.date));
      const isCompleted = Object.values(item).reduce((a,v) => a && v !== '', true);
      return html`
        <div class="item">
          <div class="content">
            <p>${item.situation}</p>
            <div class="action" @click=${() => this.deleteItem(item.id)}>
              ${DELETE_ICON}
            </div>
            <div class="action" @click=${() => this.editItem(item.id)}>
              ${EDIT_ICON}
            </div>
          </div>
          <p class="date">${humanDate} · <span ?data-highlight=${!isCompleted}>${isCompleted ? 'Completed' : 'Needs Reflection'}</span></p>
        </div>
      `;
    }

    render() {
        return html`
        <main>
          <div class="page">
            <div class="history">
              ${this.data.thoughts.map(t => this.renderThought(t))}
            </div>
          </div>
        </main>
        `;
    }
    
    firstUpdated() {
      this.data.onReady(() => this.requestUpdate());
    }
  }
  
  customElements.define("thought-diary", ThoughtDiary);