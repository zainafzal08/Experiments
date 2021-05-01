import { LitElement, html, css } from "https://unpkg.com/lit-element?module";

import {DELETE_ICON, RETORT_ICON, STORM_ICON} from './icons.js';

export class WorryJournal extends LitElement {
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
        .journal {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-direction: column;
        }

        .history {
          width: 100%;
          margin-bottom: 32px;
          height: calc(100vh - 50px - 32px);
          overflow: scroll;
        }

        .history .item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-bottom: 16px;
          width: 100%;
          color: #BBB;
        }
        .history .item.retort {
          margin-bottom: 8px;
          color: white;
          align-items: flex-end;
        }
        
        .history .item .content {
          width: 85%;
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

        .empty-state {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #BBB;
        }
        .empty-state p {
          width: 350px;
          margin: 0;
          padding: 0;
          color: #BBB;
          text-align: center;
        }
        .empty-state svg {
          width: 124px;
          height: 124px;
          margin-bottom: 48px;
        }
        .empty-state p svg {
          width: 16px;
          height: 16px;
          margin-bottom: 0;
        }
      `;
    }
  
    render() {
        return html`
            <div class="journal" @keydown=${(e) => e.key === 'Enter' && this.addItem()}>
                <div class="history">
                    ${this.data.worries.map(item => this.renderItem(item))}
                    ${this.data.worries.length === 0 ? this.renderEmptyState() : ''}
                </div>
            </div>`;
    }

    // Worry Journal Implementation.
    addItem(fieldValues) {
      const text = fieldValues.worry;
      if (!text || text.length === 0) return;
      this.data.addWorryItem({text});
      this.requestUpdate();
    }

    addRetort(parentID) {
      const text = window.prompt('What is your response to this worry?');
      if (text.length === 0) return;
      this.data.addRetort({parentID, text});
      this.requestUpdate();
    }

    deleteRetort(retortId) {
      this.data.removeRetort(retortId);
      this.requestUpdate();
    }

    deleteItem(id) {
      this.data.removeWorryItem(id);
      this.requestUpdate();
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

    renderEmptyState() {
      return html`
        <div class="empty-state">
          ${STORM_ICON}
          <p>
            Sometimes the mind can feel stormy. Take a breath, jot down your worry
            or insecurity, and let it go. You can use the ${RETORT_ICON} button later
            to rebutt your worry.
          </p>
        </div>`;
    }

    getFieldList() {
      return [
        {
          id: 'worry',
          label: 'Worry',
          type: 'textarea'
        }
      ];
    }
  }
  
  customElements.define("worry-journal", WorryJournal);