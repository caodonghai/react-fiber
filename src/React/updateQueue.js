export class Update {
    constructor(payload) {
        this.payload = payload
    }
}

//数据结构是一个单链表
export class UpdateQueue {
    constructor() {
        this.firstUpdate = null;
        this.lastUpdate = null;
    }
    enqueueUpdate(update) {
        if (this.lastUpdate == null) {
            this.firstUpdate = update;
            this.lastUpdate = update;
        } else {
            this.firstUpdate.nextUpdate = update;
            this.lastUpdate = update;
        }
    }
    forceUpdate(state) {
        let currentUpdate = this.firstUpdate;
        while (currentUpdate) {
            let nextState = typeof currentUpdate.payload === 'function' ? currentUpdate.payload(state) : currentUpdate.payload;
            state = {...state, ...nextState}
            currentUpdate = currentUpdate.nextUpdate
        }
        //清空链表
        this.firstUpdate = null;
        this.lastUpdate = null;
        return state
    }
}