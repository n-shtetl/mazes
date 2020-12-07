class Stack {
    constructor() {
        this.data = [];
    }

    isEmpty() {
        return this.data.length === 0;
    }

    push(...vals) {
        for (let val of vals) {
            this.data.push(val);
        }
    }
    
    pop() {
        if (this.isEmpty()) return "Stack empty";
        else return this.data.pop();
    }

    peek() {
        return this.data[this.data.length-1];
    }

    printStack() {
        let stackStr = "";
        for (let i = 0; i < this.data.length; i++) {
            stackStr += this.data[i] + "\n"
        }
        return stackStr;
    }
}

export default Stack;