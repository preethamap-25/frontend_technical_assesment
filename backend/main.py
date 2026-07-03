from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

app = FastAPI()

# Allow the React dev server (localhost:3000) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


class Node(BaseModel):
    id: str
    type: Optional[str] = None
    position: Optional[Dict[str, Any]] = None
    data: Optional[Dict[str, Any]] = None


class Edge(BaseModel):
    id: Optional[str] = None
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None


class PipelineRequest(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Detects whether the given directed graph is acyclic using
    iterative DFS with white/gray/black coloring (avoids Python's
    recursion limit for large pipelines).
    """
    adjacency: Dict[str, List[str]] = {node.id: [] for node in nodes}
    for edge in edges:
        if edge.source in adjacency:
            adjacency[edge.source].append(edge.target)

    WHITE, GRAY, BLACK = 0, 1, 2
    color = {node.id: WHITE for node in nodes}

    def has_cycle(start: str) -> bool:
        stack = [(start, iter(adjacency.get(start, [])))]
        color[start] = GRAY

        while stack:
            node, neighbors = stack[-1]
            found_next = False
            for neighbor in neighbors:
                if neighbor not in color:
                    continue
                if color[neighbor] == GRAY:
                    return True
                if color[neighbor] == WHITE:
                    color[neighbor] = GRAY
                    stack.append((neighbor, iter(adjacency.get(neighbor, []))))
                    found_next = True
                    break
            if not found_next:
                color[node] = BLACK
                stack.pop()

        return False

    for node in nodes:
        if color[node.id] == WHITE:
            if has_cycle(node.id):
                return False

    return True


@app.post('/pipelines/parse')
def parse_pipeline(pipeline: PipelineRequest):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag = is_dag(pipeline.nodes, pipeline.edges)

    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': dag,
    }