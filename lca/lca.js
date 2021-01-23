/**
 * https://www.spoj.com/problems/LCA/
 * Apply Sparse table
 */
// https://codingcompetitions.withgoogle.com/kickstart/round/000000000019ff49/000000000043b0c6#problem
process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', inputStdin => {
    inputString += inputStdin;
});

process.stdin.on('end', _ => {
    inputString = inputString.trim().split('\n').map(string => {
        return string.trim();
    });
    main();    
});

function readLine() {
    return inputString[currentLine++];
}

const dfs = (tree, node, prev, parent, depth) => {
    depth[node] = prev === -1 ? 0 : depth[prev] + 1;
    parent[node][0] = prev; // sparse table at level 2^0 will be the parent itself 
    // process all children
    for (let i=0; i < tree[node].length; i++) {
        const child = tree[node][i];
        // skip processing parent
        if(child !== prev) {
            dfs(tree, child, node, parent, depth);
        }
    }
}

const buildSparseTable = (tree) => {
    const n = tree.length;        
    const m = Math.floor(Math.log2(n)) + 1;
    const table = new Array(n).fill(0).map(a => new Array(m).fill(0));

    const depth = new Array(n).fill(0);
    // pre-compute the depth for each node and their first parent(2^0th parent) time complexity : O(n)
    dfs(tree, 0, -1, table, depth);

    // build sparse table for rest
    for (let j=1; j < m; j++) {
        for (let node = 0; node < n; node++) {
            if(table[node][j-1] !== -1) {
                table[node][j] = table[table[node][j-1]][j-1];

             }
        }
    }
    return [ table, depth];
}

const runQueryToGetLCA = (table, depth, u, v) => {
    const m = table[0].length;

    if(depth[v] < depth[u]) {
        // swap p and q
        return runQueryToGetLCA(table, depth, v, u)
    }
    const diff = depth[v] - depth[u];
    for (let j=0; j < m; j++) {
        if((diff >> j) & 1 === 1) {
            v = table[v][j];
        }
    }
    // if depth became same
    if(u === v) {
        return u;
    }
    // Run query
    for (let j= m-1; j >=0; j--) {
        if(table[u][j] !== table[v][j]) {
            u = table[u][j];
            v = table[v][j];
        }
    }
    return table[u][0]+1;
}

const main = () => {
    let t = readLine();
    t = parseInt(t);
    let i = 1;
    
    while(t--) {
        const n = parseInt(readLine(), 10);
        const graph = new Array(n).fill(a => []);        
        for (let i=0; i < n; i++) {
            const children = readLine().split(' ').map(a => parseInt(a, 10) - 1);
            children.shift(); // drop count of children
            graph[i] = children;
        }

        const queriesCount = parseInt(readLine(), 10);
        console.log(`Case ${t+1}:`);
        for (let i=0; i < queriesCount; i++) {
            const [p, q] = readLine().split(' ').map(a => parseInt(a, 10) - 1);

            // solve problem
            const [sparseTable, depth] = buildSparseTable(graph);
            const lca = runQueryToGetLCA(sparseTable, depth, p, q);
            console.log(lca);
        }

        i++;
    }
}