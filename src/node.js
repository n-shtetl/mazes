class Node {
    constructor(val, coord) {
        this.val = val;
        this.coord = [...coord];
        this.neighbors = [];
    }
}

export default Node;