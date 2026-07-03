import { nodeConfigs } from './nodesConfig';

export function buildNode(type, position, getNodeID) {
  const id = getNodeID(type);
  const config = nodeConfigs[type];
  const defaults = config
    ? Object.fromEntries(config.fields.map((f) => [f.name, f.default ?? '']))
    : {};

  return {
    id,
    type,
    position,
    data: defaults,
  };
}