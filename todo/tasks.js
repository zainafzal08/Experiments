class Tasks {
    constructor() {
        // maps topic --> title
        this.topicToTitle = {};
        // maps topic ==> task_id[]
        this.topicToTasks = {};
        // maps task_id ==> task
        this.tasks = {};
        // Listeners for various events.
        this.listeners = [];
        this.fetchState();
    }

    /**
     * event can be
     *     task-change: triggered whenever a task has been added or
     *     removed.
     *     task-edit: triggered whenever a task has been added, removed
     *     or updated.
     */
    listen(event, listener) {
        if (this.listeners[event] === undefined) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
    }

    callAllListeners_(event) {
        if (this.listeners[event] === undefined) {
            return;
        }
        this.listeners[event].map(f => f());
    }

    setTopicTitle(topic, title) {
        this.topicToTitle[topic] = title;
        this.saveState();
    }

    getTopicTitle(topic) {
        const title = this.topicToTitle[topic];
        if (title === undefined) return 'Topic';
        return title;
    }

    getTasksForTopic(topic) {
        if (this.topicToTasks[topic] === undefined) {
            return [];
        }
        return [...this.topicToTasks[topic]];
    }

    setTasksForTopic_(topic, tasks) {
        this.topicToTasks[topic] = tasks;
    }

    getTask(taskId) {
        return this.tasks[taskId];
    }
    
    addTask(topic, title, subtitle) {
        const topicTasks = this.getTasksForTopic(topic);
        const newTask = {
            id: Math.random().toString(36).substring(7),
            title: title,
            subtitle: subtitle,
            checked: false
        };
        topicTasks.push(newTask.id);
        this.tasks[newTask.id] = newTask;
        this.setTasksForTopic_(topic, topicTasks);
        this.callAllListeners_('task-change');
        this.callAllListeners_('task-edit');
        this.saveState();
    }

    updateTaskStatus(taskId, checked) {
        this.tasks[taskId].checked = checked;
        this.callAllListeners_('task-edit');
        this.saveState();
    }
    
    deleteTask(taskId) {
        delete this.tasks[taskId];
        for (const topic of Object.keys(this.topicToTasks)) {
            this.topicToTasks[topic] = this.topicToTasks[topic]
                .filter(x => x !== taskId);
        }
        this.callAllListeners_('task-change');
        this.callAllListeners_('task-edit');
        this.saveState();
    }

    fetchState() {
        let state = localStorage.getItem('state');
        if (!state) return;
        state = JSON.parse(state);
        this.topicToTitle = state.titles;
        this.topicToTasks = state.topics;
        this.tasks = state.tasks;
    }

    saveState() {
        const state = {
            titles: this.topicToTitle,
            topics: this.topicToTasks,
            tasks: this.tasks
        };
        localStorage.setItem('state', JSON.stringify(state));
    }

    getProgress() {
        const total = Object.keys(this.tasks).length;
        const done = Object.values(this.tasks).filter(t => t.checked).length;
        if (total === 0) {
            return 0;
        }
        return Math.round((done/total)*100);
    }
}

const tasks = new Tasks();
export default tasks;