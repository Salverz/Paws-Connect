const connections = [
	[1,2],
	[2,3],
	[1,3],
	[4,6],
	[1,5],
	[5,2],
	[8,2],
	[9,7],
	[7,8]
]

function getShortestPath(connections, startNode, endNode) {
	startNode = parseInt(startNode)
	endNode = parseInt(endNode)
	// console.log("connections are ")
	// console.log(connections)
	// console.log(startNode, endNode)
	// Enqueue the starting node
	let queue = []
	queue.push(startNode)
	let visited = []
	console.log(queue)

	const graph = {};

	const sourceNodes = {}

	// Create the adjacency list
	connections.forEach(connection => {
		if (!graph[connection[0]]) {
			console.log(`setting ${connection[0]} to empty`)
			graph[connection[0]] = []
		}
		if (!graph[connection[1]]) {
			console.log(`setting ${connection[1]} to empty`)
			graph[connection[1]] = []
		}

		graph[connection[0]].push(connection[1])
		graph[connection[1]].push(connection[0])
		//console.log(`appending ${connection[1]} to list for ${connection[0]}`)
		// console.log(`appending ${connection[0]} to list for ${connection[1]}`)
	})

	console.log(graph)

	// Traverse the graph until all nodes have been visited
	while (queue.length > 0) {
		// Dequeue first node in queue
		const currentNode = queue.shift()
		visited.push(currentNode)

		// Add each node adjacent to the current node into the queue
		try { // For a strange error where graph[currentNode] is undefined
			graph[currentNode].forEach(node => {
				if (!visited.includes(node) && !queue.includes(node)) {
					queue.push(node)
				}

				// Mark the shortest source node to the current node
				if (!sourceNodes[node]) {
					sourceNodes[node] = currentNode
				} 
			})
		} catch (error) {
			console.log(error)
			console.log(graph)
			console.log(graph[currentNode])
		}
	}

	// console.log("done")
	// console.log(visited)
	// console.log(queue)
	// console.log(sourceNodes)
	let path = [endNode]

	// Get the shortest path
	if (!visited.includes(endNode)) {
		return [];
	}

	let backwardsTraversalCurrentNode = endNode
	while (backwardsTraversalCurrentNode != startNode) {
		path.unshift(sourceNodes[backwardsTraversalCurrentNode])
		backwardsTraversalCurrentNode = sourceNodes[backwardsTraversalCurrentNode]
	}

	// console.log(path)
	return(path)
}

// console.log(getShortestPath(connections, 1, 9))

module.exports = { getShortestPath };
